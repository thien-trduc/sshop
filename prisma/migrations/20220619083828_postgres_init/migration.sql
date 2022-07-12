/*
  Warnings:

  - You are about to alter the column `fullname` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "customer" ALTER COLUMN "fullname" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "fullname" VARCHAR(500);
