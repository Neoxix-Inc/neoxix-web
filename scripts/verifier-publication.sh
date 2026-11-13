#!/usr/bin/env bash
# Vérifie qu'un build de production ne contient aucun montant proposé ni identifiant du catalogue
# dans le JavaScript public (.next/static) ni dans le HTML rendu (.next/server/app).
# Les identifiants internes du catalogue (ex. site-essentiel) ne sont pas des montants : ils ne sont pas testés.
# Usage : VERCEL_ENV=production pnpm build && bash scripts/verifier-publication.sh
set -u
cd "$(dirname "$0")/.."
motifs='montant:[0-9]|à partir de|\$ ?CA|\\u00a0\$|525 \$|525\\u00a0\$|1 400|1\\u00a0400|2 500|2\\u00a0500|3 000|3\\u00a0000|5 000|5\\u00a0000|495 \$|475 \$'
echo "Vérification : JavaScript public (.next/static)"
js=$(grep -rlE "$motifs" .next/static 2>/dev/null | wc -l)
echo "  fichiers contenant un motif : $js"
echo "Vérification : HTML rendu (.next/server/app)"
html=$(grep -rlE "$motifs" .next/server/app 2>/dev/null | wc -l)
echo "  fichiers contenant un motif : $html"
if [ "$js" -eq 0 ] && [ "$html" -eq 0 ]; then
  echo "RÉSULTAT : aucun montant proposé exposé dans le JavaScript public ni dans le HTML/RSC."
  exit 0
fi
echo "RÉSULTAT : ÉCHEC. Motifs trouvés :"
grep -rnoE "$motifs" .next/static .next/server/app 2>/dev/null | head -20
exit 1
