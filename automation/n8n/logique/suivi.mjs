// @ts-check
/**
 * Logique du workflow n8n « NEOXIX — Suivi commercial — Rappels quotidiens ».
 * Fonctions pures, testées par Vitest puis injectées dans les nœuds Code (voir construire.mjs).
 * Rien n'est envoyé aux clients : le workflow crée des tâches internes et un résumé sans données personnelles.
 */

const JOUR_MS = 86_400_000;

/**
 * Recherches HubSpot à exécuter chaque matin (une par règle).
 * Une transaction n'est relancée qu'une fois par période : `neoxix_dernier_rappel` est mis à jour après chaque tâche.
 * @param {{ pipelineId: string, etapes: Record<string, string>, joursNonExaminee: number, joursDevisEnvoye: number, joursEntreRappels: number }} config
 * @param {number} maintenantMs
 */
export function recherchesSuivi(config, maintenantMs) {
  const avant = (/** @type {number} */ jours) => String(maintenantMs - jours * JOUR_MS);
  const pasDeRappelRecent = [
    { propertyName: "neoxix_dernier_rappel", operator: "NOT_HAS_PROPERTY" },
  ];
  const rappelAncien = [{ propertyName: "neoxix_dernier_rappel", operator: "LT", value: avant(config.joursEntreRappels) }];
  /** @param {string} etape @param {any[]} filtres */
  const groupes = (etape, filtres) =>
    [pasDeRappelRecent, rappelAncien].map((rappel) => ({
      filters: [
        { propertyName: "pipeline", operator: "EQ", value: config.pipelineId },
        { propertyName: "dealstage", operator: "EQ", value: etape },
        // Seules les transactions créées par le circuit LeadFlow sont visées (jamais les autres affaires du pipeline).
        { propertyName: "neoxix_request_id", operator: "HAS_PROPERTY" },
        ...filtres,
        ...rappel,
      ],
    }));
  const proprietes = ["dealname", "neoxix_reference", "dealstage", "hs_lastmodifieddate", "createdate"];
  return [
    {
      regle: "non_examinee",
      corps: {
        filterGroups: groupes(config.etapes.nouvelleDemande, [{ propertyName: "createdate", operator: "LT", value: avant(config.joursNonExaminee) }]),
        properties: proprietes,
        limit: 100,
      },
    },
    {
      regle: "devis_en_preparation",
      corps: { filterGroups: groupes(config.etapes.devisEnPreparation, []), properties: proprietes, limit: 100 },
    },
    {
      regle: "devis_envoye",
      corps: {
        filterGroups: groupes(config.etapes.devisEnvoye, [
          { propertyName: "hs_lastmodifieddate", operator: "LT", value: avant(config.joursDevisEnvoye) },
        ]),
        properties: proprietes,
        limit: 100,
      },
    },
  ];
}

const TEXTES = {
  non_examinee: {
    sujet: (/** @type {string} */ ref) => `Rappel : demande ${ref} pas encore examinée`,
    corps:
      "Cette demande est toujours à l'étape « Nouvelle demande ». Examinez-la, puis passez-la à « Besoin analysé ». " +
      "S'il manque des informations, utilisez le modèle « Demande d'informations complémentaires » (automation/emails/modeles-commerciaux.md) : à personnaliser et à envoyer vous-même.",
    priorite: "HIGH",
  },
  devis_en_preparation: {
    sujet: (/** @type {string} */ ref) => `Préparer le devis : ${ref}`,
    corps: "Transaction à l'étape « Devis en préparation ». Rédigez la proposition écrite, puis passez la transaction à « Devis envoyé ».",
    priorite: "MEDIUM",
  },
  devis_envoye: {
    sujet: (/** @type {string} */ ref) => `Relancer le devis : ${ref}`,
    corps:
      "Devis envoyé sans évolution récente. Utilisez le modèle « Relance d'une demande sans réponse » : à personnaliser et à envoyer vous-même, après vérification.",
    priorite: "MEDIUM",
  },
};

/**
 * Tâches à créer et transactions à marquer pour une règle donnée.
 * @param {keyof typeof TEXTES} regle @param {{ id: string, properties: Record<string, string> }[]} transactions
 * @param {{ proprietaireId?: string }} config @param {Date} echeance @param {number} maintenantMs
 */
export function tachesSuivi(regle, transactions, config, echeance, maintenantMs) {
  const t = TEXTES[regle];
  const taches = transactions.map((tr) => {
    /** @type {Record<string, string>} */
    const properties = {
      hs_task_subject: t.sujet(tr.properties.neoxix_reference || tr.properties.dealname || tr.id),
      hs_task_body: t.corps,
      hs_timestamp: echeance.toISOString(),
      hs_task_status: "NOT_STARTED",
      hs_task_priority: t.priorite,
      hs_task_type: "TODO",
    };
    if (config.proprietaireId) properties.hubspot_owner_id = config.proprietaireId;
    return { properties, associations: [{ to: { id: tr.id }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 216 }] }] };
  });
  const marquages = transactions.map((tr) => ({ id: tr.id, properties: { neoxix_dernier_rappel: String(maintenantMs) } }));
  return { taches, marquages };
}

/**
 * Résumé quotidien : nombres et références seulement (aucun nom, courriel ni téléphone).
 * @param {Record<string, string[]>} references par règle @param {{ portailId: string, pipelineId: string }} config @param {string} dateIso
 */
export function resumeQuotidien(references, config, dateIso) {
  const ligne = (/** @type {string} */ libelle, /** @type {string[]} */ refs) => `${libelle} : ${refs.length}${refs.length ? ` (${refs.join(", ")})` : ""}`;
  const total = Object.values(references).reduce((n, r) => n + r.length, 0);
  return {
    sujet: `NEOXIX · Suivi commercial du ${dateIso.slice(0, 10)} · ${total} action(s)`,
    texte: [
      ligne("Demandes non examinées", references.non_examinee ?? []),
      ligne("Devis à préparer", references.devis_en_preparation ?? []),
      ligne("Devis à relancer", references.devis_envoye ?? []),
      "",
      "Les tâches correspondantes ont été créées dans HubSpot.",
      `Tableau des transactions : https://app.hubspot.com/contacts/${config.portailId}/objects/0-3/views/all/board`,
    ].join("\n"),
  };
}
