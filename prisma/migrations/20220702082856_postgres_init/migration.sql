/*
  Warnings:

  - You are about to drop the column `address` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `name_receive` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `phone_receive` on the `order` table. All the data in the column will be lost.
  - Added the required column `receiver` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "address",
DROP COLUMN "name_receive",
DROP COLUMN "phone_receive",
ADD COLUMN     "receiver" JSONB NOT NULL;
