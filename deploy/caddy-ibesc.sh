#!/usr/bin/env bash
# Ajoute le bloc ibesc.samatech.cloud au Caddy de "budget", avec sauvegarde, validation et retour arrière.
set -u
cd /home/hermes/budget || exit 1
C=budget-caddy-1
if grep -q '^ibesc.samatech.cloud' Caddyfile; then echo "Le bloc existe déjà. Rien à faire."; exit 0; fi
B=Caddyfile.bak.$(date +%F-%H%M%S); cp -a Caddyfile "$B" && echo "sauvegarde : $B"
docker network connect ibesc_front "$C" 2>&1 | grep -vi "already exists"
cat >> Caddyfile <<'BLOCK'

ibesc.samatech.cloud {
        encode zstd gzip
        tls {
                issuer acme {
                        disable_http_challenge
                }
        }
        header X-Robots-Tag "noindex, nofollow"
        reverse_proxy ibesc-web-1:3000
}
BLOCK
if docker exec "$C" caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1; then
  docker exec "$C" caddy reload --config /etc/caddy/Caddyfile >/dev/null 2>&1 && echo "RELOAD_OK"
else
  cp "$B" Caddyfile; echo "INVALIDE : ancienne configuration restaurée"
fi
