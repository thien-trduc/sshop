-- CreateTable
CREATE TABLE "otp_numbers" (
    "otp" INTEGER NOT NULL,
    "is_selected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "otp_numbers_pkey" PRIMARY KEY ("otp")
);

-- CreateTable
CREATE TABLE "token_verify_otp" (
    "token" TEXT NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "otp" INTEGER NOT NULL,

    CONSTRAINT "token_verify_otp_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_verify_otp_otp_key" ON "token_verify_otp"("otp");
