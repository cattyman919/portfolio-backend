-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "detailed_description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "languages" TEXT[],
    "github_repo" TEXT,
    "website" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "github" TEXT,
    "linkedin" TEXT,

    CONSTRAINT "credit_person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Credit_PersonToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Credit_PersonToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "credit_person_name_key" ON "credit_person"("name");

-- CreateIndex
CREATE INDEX "_Credit_PersonToProject_B_index" ON "_Credit_PersonToProject"("B");

-- AddForeignKey
ALTER TABLE "_Credit_PersonToProject" ADD CONSTRAINT "_Credit_PersonToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "credit_person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Credit_PersonToProject" ADD CONSTRAINT "_Credit_PersonToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
