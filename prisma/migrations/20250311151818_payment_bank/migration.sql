-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "bankId" TEXT;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
