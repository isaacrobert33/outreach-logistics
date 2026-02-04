import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import { NextRequest } from "next/server";

export const GET = async () => {
  const records = await prisma.outreach.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return Response({ status: 200, data: records });
};

export const POST = async (req: NextRequest) => {
  const { theme, description, location, date } = await req.json();
  const account = await prisma.outreach.create({
    data: {
      theme,
      description,
      location,
      date,
    },
  });
  return Response({ status: 201, data: account });
};
