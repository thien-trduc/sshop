/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `CustomerAddress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `CustomerAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CustomerAddress_address_key" ON "CustomerAddress"("address");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAddress_phone_key" ON "CustomerAddress"("phone");
