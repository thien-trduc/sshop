-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(225) NOT NULL,
    "address" VARCHAR(1000) NOT NULL,
    "fullname" VARCHAR(225) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
