#!/bin/sh
set -e

DB_PATH="${SQLITE_DB_PATH:-/var/www/html/database/production.db}"
MIGRATIONS_DIR="/db/migrations"

mkdir -p "$(dirname "$DB_PATH")"
chown www-data:www-data "$(dirname "$DB_PATH")"

# Runtime env injection for frontend
sed -i "s|</head>|<script>window.__env={REACT_APP_LASTFM_API_KEY:\"${LASTFM_API_KEY}\"};</script></head>|" /var/www/html/index.html

if [ -d "$MIGRATIONS_DIR" ]; then
    echo "Running database migrations against $DB_PATH..."
    sh /db/migrate.sh "$DB_PATH" "$MIGRATIONS_DIR"
fi

exec "$@"
