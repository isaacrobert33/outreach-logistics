import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import { NextRequest } from "next/server";

export const PATCH = async (req: NextRequest) => {
  const { name, bank, acctNo } = await req.json();
  const account = await prisma.bankDetail.create({
    data: {
      name,
      acctNo,
      bank,
    },
  });
  return Response({ status: 201, data: account });
};
