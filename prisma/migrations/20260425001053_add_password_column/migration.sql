/*
  Warnings:

  - You are about to drop the `_user_company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_user_company_B_index";

-- DropIndex
DROP INDEX "_user_company_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_user_company";
PRAGMA foreign_keys=on;

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
    "owner_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Company_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("cnpj", "createdAt", "foundation", "fundaments", "id", "methods", "name", "places", "updatedAt") SELECT "cnpj", "createdAt", "foundation", "fundaments", "id", "methods", "name", "places", "updatedAt" FROM "Company";
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
    "ranking" INTEGER NOT NULL,
    "Field_of_study" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "owner_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "courses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "courses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_courses" ("Field_of_study", "company_id", "createdAt", "description", "id", "name", "ranking", "updatedAt", "url_img", "workload") SELECT "Field_of_study", "company_id", "createdAt", "description", "id", "name", "ranking", "updatedAt", "url_img", "workload" FROM "courses";
DROP TABLE "courses";
ALTER TABLE "new_courses" RENAME TO "courses";
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT,
    "birth_date" DATETIME,
    "password" TEXT NOT NULL DEFAULT '123',
    "company_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("birth_date", "cpf", "createdAt", "email", "id", "name", "status", "type", "updatedAt") SELECT "birth_date", "cpf", "createdAt", "email", "id", "name", "status", "type", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
