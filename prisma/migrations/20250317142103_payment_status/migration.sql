-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PARTIAL';

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';
