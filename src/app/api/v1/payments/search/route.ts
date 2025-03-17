import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "*";
  const outreachId = searchParams.get("outreachId") || "*";

  if (!query || !outreachId)
    return Response({
      status: 400,
      message: "Both query and outreach ID query params have to be specified.",
    });

  const payment = await prisma.payment.findFirst({
    where: {
      OR: [{ email: query }, { phone: query }],
      outreachId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      outreach: true,
      bank: true,
    },
  });
  const serializedPayment = {
    ...payment,
    outreach: payment?.outreach?.theme,
    bank: payment?.bank ? `${payment.bank?.name} - ${payment.bank.bank}` : "",
  };
  return Response({
    status: 200,
    data: serializedPayment,
  });
};
