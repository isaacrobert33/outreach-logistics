-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNSPECIFIED');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'UNSPECIFIED';
