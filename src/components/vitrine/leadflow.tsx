"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { contenu, lienCourriel } from "@/content";
import { LIMITES, erreursParChamp, schemaEtape1, schemaEtape2, type ChampDemande } from "@/lib/demande/schema";

type Mode = "mock" | "live" | "off";
type Phase = "saisie" | "envoi" | "confirmation" | "erreur" | "debit";

type Valeurs = {
  service: string;
  objectif: string;
  lieu: string;
  description: string;
  nom: string;
  courriel: string;
  telephone: string;
  preference: "courriel" | "telephone";
  consentement: boolean;
};

const VIDE: Valeurs = {
  service: "",
  objectif: "",
  lieu: "",
  description: "",
  nom: "",
  courriel: "",
  telephone: "",
  preference: "courriel",
  consentement: false,
};

const CHAMPS_ETAPE_1: ChampDemande[] = ["service", "objectif", "lieu", "description"];
const ORDRE: ChampDemande[] = [...CHAMPS_ETAPE_1, "nom", "courriel", "telephone", "preference", "consentement"];

type Erreurs = Partial<Record<ChampDemande, string>>;

/**
 * Formulaire LeadFlow en deux étapes (maquette V5, § 5).
 * - Validation immédiate avec le schéma partagé ; la route `POST /api/demandes` revalide et fait foi.
 * - `mode="mock"` : bandeau « Mode test » à chaque étape ; le serveur valide puis abandonne la demande.
 * - Sans JavaScript, l'étape 2 reste inaccessible et aucun envoi n'est possible (le courriel reste proposé).
 */
export function LeadFlow({ mode }: { mode: Mode }) {
  const t = contenu.leadflow;
  const [etape, setEtape] = useState<1 | 2>(1);
  const [phase, setPhase] = useState<Phase>("saisie");
  const [valeurs, setValeurs] = useState<Valeurs>(VIDE);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [reference, setReference] = useState("");
  // Vrai une fois hydraté : sans JavaScript, le bouton « Continuer » reste désactivé.
  const pret = useSyncExternalStore(sAbonner, () => true, () => false);
  const debut = useRef(0);
  const cle = useRef("");
  const piege = useRef<HTMLInputElement>(null);
  const formulaire = useRef<HTMLFormElement>(null);
  const aFocaliser = useRef<string | null>(null);
  const id = useId();
  const idChamp = (nom: string) => `${id}-${nom}`;

  useEffect(() => {
    debut.current = Date.now();
  }, []);

  // Déplace le focus après le rendu (changement d'étape, erreur, état final).
  useEffect(() => {
    const cible = aFocaliser.current;
    if (!cible) return;
    aFocaliser.current = null;
    document.getElementById(cible)?.focus();
  });

  if (mode === "off") {
    return (
      <div className="cadre-form">
        <p className="bandeau-simulation" role="note">
          {t.desactive}
        </p>
        <a className="btn btn-fonce" href={lienCourriel()}>
          Écrire à {contenu.site.courriel}
        </a>
      </div>
    );
  }

  const textes = t.modes[mode];

  const modifier = <K extends keyof Valeurs>(champ: K, valeur: Valeurs[K]) => {
    setValeurs((v) => ({ ...v, [champ]: valeur }));
    if (erreurs[champ as ChampDemande]) setErreurs((e) => ({ ...e, [champ]: undefined }));
  };

  const montrerErreurs = (trouvees: Erreurs) => {
    setErreurs(trouvees);
    const premier = ORDRE.find((c) => trouvees[c]);
    if (premier) aFocaliser.current = idChamp(premier === "preference" ? "pref-courriel" : premier);
  };

  const validerEtape1 = (): boolean => {
    const r = schemaEtape1.safeParse(valeurs);
    if (r.success) return true;
    montrerErreurs(erreursParChamp(r.error));
    return false;
  };

  const allerEtape = (n: 1 | 2) => {
    setEtape(n);
    aFocaliser.current = idChamp(n === 2 ? "nom" : "service");
  };

  const envoyer = async () => {
    if (!cle.current) cle.current = crypto.randomUUID();
    setPhase("envoi");
    try {
      const reponse = await fetch("/api/demandes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          demande: valeurs,
          piege: piege.current?.value ?? "",
          dureeRemplissageMs: Math.max(0, Date.now() - debut.current),
          cle: cle.current,
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (reponse.status === 202) {
        const corps = (await reponse.json()) as { reference?: string };
        setReference(corps.reference ?? "");
        setPhase("confirmation");
        aFocaliser.current = idChamp("recommencer");
        return;
      }
      if (reponse.status === 400) {
        const corps = (await reponse.json().catch(() => ({}))) as { champs?: Erreurs };
        if (corps.champs && Object.keys(corps.champs).length > 0) {
          setPhase("saisie");
          const surEtape1 = CHAMPS_ETAPE_1.some((c) => corps.champs?.[c]);
          setEtape(surEtape1 ? 1 : 2);
          montrerErreurs(corps.champs);
          return;
        }
      }
      setPhase(reponse.status === 429 ? "debit" : "erreur");
      aFocaliser.current = idChamp(reponse.status === 429 ? "titre-debit" : "reessayer");
    } catch {
      setPhase("erreur");
      aFocaliser.current = idChamp("reessayer");
    }
  };

  const surEnvoi = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (phase === "envoi") return;
    if (etape === 1) {
      if (validerEtape1()) allerEtape(2);
      return;
    }
    if (!validerEtape1()) {
      setEtape(1);
      return;
    }
    const r = schemaEtape2.safeParse(valeurs);
    if (!r.success) {
      montrerErreurs(erreursParChamp(r.error));
      return;
    }
    void envoyer();
  };

  const recommencer = () => {
    setValeurs(VIDE);
    setErreurs({});
    setReference("");
    setPhase("saisie");
    cle.current = "";
    debut.current = Date.now();
    allerEtape(1);
  };

  const enSaisie = phase === "saisie";
  const decrit = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;
  const invalide = (champ: ChampDemande) => (erreurs[champ] ? true : undefined);
  const erreur = (champ: ChampDemande) =>
    erreurs[champ] ? (
      <p className="erreur" id={idChamp(`err-${champ}`)} role="alert">
        {t.erreurs[erreurs[champ] as string] ?? t.erreurs.trop_long}
      </p>
    ) : null;
  const errId = (champ: ChampDemande) => erreurs[champ] && idChamp(`err-${champ}`);
  const requis = <span aria-hidden="true"> *</span>;

  return (
    <div className="cadre-form" id="cadre-form">
      {mode === "mock" && (
        <div className="bandeau-simulation" role="note">
          <span aria-hidden="true">●</span>
          <span>
            <strong>{t.modes.mock.bandeauFort}</strong> {t.modes.mock.bandeau}
          </span>
        </div>
      )}

      <ol className="progression" aria-label="Étapes de la demande">
        {t.etapes.map((libelle, i) => {
          const n = i + 1;
          const courant = enSaisie && etape === n;
          const fait = n < etape || phase === "confirmation";
          return (
            <li key={libelle} aria-current={courant ? "step" : undefined} className={fait ? "fait" : undefined}>
              <span className="pastille" aria-hidden="true">
                {n}
              </span>
              <span>
                <span className="sr-seul">Étape {n} sur 2{fait ? ", terminée" : ""} : </span>
                {libelle}
              </span>
            </li>
          );
        })}
      </ol>

      <noscript>
        <p className="bandeau-simulation">
          Le formulaire nécessite JavaScript. Écrivez-nous directement à {contenu.site.courriel}.
        </p>
      </noscript>

      <form
        ref={formulaire}
        noValidate
        method="post"
        action="/api/demandes"
        aria-labelledby="titre-contact"
        onSubmit={surEnvoi}
      >
        {/* Champ piège : invisible et ignoré par les personnes et les technologies d'assistance. */}
        <div className="piege" aria-hidden="true">
          <label>
            Site web
            <input ref={piege} type="text" name="site_web" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        {enSaisie && etape === 1 && (
          <div className="etapes-formulaire actif">
            <Champ>
              <label htmlFor={idChamp("service")}>
                {t.champs.service.libelle}
                {requis}
              </label>
              <select
                id={idChamp("service")}
                name="service"
                required
                aria-required="true"
                aria-invalid={invalide("service")}
                aria-describedby={decrit(errId("service"))}
                value={valeurs.service}
                onChange={(e) => modifier("service", e.target.value)}
              >
                <option value="">{t.champs.service.placeholder}</option>
                {t.services.map((s) => (
                  <option key={s.valeur} value={s.valeur}>
                    {s.libelle}
                  </option>
                ))}
              </select>
              {erreur("service")}
            </Champ>
            <Champ>
              <label htmlFor={idChamp("objectif")}>{t.champs.objectif.libelle}</label>
              <textarea
                id={idChamp("objectif")}
                name="objectif"
                maxLength={LIMITES.objectif}
                aria-invalid={invalide("objectif")}
                aria-describedby={decrit(idChamp("aide-objectif"), errId("objectif"))}
                value={valeurs.objectif}
                onChange={(e) => modifier("objectif", e.target.value)}
              />
              <span className="aide" id={idChamp("aide-objectif")}>
                {t.champs.objectif.aide}
              </span>
              {erreur("objectif")}
            </Champ>
            <Champ>
              <label htmlFor={idChamp("lieu")}>{t.champs.lieu.libelle}</label>
              <input
                id={idChamp("lieu")}
                name="lieu"
                type="text"
                autoComplete="address-level2"
                maxLength={LIMITES.lieu}
                aria-invalid={invalide("lieu")}
                aria-describedby={decrit(idChamp("aide-lieu"), errId("lieu"))}
                value={valeurs.lieu}
                onChange={(e) => modifier("lieu", e.target.value)}
              />
              <span className="aide" id={idChamp("aide-lieu")}>
                {t.champs.lieu.aide}
              </span>
              {erreur("lieu")}
            </Champ>
            <Champ>
              <label htmlFor={idChamp("description")}>
                {t.champs.description.libelle}
                {requis}
              </label>
              <textarea
                id={idChamp("description")}
                name="description"
                required
                aria-required="true"
                maxLength={LIMITES.description}
                aria-invalid={invalide("description")}
                aria-describedby={decrit(errId("description"))}
                value={valeurs.description}
                onChange={(e) => modifier("description", e.target.value)}
              />
              {erreur("description")}
            </Champ>
            <div className="rangee-boutons">
              <span className="aide">{t.requis}</span>
              <button className="btn btn-principal" type="submit" disabled={!pret}>
                {t.continuer}{" "}
                <span className="flecha" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {enSaisie && etape === 2 && (
          <div className="etapes-formulaire actif">
            <Champ>
              <label htmlFor={idChamp("nom")}>
                {t.champs.nom.libelle}
                {requis}
              </label>
              <input
                id={idChamp("nom")}
                name="nom"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                maxLength={LIMITES.nom}
                aria-invalid={invalide("nom")}
                aria-describedby={decrit(errId("nom"))}
                value={valeurs.nom}
                onChange={(e) => modifier("nom", e.target.value)}
              />
              {erreur("nom")}
            </Champ>
            <Champ>
              <label htmlFor={idChamp("courriel")}>
                {t.champs.courriel.libelle}
                {requis}
              </label>
              <input
                id={idChamp("courriel")}
                name="courriel"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                aria-required="true"
                maxLength={LIMITES.courriel}
                aria-invalid={invalide("courriel")}
                aria-describedby={decrit(errId("courriel"))}
                value={valeurs.courriel}
                onChange={(e) => modifier("courriel", e.target.value)}
              />
              {erreur("courriel")}
            </Champ>
            <Champ>
              <label htmlFor={idChamp("telephone")}>
                {t.champs.telephone.libelle} <span className="aide">{t.champs.telephone.facultatif}</span>
              </label>
              <input
                id={idChamp("telephone")}
                name="telephone"
                type="tel"
                autoComplete="tel"
                maxLength={LIMITES.telephone}
                aria-invalid={invalide("telephone")}
                aria-describedby={decrit(errId("telephone"))}
                value={valeurs.telephone}
                onChange={(e) => modifier("telephone", e.target.value)}
              />
              {erreur("telephone")}
            </Champ>
            <fieldset className="champ">
              <legend>{t.champs.preference.libelle}</legend>
              <div className="options">
                {(["courriel", "telephone"] as const).map((p) => (
                  <label key={p}>
                    <input
                      id={idChamp(`pref-${p}`)}
                      type="radio"
                      name="preference"
                      value={p}
                      checked={valeurs.preference === p}
                      onChange={() => modifier("preference", p)}
                    />{" "}
                    {t.champs.preference[p]}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="consentement">
              <input
                id={idChamp("consentement")}
                type="checkbox"
                name="consentement"
                required
                aria-required="true"
                aria-invalid={invalide("consentement")}
                aria-describedby={decrit(errId("consentement"))}
                checked={valeurs.consentement}
                onChange={(e) => modifier("consentement", e.target.checked)}
              />
              <span>{t.champs.consentement}</span>
            </label>
            {erreurs.consentement && <div className="erreur-consentement">{erreur("consentement")}</div>}
            <div className="rangee-boutons">
              <button className="btn btn-secondaire" type="button" onClick={() => allerEtape(1)}>
                <span aria-hidden="true">←</span> {t.retour}
              </button>
              <button className="btn btn-principal" type="submit">
                {textes.envoyer}
              </button>
            </div>
          </div>
        )}

        {phase === "envoi" && (
          <div className="chargement visible" role="status" aria-live="polite">
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <span>{textes.chargement}</span>
          </div>
        )}

        {phase === "erreur" && (
          <div className="etat visible" role="alert">
            <Pastille type="alerte" />
            <h3>{t.erreurTemporaire.titre}</h3>
            <p>{t.erreurTemporaire.texte}</p>
            <div className="rangee-boutons centre">
              <button className="btn btn-principal" type="button" id={idChamp("reessayer")} onClick={() => void envoyer()}>
                {t.erreurTemporaire.reessayer}
              </button>
              <button
                className="btn btn-secondaire"
                type="button"
                onClick={() => {
                  setPhase("saisie");
                  allerEtape(2);
                }}
              >
                <span aria-hidden="true">←</span> {t.retour}
              </button>
            </div>
          </div>
        )}

        {phase === "debit" && (
          <div className="etat visible" role="alert">
            <Pastille type="alerte" />
            <h3 id={idChamp("titre-debit")} tabIndex={-1}>
              {t.tropDeTentatives.titre}
            </h3>
            <p>{t.tropDeTentatives.texte}</p>
          </div>
        )}

        {phase === "confirmation" && (
          <div className="etat visible" role="status" aria-live="polite">
            <Pastille type="ok" />
            <h3>{textes.confirmationTitre}</h3>
            <p>{textes.confirmationTexte}</p>
            {reference && (
              <p className="reference">
                {t.reference} : <strong className="mono">{reference}</strong>
              </p>
            )}
            <button className="btn btn-secondaire" type="button" id={idChamp("recommencer")} onClick={recommencer}>
              {t.recommencer}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

const sAbonner = () => () => {};

function Champ({ children }: { children: ReactNode }) {
  return <div className="champ">{children}</div>;
}

function Pastille({ type }: { type: "ok" | "alerte" }) {
  return (
    <div className="pastille-grande" aria-hidden="true">
      {type === "ok" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5 9-10" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 8v5M12 17h.01" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      )}
    </div>
  );
}
