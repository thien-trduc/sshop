/*
  Warnings:

  - You are about to drop the `CustomerAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_customer_id_fkey";

-- DropTable
DROP TABLE "CustomerAddress";

-- CreateTable
CREATE TABLE "customer_address" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(225) NOT NULL,
    "address" VARCHAR(1000) NOT NULL,
    "fullname" VARCHAR(225) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "customer_address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_address_address_key" ON "customer_address"("address");

-- CreateIndex
CREATE UNIQUE INDEX "customer_address_phone_key" ON "customer_address"("phone");

-- AddForeignKey
ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
