#!/usr/bin/env python3
"""Client réutilisable pour l'API publique n8n de NEOXIX (version 2.35.7).

Sécurité :
- La clé est lue dans son fichier à chaque appel (par défaut ~/.config/neoxix/n8n-api-key).
  Elle n'est jamais prise dans les arguments, les variables d'environnement, ni affichée.
- Les sauvegardes sont écrites hors du dépôt, dans ~/.config/neoxix/backups (dossier 700, fichiers 600).
- Ce script ne modifie que le workflow passé en argument.

Accès : l'API n'est joignable que depuis srv-n8n. Ouvrir d'abord un tunnel local :
  ssh -f -N -o ExitOnForwardFailure=yes -L 127.0.0.1:15678:127.0.0.1:5678 srv-n8n
Le port local peut être changé avec NEOXIX_N8N_URL=http://127.0.0.1:<port>/api/v1.

Commandes :
  check                          Vérifie l'authentification (GET /workflows)
  list                           Liste les workflows (id, état, nom)
  get <id>                       Affiche un workflow en JSON
  backup <id>                    Sauvegarde le workflow (et sa version publiée) hors dépôt
  draft <id> <body.json>         Enregistre un brouillon SANS republier (publishIfActive=false)
  publish <id> <versionId>       Publie une version précise (méthode supportée)
  rollback <id> <versionId>      Republie une version antérieure (même appel que publish)
  executions <id> [status]       Liste les exécutions (status : error, success, waiting, …)
  version <id> <versionId>       Lit une version précise de l'historique
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

KEY_FILE = os.path.expanduser("~/.config/neoxix/n8n-api-key")
BACKUP_DIR = os.path.expanduser("~/.config/neoxix/backups")
BASE = os.environ.get("NEOXIX_N8N_URL", "http://127.0.0.1:15678/api/v1")

# Champs acceptés par PUT /workflows/{id} (additionalProperties: false dans l'OpenAPI).
PUT_FIELDS = ("name", "description", "nodes", "connections", "settings", "staticData", "nodeGroups")


def _read_key():
    with open(KEY_FILE, "r", encoding="utf-8") as fh:
        return fh.read().strip()


def call(method, path, body=None):
    headers = {"X-N8N-API-KEY": _read_key(), "Accept": "application/json"}
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(BASE + path, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, (json.loads(raw) if raw else None)
    except urllib.error.HTTPError as err:
        raw = err.read().decode("utf-8", "replace")
        try:
            return err.code, json.loads(raw)
        except json.JSONDecodeError:
            return err.code, {"raw": raw[:300]}


def _save_protected(name, obj):
    os.makedirs(BACKUP_DIR, mode=0o700, exist_ok=True)
    os.chmod(BACKUP_DIR, 0o700)
    path = os.path.join(BACKUP_DIR, name)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, ensure_ascii=False, indent=2)
    os.chmod(path, 0o600)
    return path


def _stamp():
    return time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())


def cmd_check():
    st, body = call("GET", "/workflows?limit=1")
    print(f"HTTP {st}")
    if st == 200:
        print("authentification OK")
    else:
        print(json.dumps(body, ensure_ascii=False)[:300])
    return 0 if st == 200 else 1


def cmd_list():
    st, body = call("GET", "/workflows?limit=250")
    if st != 200:
        print(f"HTTP {st}", json.dumps(body, ensure_ascii=False)[:300])
        return 1
    for wf in body.get("data", []):
        state = "active" if wf.get("active") else "inactive"
        print(f"{wf.get('id')}\t{state}\t{wf.get('name')}\tupdated={wf.get('updatedAt')}")
    return 0


def cmd_get(wid):
    st, body = call("GET", f"/workflows/{wid}")
    if st != 200:
        print(f"HTTP {st}", json.dumps(body, ensure_ascii=False)[:300])
        return 1
    print(json.dumps(body, ensure_ascii=False, indent=2))
    return 0


def cmd_backup(wid):
    st, body = call("GET", f"/workflows/{wid}")
    if st != 200:
        print(f"HTTP {st}")
        return 1
    path = _save_protected(f"{wid}-{_stamp()}.json", body)
    print(f"sauvegarde : {path}")
    print(f"versionId={body.get('versionId')} activeVersionId={body.get('activeVersionId')} active={body.get('active')}")
    return 0


def cmd_draft(wid, body_file):
    with open(body_file, "r", encoding="utf-8") as fh:
        payload = json.load(fh)
    clean = {k: payload[k] for k in PUT_FIELDS if k in payload}
    st, body = call("PUT", f"/workflows/{wid}?publishIfActive=false", clean)
    print(f"HTTP {st}")
    if st != 200:
        print(json.dumps(body, ensure_ascii=False)[:500])
        return 1
    print(f"brouillon enregistré : versionId={body.get('versionId')} activeVersionId={body.get('activeVersionId')}")
    return 0


def cmd_publish(wid, version_id):
    st, body = call("POST", f"/workflows/{wid}/publish", {"versionId": version_id})
    print(f"HTTP {st}")
    if st != 200:
        print(json.dumps(body, ensure_ascii=False)[:500])
        return 1
    print(f"publié : activeVersionId={body.get('activeVersionId')} active={body.get('active')}")
    return 0 if body.get("activeVersionId") == version_id else 1


def cmd_executions(wid, status=None):
    query = {"workflowId": wid, "limit": 20}
    if status:
        query["status"] = status
    st, body = call("GET", "/executions?" + urllib.parse.urlencode(query))
    if st != 200:
        print(f"HTTP {st}", json.dumps(body, ensure_ascii=False)[:300])
        return 1
    for ex in body.get("data", []):
        print(f"{ex.get('id')}\t{ex.get('status')}\t{ex.get('startedAt')}\t{ex.get('stoppedAt')}")
    return 0


def cmd_version(wid, version_id):
    st, body = call("GET", f"/workflows/{wid}/{version_id}")
    print(f"HTTP {st}")
    if st != 200:
        print(json.dumps(body, ensure_ascii=False)[:300])
        return 1
    print(json.dumps(body, ensure_ascii=False, indent=2))
    return 0


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    cmd, args = argv[1], argv[2:]
    table = {
        "check": (cmd_check, 0),
        "list": (cmd_list, 0),
        "get": (cmd_get, 1),
        "backup": (cmd_backup, 1),
        "draft": (cmd_draft, 2),
        "publish": (cmd_publish, 2),
        "rollback": (cmd_publish, 2),
        "executions": (cmd_executions, 1),
        "version": (cmd_version, 2),
    }
    if cmd not in table:
        print(__doc__)
        return 2
    fn, nargs = table[cmd]
    if len(args) < nargs:
        print(__doc__)
        return 2
    return fn(*args[:nargs]) if cmd != "executions" else fn(*args[:1], *args[1:2])


if __name__ == "__main__":
    sys.exit(main(sys.argv))
