#!/bin/sh

# Usage: migrate_db.sh /path/to/database.db /path/to/migrations

DB="$1"
MIGRATIONS="$2"

LAST_REV=$(sqlite3 "$1" "SELECT MAX(revision) FROM migrations" 2>/dev/null)
if [ $? -ne 0 ] || [ -z "$LAST_REV" ]; then
  LAST_REV=-1
fi

while LAST_REV=$((LAST_REV+1)) && \
      THIS_REV=$(find "$MIGRATIONS" -maxdepth 1 -name "$(printf %04d $LAST_REV)_*.sql" -print) && \
      test -n "$THIS_REV";
do
  echo "Applying database migration # $LAST_REV"
  sqlite3 -bail "$1" <"$THIS_REV" || exit 1
done
