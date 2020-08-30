BEGIN TRANSACTION;
  INSERT INTO "migrations" (revision) VALUES (2);
  ALTER TABLE "settings"
      ADD `dataProvider` TEXT;
COMMIT;
