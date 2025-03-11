/*
  Warnings:

  - You are about to drop the column `public` on the `BankDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankDetail" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN DEFAULT true;
