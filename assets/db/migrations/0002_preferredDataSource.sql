BEGIN;
  INSERT INTO migrations (revision) VALUES (2);
  ALTER TABLE settings
      ADD dataProvider CHAR(16);
COMMIT;
