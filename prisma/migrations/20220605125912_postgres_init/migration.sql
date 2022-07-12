/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "book" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "icon" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "book_slug_key" ON "book"("slug");
