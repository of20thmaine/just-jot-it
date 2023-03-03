PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS "notes";
DROP TABLE IF EXISTS "collections";

PRAGMA foreign_keys=ON;

-- Create Table Notes
CREATE TABLE "notes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collection_id" INTEGER NOT NULL,
    CONSTRAINT "notes_collections_fkey"
        FOREIGN KEY ("collection_id")
        REFERENCES "collections" ("id") 
        ON DELETE CASCADE
);

-- Create Table Collections
CREATE TABLE "collections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT UNIQUE,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
