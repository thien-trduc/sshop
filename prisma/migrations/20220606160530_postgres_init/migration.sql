/*
  Warnings:

  - You are about to drop the column `infoDetails` on the `book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "book" DROP COLUMN "infoDetails",
ADD COLUMN     "info_details" TEXT;
