-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "foundation" DATETIME NOT NULL,
    "places" TEXT NOT NULL,
    "fundaments" TEXT NOT NULL,
    "methods" TEXT NOT NULL,
    "ranking" INTEGER NOT NULL DEFAULT 0,
    "owner_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Company_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("cnpj", "createdAt", "foundation", "fundaments", "id", "methods", "name", "owner_id", "places", "updatedAt") SELECT "cnpj", "createdAt", "foundation", "fundaments", "id", "methods", "name", "owner_id", "places", "updatedAt" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");
CREATE TABLE "new_courses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url_img" TEXT NOT NULL DEFAULT '',
    "workload" REAL,
    "ranking" INTEGER NOT NULL DEFAULT 0,
    "Field_of_study" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "owner_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "courses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "courses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_courses" ("Field_of_study", "company_id", "createdAt", "description", "id", "name", "owner_id", "ranking", "updatedAt", "url_img", "workload") SELECT "Field_of_study", "company_id", "createdAt", "description", "id", "name", "owner_id", "ranking", "updatedAt", "url_img", "workload" FROM "courses";
DROP TABLE "courses";
ALTER TABLE "new_courses" RENAME TO "courses";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
