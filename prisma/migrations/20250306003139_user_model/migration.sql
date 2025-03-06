/*
  Warnings:

  - You are about to drop the column `crew` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `paidAmount` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "crew",
DROP COLUMN "paid",
DROP COLUMN "paidAmount",
ADD COLUMN     "password" TEXT;
