CREATE TABLE IF NOT EXISTS "settings" (
	`username`	TEXT NOT NULL UNIQUE,
	`catchPaste`	BOOLEAN,
	`use12Hours`	BOOLEAN,
	`lang`	CHARACTER(5),
	`isDonor`	BOOLEAN NOT NULL DEFAULT 0,
	PRIMARY KEY(`username`)
);

CREATE TABLE IF NOT EXISTS "migrations" (
	`revision` INT NOT NULL UNIQUE,
	`executedOn` TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S','now')),
	PRIMARY KEY(`revision`)
);
