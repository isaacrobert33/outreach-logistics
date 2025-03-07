import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import { NextApiRequest } from "next";

export const GET = async (req: NextApiRequest) => {
  const totalPaidPayment = await prisma.payment.count({
    where: { paymentStatus: "PAID" },
  });
  const totalPendingPayment = await prisma.payment.count({
    where: { paymentStatus: "PENDING" },
  });

  const totalPendingPaidAmount = await prisma.payment.aggregate({
    where: { paymentStatus: "PENDING" },
    _sum: { paidAmount: true },
  });

  const totalCompletedPaidAmount = await prisma.payment.aggregate({
    where: { paymentStatus: "PAID" },
    _sum: { paidAmount: true },
  });

  const totalPaidAmount = await prisma.payment.aggregate({
    _sum: { paidAmount: true },
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
