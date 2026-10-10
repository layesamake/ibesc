#!/usr/bin/env bash
# Configure l'envoi d'e-mails (alerte équipe + accusé client) et envoie un message de test.
# Le mot de passe est saisi ici, sur le serveur : il n'apparaît nulle part ailleurs.
set -euo pipefail
cd /root/ibesc
read -r -p "Serveur SMTP sortant [ssl0.ovh.net] : " H;   H=${H:-ssl0.ovh.net}
read -r -p "Port [465] : " P;                           P=${P:-465}
read -r -p "Adresse d'envoi [info@ibescbusiness.com] : " U; U=${U:-info@ibescbusiness.com}
read -r -p "Qui reçoit les alertes [etiennesamake@gmail.com] : " T; T=${T:-etiennesamake@gmail.com}
read -r -s -p "Mot de passe de la boîte $U (rien ne s'affiche) : " W; echo
case "$W" in ''|*"'"*|*$'\n'*) echo "ERREUR : mot de passe vide ou contenant une apostrophe."; exit 1;; esac

sed -i '/^\(SMTP_\|MAIL_\)/d' .env
{
  echo "SMTP_HOST=$H"; echo "SMTP_PORT=$P"; echo "SMTP_USER=$U"
  echo "SMTP_PASS='$W'"; echo "MAIL_FROM=$U"; echo "MAIL_TO=$T"
} >> .env
chmod 600 .env
unset W
docker compose -f docker-compose.yml -f docker-compose.web.yml up -d --force-recreate web
sleep 6
echo "--- Envoi d'un message de test à $T"
set -a; . ./.env; set +a
docker run --rm -e SMTP_HOST -e SMTP_PORT -e SMTP_USER -e SMTP_PASS -e MAIL_FROM -e MAIL_TO node:22-alpine sh -c 'cd /tmp && npm i nodemailer --silent >/dev/null 2>&1 && node -e "
const n=require(\"nodemailer\");const p=Number(process.env.SMTP_PORT);
n.createTransport({host:process.env.SMTP_HOST,port:p,secure:p===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:20000})
.sendMail({from:process.env.MAIL_FROM,to:process.env.MAIL_TO,subject:\"IBESC : test d envoi\",text:\"Si vous lisez ce message, les e-mails automatiques du site IBESC fonctionnent.\"})
.then(()=>console.log(\"TEST_OK : message envoye\"),e=>{console.log(\"TEST_ECHEC :\",e.message);process.exit(1)})"'
