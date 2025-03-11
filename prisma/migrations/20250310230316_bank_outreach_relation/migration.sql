-- AlterTable
ALTER TABLE "BankDetail" ADD COLUMN     "outreachId" TEXT;

-- AddForeignKey
ALTER TABLE "BankDetail" ADD CONSTRAINT "BankDetail_outreachId_fkey" FOREIGN KEY ("outreachId") REFERENCES "Outreach"("id") ON DELETE SET NULL ON UPDATE CASCADE;
