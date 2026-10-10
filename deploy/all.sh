#!/usr/bin/env bash
# Mise à jour complète : modèle WordPress, import des fiches pays, puis nouveau site.
set -euo pipefail
cd "$(dirname "$0")"
bash cms-update.sh
bash import-pays.sh
bash deploy.sh
