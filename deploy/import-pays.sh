#!/usr/bin/env bash
# Importe les 30 fiches pays (FR/EN/NL) issues de l'ancien site dans WordPress. Relançable sans risque.
set -euo pipefail
cd "$(dirname "$0")"
W=ibesc-wordpress-1
PW=$(grep '^DB_PASSWORD=' /root/ibesc/.env | cut -d= -f2)
docker exec $W mkdir -p /var/www/html/wp-content/ibesc-import
docker cp pays.json $W:/var/www/html/wp-content/ibesc-import/pays.json
docker cp import-pays.php $W:/var/www/html/wp-content/ibesc-import/import-pays.php
docker exec $W chown -R www-data:www-data /var/www/html/wp-content/ibesc-import
docker run --rm --volumes-from $W --network container:$W --user 33:33 \
  -e WORDPRESS_DB_HOST=db -e WORDPRESS_DB_NAME=wp -e WORDPRESS_DB_USER=wp -e "WORDPRESS_DB_PASSWORD=$PW" \
  wordpress:cli wp --path=/var/www/html eval-file /var/www/html/wp-content/ibesc-import/import-pays.php
