import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const isPublic = searchParams.get("isPublic") || "*";

  const filters: { [key: string]: any } = {};

  if (isPublic != "*") {
    filters["isPublic"] = isPublic === "true";
  }

  const accounts = await prisma.bankDetail.findMany({
    where: filters,
    orderBy: { name: "desc" },
  });
  return Response({ status: 200, data: accounts });
};

export const POST = async (req: NextRequest) => {
  const { name, bank, acctNo, outreachId, isPublic } = await req.json();
  const account = await prisma.bankDetail.create({
    data: {
      name,
      acctNo,
      bank,
      outreachId,
      isPublic,
    },
  });
  return Response({ status: 201, data: account });
};
