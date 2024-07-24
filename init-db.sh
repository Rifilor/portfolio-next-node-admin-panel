#!/bin/bash
set -e

# Відновлюємо базу даних з дампа
if [ -f /docker-entrypoint-initdb.d/backup.dump ]; then
  echo "Restoring database from dump..."
  pg_restore -U postgres -d mydatabase -v /docker-entrypoint-initdb.d/backup.dump
fi