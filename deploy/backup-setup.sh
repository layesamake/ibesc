#!/usr/bin/env bash
# Sauvegarde quotidienne d'IBESC : base WordPress, fichiers WordPress (médias), demandes et documents reçus, configuration.
# Installe /usr/local/bin/ibesc-backup.sh, une tâche cron à 03h15, et lance une première sauvegarde.
set -euo pipefail
[ "$(id -u)" = 0 ] || { echo "À lancer en root."; exit 1; }
mkdir -p /root/backups/ibesc && chmod 700 /root/backups /root/backups/ibesc

cat > /usr/local/bin/ibesc-backup.sh <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
D=/root/backups/ibesc
N=$(date +%F-%H%M)
PW=$(grep '^DB_PASSWORD=' /root/ibesc/.env | cut -d= -f2)
umask 077
docker exec -e MYSQL_PWD="$PW" ibesc-db-1 mariadb-dump -uwp --single-transaction --routines wp | gzip > "$D/db-$N.sql.gz"
docker run --rm --volumes-from ibesc-wordpress-1:ro -v "$D":/out alpine tar -czf "/out/wordpress-$N.tar.gz" -C /var/www/html wp-content
docker run --rm --volumes-from ibesc-web-1:ro -v "$D":/out alpine tar -czf "/out/demandes-$N.tar.gz" -C /data .
tar -czf "$D/config-$N.tar.gz" -C /root/ibesc .env docker-compose.yml docker-compose.web.yml -C /home/hermes/budget Caddyfile
find "$D" -type f -name '*.gz' -mtime +14 -delete
echo "SAUVEGARDE_OK $N"
EOS
chmod 700 /usr/local/bin/ibesc-backup.sh

( crontab -l 2>/dev/null | grep -v ibesc-backup.sh || true; echo '15 3 * * * /usr/local/bin/ibesc-backup.sh >> /var/log/ibesc-backup.log 2>&1' ) | crontab -
/usr/local/bin/ibesc-backup.sh
echo; ls -lh /root/backups/ibesc
echo; echo "Tâche planifiée :"; crontab -l | grep ibesc-backup
