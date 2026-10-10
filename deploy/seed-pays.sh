#!/usr/bin/env bash
# Crée les fiches pays (nom + code ISO) dans WordPress. Ne remplace rien : ignore les pays déjà présents.
set -euo pipefail
PW=$(grep '^DB_PASSWORD=' /root/ibesc/.env | cut -d= -f2)
WP=(docker run --rm --volumes-from ibesc-wordpress-1 --network container:ibesc-wordpress-1 --user 33:33
    -e WORDPRESS_DB_HOST=db -e WORDPRESS_DB_NAME=wp -e WORDPRESS_DB_USER=wp -e "WORDPRESS_DB_PASSWORD=$PW"
    wordpress:cli wp --path=/var/www/html)
EXIST=$("${WP[@]}" post list --post_type=pays --post_status=any --field=post_title || true)
n=0
while IFS='|' read -r nom code; do
  [ -z "$nom" ] && continue
  if printf '%s\n' "$EXIST" | grep -Fxq "$nom"; then echo "déjà présent : $nom"; continue; fi
  "${WP[@]}" post create --post_type=pays --post_status=publish --post_title="$nom" \
    --meta_input="{\"code_iso\":\"$code\",\"valide_par_ibesc\":false}" --porcelain >/dev/null
  echo "créé : $nom"; n=$((n+1))
done <<'LIST'
Angola|AO
Bénin|BJ
Burkina Faso|BF
Burundi|BI
Cameroun|CM
Centrafrique|CF
Congo|CG
Côte d'Ivoire|CI
Djibouti|DJ
Égypte|EG
Gabon|GA
Gambie|GM
Ghana|GH
Guinée Bissau|GW
Guinée Conakry|GN
Guinée équatoriale|GQ
Libye|LY
Liberia|LR
Madagascar|MG
Mali|ML
Niger|NE
Nigeria|NG
RD Congo|CD
Sénégal|SN
Sierra Leone|SL
Somalie|SO
Soudan du Sud|SS
Tchad|TD
Togo|TG
Yémen|YE
LIST
echo "Terminé : $n fiche(s) créée(s)."
