BEGIN TRANSACTION;
  INSERT INTO "migrations" (revision) VALUES (1);
  ALTER TABLE "settings"
      ADD `keepOriginalTimestamp`	BOOLEAN DEFAULT 1;
COMMIT;
