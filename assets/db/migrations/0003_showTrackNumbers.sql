BEGIN;
  INSERT INTO migrations (revision) VALUES (3);
  ALTER TABLE settings
      ADD showTrackNumbers BOOLEAN DEFAULT 0;
COMMIT;
