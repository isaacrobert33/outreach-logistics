import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "*";
  const outreach = searchParams.get("outreach") || "*";

  const filters: { [key: string]: any } = { OR: [] };

  if (query != "*") {
    filters["OR"].push({ name: { contains: query } });
    filters["OR"].push({ email: { contains: query } });
  } else {
    delete filters["OR"];
  }

  if (outreach != "*") {
    filters["outreachId"] = { equals: outreach };
  }

  const totalPaidPayment = await prisma.payment.count({
    where: { paymentStatus: "PAID", ...filters },
  });
  const totalPendingPayment = await prisma.payment.count({
    where: { paymentStatus: "PENDING", ...filters },
  });

  const totalPendingPaidAmount = await prisma.payment.aggregate({
    where: { paymentStatus: "PENDING", ...filters },
    _sum: { paidAmount: true },
  });

  const totalCompletedPaidAmount = await prisma.payment.aggregate({
    where: { paymentStatus: "PAID", ...filters },
    _sum: { paidAmount: true },
  });

  const totalPaidAmount = await prisma.payment.aggregate({
     where: filters,
    _sum: { paidAmount: true, },
  });

  return Response({
    status: 200,
    data: {
      totalPaid: totalPaidPayment,
      totalPending: totalPendingPayment,
      totalPaidAmount: totalPaidAmount._sum.paidAmount ?? 0,
      pendingPaidAmount: totalPendingPaidAmount._sum.paidAmount ?? 0,
      completedPaidAmount: totalCompletedPaidAmount._sum.paidAmount ?? 0,
    },
  });
};
