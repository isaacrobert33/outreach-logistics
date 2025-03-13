import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";

export const GET = async () => {
  const outreach = await prisma.outreach.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  return Response({ status: 200, data: outreach });
};
