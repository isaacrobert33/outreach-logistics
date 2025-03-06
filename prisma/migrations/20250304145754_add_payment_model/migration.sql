-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_PAID', 'PENDING', 'PAID');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NOT_PAID',
    "crew" TEXT DEFAULT 'nocrew',
    "email" TEXT,
    "paidAmount" DOUBLE PRECISION DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_email_key" ON "payments"("email");
