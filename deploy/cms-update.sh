#!/usr/bin/env bash
# Met à jour le plugin du modèle de contenu (fiche pays complète FR/EN/NL + redirection de la façade).
# Sauvegarde l'ancien fichier, vérifie la syntaxe PHP, et ne remplace que si tout est valide.
set -u
cd "$(dirname "$0")"
W=ibesc-wordpress-1
D=/var/www/html/wp-content/mu-plugins
docker exec -u www-data $W cp -a $D/ibesc-model.php $D/ibesc-model.php.bak && echo "sauvegarde : ibesc-model.php.bak"
docker cp ibesc-model.php $W:$D/ibesc-model.php.new
docker exec $W chown www-data:www-data $D/ibesc-model.php.new
if docker exec $W php -l $D/ibesc-model.php.new; then
  docker exec $W mv $D/ibesc-model.php.new $D/ibesc-model.php && echo "MISE_A_JOUR_OK"
else
  docker exec $W rm -f $D/ibesc-model.php.new; echo "ERREUR de syntaxe : rien n'a été modifié"; exit 1
fi
curl -s -o /dev/null -w 'API pays : HTTP %{http_code}\n' https://cms-ibesc.samatech.cloud/wp-json/wp/v2/pays
curl -s -o /dev/null -w 'Façade CMS : HTTP %{http_code} (302 attendu)\n' https://cms-ibesc.samatech.cloud/
