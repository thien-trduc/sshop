-- CreateTable
CREATE TABLE "mail_template" (
    "id" VARCHAR(225) NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "topic" VARCHAR(225) NOT NULL,

    CONSTRAINT "mail_template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mail_template_topic_key" ON "mail_template"("topic");
