# MISSION NEOXIX-LOT0-GIT-001 · Sauvegarde, commit du Lot 0 et rebase

Destinataire : Claude Code (seul agent de développement autorisé).
Autorité : propriétaire NEOXIX, autorisation écrite D4 du 4 novembre 2026 : sauvegarde, commit du Lot 0, rebase sur la base choisie.
Prérequis : rapport Codex `NEOXIX-GIT-PRESERVATION-001` (fait), voir ci-dessous.

## CONTEXTE VÉRIFIÉ (rapport Codex)

- `feat/dynamic-portfolio` : HEAD `8e6e7b1`, inchangé.
- `archive/theme-lime-2026-11-04` : `21c725fdf6edd4bb2e3d1d0a486c6b47ca0af61d`, depuis `8e6e7b1`. Thème lime archivé.
- `fix/reveal-safari` : `787eeae88d22d9118ed45c2c833d1059fae02282`, depuis `8e6e7b1`. Contient `reveal.tsx` seul.
- Sauvegarde : `~/neoxix-backups/2026-11-04-lime-reveal/` (hors dépôt), avec `backup.patch`, `status.txt`, `SHA256SUMS.txt`, `RAPPORT-CODEX-GIT.md`.
- Dépôt de travail : `/home/kodjo/GitHub/neoxix-web`. Worktree services : `/home/kodjo/worktrees/neoxix-web-services`, branche `feat/services-platform`, HEAD `cbcf7a1` (= `main`).
- Base choisie pour le rebase : `fix/reveal-safari` (`787eeae`). Elle contient les pages dynamiques et le correctif reveal, sans le thème lime.

## DÉFINITION DU LOT 0

Le Lot 0 est le socle documentaire et de conception, sans code applicatif :
- `design/v3/index.html` : maquette v3 (fichier fourni par le propriétaire, à copier tel quel).
- `docs/neoxix-services/MISSION-LOT-1-CLAUDE-CODE.md` et `docs/neoxix-services/MISSION-CODEX-GIT.md` : missions.
- `docs/neoxix-services/MISSION-LOT0-GIT-CLAUDE-CODE.md` : la présente mission.

Aucun autre fichier n'entre dans le Lot 0.

## OBJECTIF

1. Sauvegarder l'état du worktree services avant toute opération.
2. Committer le Lot 0 sur `feat/services-platform`.
3. Rebaser `feat/services-platform` sur `fix/reveal-safari`, seulement si les conditions du point d'arrêt sont remplies.

## PÉRIMÈTRE

Étape 1 : inspection (lecture seule)
- Dans le worktree services : `git status --porcelain=v1`, `git branch -vv`, `git log -3 --oneline`, `git worktree list`.
- Confirmer HEAD `cbcf7a1` sur `feat/services-platform`. Sinon, s'arrêter.
- Vérifier que `787eeae` existe dans le dépôt : `git cat-file -t 787eeae...`.

Étape 2 : sauvegarde
- Créer `~/neoxix-backups/2026-11-04-services-lot0/` (hors dépôt).
- Copier les fichiers modifiés et non suivis du worktree services, avec `git diff > backup.patch`, `git status --porcelain=v1 > status.txt`, et `SHA256SUMS.txt`.
- Créer aussi `git bundle create ~/neoxix-backups/2026-11-04-services-lot0/services.bundle --all`.
- Vérifier le bundle : `git bundle verify`.

Étape 3 : commit du Lot 0
- Copier la maquette et les missions dans les chemins du Lot 0.
- Vérifier que le contenu de `design/v3/index.html` correspond à la version fournie (empreinte consignée).
- Committer uniquement ces fichiers. Message : `docs(lot0): maquette v3 Ambre et missions de préparation du Lot 1`.
- Ne committer aucun autre fichier.

Étape 4 : rebase (conditionnel)
- Vérifier l'ascendance : `git merge-base --is-ancestor 787eeae HEAD` et `git merge-base --is-ancestor HEAD 787eeae`.
- Un rebase `--ff-only` n'est possible que si `feat/services-platform` est un ancêtre de `787eeae` ou l'inverse dans le sens utile. Sinon, un rebase replaye des commits. Dans ce cas, s'arrêter et rendre le rapport : ne pas rebaser.
- Si l'ascendance le permet, rebaser sur `fix/reveal-safari` avec `git rebase fix/reveal-safari`. Ne jamais utiliser `--force`, `reset --hard` ou `reset` sur des commits non sauvegardés.
- Garder une branche de repli : `git branch backup/services-pre-rebase-2026-11-04 cbcf7a1` avant l'opération.

Étape 5 : rapport
- SHA avant et après, liste des fichiers du commit Lot 0, résultat de l'ascendance, et chemin de la sauvegarde.

## EXCLUSIONS

- Aucun `git push --force`. Aucun push sans demande écrite.
- Aucun `git reset --hard`, `git clean`, `git stash drop`. Aucune suppression de branche ou de fichier.
- Aucun rebase sans la vérification d'ascendance de l'étape 4.
- Aucune modification de `feat/dynamic-portfolio`, `archive/theme-lime-2026-11-04`, `fix/reveal-safari`, ni de `main`.
- Aucun code applicatif (frontend, backend, tests). Le Lot 1 fait l'objet d'une mission séparée.
- Aucune modification DNS. Aucune publication sur `neoxix.ca`. Aucun déploiement.

## CRITÈRES D'ACCEPTATION

1. Sauvegarde complète hors dépôt, avec bundle vérifié et empreintes correspondantes.
2. Commit Lot 0 contenant uniquement les fichiers du Lot 0, empreinte de la maquette vérifiée.
3. Ascendance vérifiée et consignée, avant tout rebase.
4. Si rebase : `feat/services-platform` repose sur `787eeae`, la branche de repli existe, et `git log --oneline` le confirme.
5. Si pas de rebase : rapport explicite, aucune opération destructive, état du worktree inchangé hormis le commit Lot 0.

## VALIDATION

- `git bundle verify` réussi.
- `sha256sum -c SHA256SUMS.txt` réussi.
- `git show --stat HEAD` ne liste que les fichiers du Lot 0.
- `git log --oneline -5` avant et après.
- Résultats en réussis / échoués / non réalisés / limitations.

## LIVRABLES

- `~/neoxix-backups/2026-11-04-services-lot0/` complet, avec `RAPPORT-LOT0-GIT.md`.
- SHA du commit Lot 0, et de la branche de repli si créée.

## RISQUES

- Rebase de `feat/services-platform` sur `fix/reveal-safari` : l'historique de `main` et celui de `feat/dynamic-portfolio` peuvent diverger. Le repli et le bundle permettent de revenir en arrière.
- La maquette doit être copiée depuis la version fournie. Une copie partielle fausserait l'empreinte.

## POINT D'ARRÊT

Arrêter et rendre le rapport à la direction si :
- le HEAD services n'est pas `cbcf7a1` ;
- `787eeae` est introuvable ;
- l'ascendance ne permet pas un fast-forward propre ;
- l'empreinte de la maquette ne correspond pas à la version fournie ;
- une opération demanderait `--force`, `reset --hard` ou une suppression.
