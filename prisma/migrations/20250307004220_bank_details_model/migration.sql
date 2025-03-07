-- CreateTable
CREATE TABLE "BankDetail" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "acctNo" TEXT,

    CONSTRAINT "BankDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankDetail_acctNo_key" ON "BankDetail"("acctNo");
