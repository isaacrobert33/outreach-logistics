-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "outreachId" TEXT;

-- CreateTable
CREATE TABLE "Outreach" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outreach_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_outreachId_fkey" FOREIGN KEY ("outreachId") REFERENCES "Outreach"("id") ON DELETE SET NULL ON UPDATE CASCADE;
