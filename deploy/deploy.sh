#!/usr/bin/env bash
# Déploie le site Next.js dans /root/ibesc (à lancer en root sur le VPS).
set -euo pipefail
cd /root/ibesc
rm -rf web && mkdir web
tar -xzf /home/hermes/ibesc-web.tar.gz -C web
cp web/deploy/docker-compose.web.yml docker-compose.web.yml
docker compose -f docker-compose.yml -f docker-compose.web.yml up -d --build web
sleep 5
docker compose -f docker-compose.yml -f docker-compose.web.yml ps
echo "--- le site lit-il WordPress ?"
docker compose -f docker-compose.yml -f docker-compose.web.yml exec -T web wget -qO- https://cms-ibesc.samatech.cloud/wp-json/wp/v2/pays | head -c 120; echo
