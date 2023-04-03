#!/bin/bash

# Usage: migrate_db.sh /path/to/migrations

echo "Initializing database migrations..."

# Load environment variables from .env.${NODE_ENV}.local
SELECTED_ENV=${NODE_ENV:-development}
# Load the environment variables from the selected environment file relative to the current script
TARGET_ENV_FILE="$(dirname "$0")/../../.env.${SELECTED_ENV}.local"

if [ "$SELECTED_ENV" == "development" ] || [ "$SELECTED_ENV" == "production" ] || [ "$SELECTED_ENV" == "ci" ]; then
  if [ -f "$TARGET_ENV_FILE" ]; then
    #shellcheck disable=SC1090
    source "$TARGET_ENV_FILE"
  else
    echo "Error: .env.${SELECTED_ENV}.local file not found"
    exit 1
  fi
else
  echo "Error: NODE_ENV is not set to a valid value"
  exit 1
fi

if ! command -v mysql; then
  echo "Error: mysql command not found"
  exit 1
fi

MIGRATIONS="$1"

LAST_REV=$(mysql --skip-column-names -h "$ADMIN_DB_HOST" -u "$ADMIN_DB_USER" -p"$ADMIN_DB_PASS" -e "SELECT MAX(revision) FROM migrations" "$NEW_DB_NAME" 2>/dev/null)
if [ $? -ne 0 ] || [ -z "$LAST_REV" ]; then
  LAST_REV=-1
fi

while LAST_REV=$((LAST_REV+1)) && \
      THIS_REV=$(find "$MIGRATIONS" -maxdepth 1 -name "$(printf %04d $LAST_REV)_*.sql" -print) && \
      test -n "$THIS_REV";
do
  echo "Applying database migration # $LAST_REV"
  mysql -h "$ADMIN_DB_HOST" -u "$ADMIN_DB_USER" -p"$ADMIN_DB_PASS" "$NEW_DB_NAME" <"$THIS_REV" || exit 1
done
