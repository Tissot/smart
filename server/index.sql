-- Table users
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"createdAt"	NUMERIC NOT NULL,
	"updatedAt"	NUMERIC NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"token"	TEXT NOT NULL UNIQUE
)
-- Table reports
DROP TABLE IF EXISTS "reports";
CREATE TABLE "reports" (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"ownerId"	INTEGER NOT NULL,
	"createdAt"	NUMERIC NOT NULL,
	"updatedAt"	NUMERIC NOT NULL,
	"name"	TEXT,
	"elements"	TEXT NOT NULL,
	FOREIGN KEY
("ownerId") REFERENCES "users"
("id")
)
-- Table dataSources
DROP TABLE IF EXISTS "dataSources";
CREATE TABLE "dataSources" (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"ownerId"	INTEGER NOT NULL,
	"createdAt"	NUMERIC NOT NULL,
	"updatedAt"	NUMERIC NOT NULL,
	"name"	TEXT NOT NULL,
	"data"	TEXT NOT NULL,
	FOREIGN KEY
("ownerId") REFERENCES "users"
("id")
)