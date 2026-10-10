#!/usr/bin/env bash
# Crée (une seule fois) le mot de passe de l'espace équipe /admin et redémarre le site.
set -euo pipefail
cd /root/ibesc
if grep -q '^ADMIN_PASSWORD=' .env; then
  echo "Un mot de passe existe déjà dans /root/ibesc/.env (ligne ADMIN_PASSWORD)."
else
  PW=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 20)
  printf '\nADMIN_PASSWORD=%s\n' "$PW" >> .env
  chmod 600 .env
  echo "Mot de passe créé."
fi
docker compose -f docker-compose.yml -f docker-compose.web.yml up -d web
echo
echo "Mot de passe de l'espace équipe :"
grep '^ADMIN_PASSWORD=' .env | cut -d= -f2
echo "Adresse : https://ibesc.samatech.cloud/admin"
echo "Ensuite : dans l'espace équipe, cliquez sur « Changer le mot de passe »."
