/*
  Warnings:

  - You are about to drop the `_Credit_PersonToProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credit_person` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Credit_PersonToProject" DROP CONSTRAINT "_Credit_PersonToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_Credit_PersonToProject" DROP CONSTRAINT "_Credit_PersonToProject_B_fkey";

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "contributions" TEXT[];

-- DropTable
DROP TABLE "_Credit_PersonToProject";

-- DropTable
DROP TABLE "credit_person";

-- CreateTable
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "github" TEXT,
    "linkedin" TEXT,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PersonToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PersonToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_name_key" ON "person"("name");

-- CreateIndex
CREATE INDEX "_PersonToProject_B_index" ON "_PersonToProject"("B");

-- AddForeignKey
ALTER TABLE "_PersonToProject" ADD CONSTRAINT "_PersonToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToProject" ADD CONSTRAINT "_PersonToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
