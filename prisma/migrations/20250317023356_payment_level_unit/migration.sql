/*
  Warnings:

  - The `proof_image` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "level" TEXT,
ADD COLUMN     "unit" TEXT DEFAULT 'President',
DROP COLUMN "proof_image",
ADD COLUMN     "proof_image" TEXT[];
