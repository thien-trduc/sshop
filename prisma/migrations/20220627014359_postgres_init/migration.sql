/*
  Warnings:

  - You are about to drop the column `name` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `author` table. All the data in the column will be lost.
  - Added the required column `fullname` to the `author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "author" DROP COLUMN "name",
DROP COLUMN "surname",
ADD COLUMN     "fullname" VARCHAR(255) NOT NULL;
