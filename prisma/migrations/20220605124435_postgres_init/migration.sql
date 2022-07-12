-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(500) NOT NULL,
    "avatar" VARCHAR(500),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "age" SMALLINT DEFAULT 0,
    "gender" BOOLEAN DEFAULT false,
    "birthdate" TIME(6) DEFAULT CURRENT_TIMESTAMP,
    "address" VARCHAR(500) DEFAULT E'',
    "mobile" VARCHAR(15),
    "email" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "sequencenum" SERIAL NOT NULL,
    "streamid" VARCHAR(500) NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "logdate" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("sequencenum")
);

-- CreateTable
CREATE TABLE "snapshot" (
    "streamid" VARCHAR(500) NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "revision" INTEGER NOT NULL,

    CONSTRAINT "snapshot_pkey" PRIMARY KEY ("streamid")
);

-- CreateTable
CREATE TABLE "stream" (
    "streamid" VARCHAR(500) NOT NULL,
    "version" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "stream_pkey" PRIMARY KEY ("streamid")
);

-- CreateTable
CREATE TABLE "message_events" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(15),
    "status" SMALLINT DEFAULT 0,
    "title" VARCHAR(500),
    "topicid" VARCHAR(255),
    "data" JSONB,
    "streamid" VARCHAR(500),
    "message" TEXT,
    "error_body" TEXT,

    CONSTRAINT "message_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cache_keys" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "key" VARCHAR(500) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cache_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publisher" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(500),
    "email" VARCHAR(255),

    CONSTRAINT "publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book" (
    "isbn" VARCHAR(255) NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(500) NOT NULL,
    "page" BIGINT NOT NULL DEFAULT 0,
    "quantity" BIGINT NOT NULL DEFAULT 0,
    "yearOfPublish" SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 0,
    "image" VARCHAR(500),
    "category_id" INTEGER NOT NULL,
    "publisher_id" INTEGER NOT NULL,
    "description" VARCHAR(1000),
    "images" TEXT[],

    CONSTRAINT "book_pkey" PRIMARY KEY ("isbn")
);

-- CreateTable
CREATE TABLE "book_price" (
    "book_id" VARCHAR(255) NOT NULL,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "book_price_pkey" PRIMARY KEY ("date","book_id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "sex" SMALLINT NOT NULL DEFAULT 1,
    "birthdate" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "author" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "birthdate" VARCHAR(255) NOT NULL,
    "sex" SMALLINT NOT NULL DEFAULT 1,
    "phone" VARCHAR(15) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_compose" (
    "author_id" INTEGER NOT NULL,
    "book_id" VARCHAR(255) NOT NULL,
    "detail" VARCHAR(255),

    CONSTRAINT "detail_compose_pkey" PRIMARY KEY ("author_id","book_id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "sex" SMALLINT NOT NULL DEFAULT 1,
    "birthdate" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "department_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employee_id" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "type" INTEGER NOT NULL DEFAULT 1,
    "total_price" DOUBLE PRECISION NOT NULL,
    "address" VARCHAR(500),
    "name_receive" VARCHAR(255),
    "phone_receive" VARCHAR(15),
    "transaction_id" VARCHAR(100) NOT NULL,
    "session" TEXT NOT NULL,
    "customer_id" INTEGER,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_detail" (
    "order_id" INTEGER NOT NULL,
    "book_id" VARCHAR(255) NOT NULL,
    "quantity" BIGINT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_detail_pkey" PRIMARY KEY ("order_id","book_id")
);

-- CreateTable
CREATE TABLE "book_receipt" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "note" VARCHAR(255) NOT NULL,
    "order_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "book_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_receipt_detail" (
    "book_receipt_id" INTEGER NOT NULL,
    "book_id" VARCHAR(255) NOT NULL,
    "quantity" BIGINT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "book_receipt_detail_pkey" PRIMARY KEY ("book_receipt_id","book_id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "receive_name" VARCHAR(500) NOT NULL,
    "address" VARCHAR(500) NOT NULL,
    "receive_phone" VARCHAR(15) NOT NULL,
    "employee_id" INTEGER,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_detail" (
    "cart_id" UUID NOT NULL,
    "book_id" VARCHAR(255) NOT NULL,
    "quantity" BIGINT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cart_detail_pkey" PRIMARY KEY ("cart_id","book_id")
);

-- CreateTable
CREATE TABLE "receipt" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "tax_code" VARCHAR(25) NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_repay" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employee_id" INTEGER NOT NULL,
    "receipt_id" INTEGER NOT NULL,

    CONSTRAINT "book_repay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_repay_detail" (
    "book_id" VARCHAR(255) NOT NULL,
    "book_repay_id" INTEGER NOT NULL,
    "quantity" BIGINT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(500) NOT NULL,

    CONSTRAINT "book_repay_detail_pkey" PRIMARY KEY ("book_repay_id","book_id")
);

-- CreateTable
CREATE TABLE "discount" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(500) NOT NULL,
    "start_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR(500) NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_detail" (
    "discount_id" INTEGER NOT NULL,
    "book_id" VARCHAR(255) NOT NULL,
    "type" SMALLINT NOT NULL DEFAULT 1,
    "value" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "discount_detail_pkey" PRIMARY KEY ("discount_id","book_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_createdAt_updatedAt_idx" ON "users"("createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_profiles_createdAt_updatedAt_idx" ON "user_profiles"("createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "event_streamid_version_key" ON "event"("streamid", "version");

-- CreateIndex
CREATE INDEX "idx_stream_type" ON "stream"("type");

-- CreateIndex
CREATE UNIQUE INDEX "cache_keys_key_key" ON "cache_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_description_key" ON "category"("description");

-- CreateIndex
CREATE UNIQUE INDEX "customer_user_id_key" ON "customer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "order_transaction_id_key" ON "order"("transaction_id");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_streamid_fkey" FOREIGN KEY ("streamid") REFERENCES "stream"("streamid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publisher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_price" ADD CONSTRAINT "book_price_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_compose" ADD CONSTRAINT "detail_compose_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detail_compose" ADD CONSTRAINT "detail_compose_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_receipt" ADD CONSTRAINT "book_receipt_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_receipt" ADD CONSTRAINT "book_receipt_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_receipt_detail" ADD CONSTRAINT "book_receipt_detail_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_receipt_detail" ADD CONSTRAINT "book_receipt_detail_book_receipt_id_fkey" FOREIGN KEY ("book_receipt_id") REFERENCES "book_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_detail" ADD CONSTRAINT "cart_detail_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_detail" ADD CONSTRAINT "cart_detail_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_repay" ADD CONSTRAINT "book_repay_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_repay" ADD CONSTRAINT "book_repay_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_repay_detail" ADD CONSTRAINT "book_repay_detail_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_repay_detail" ADD CONSTRAINT "book_repay_detail_book_repay_id_fkey" FOREIGN KEY ("book_repay_id") REFERENCES "book_repay"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount" ADD CONSTRAINT "discount_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount_detail" ADD CONSTRAINT "discount_detail_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_detail" ADD CONSTRAINT "discount_detail_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discount"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
