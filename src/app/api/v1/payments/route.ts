import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { formatNumber, Response } from "@/lib/utils";
import { PaymentSchema } from "@/lib/schema";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "*";
  const status = searchParams.get("status") || "*";
  const outreach = searchParams.get("outreach") || "*";
  const bank = searchParams.get("bank") || "*";
  const gender = searchParams.get("gender") || "*";

  const filters: { [key: string]: any } = { OR: [] };

  if (query != "*") {
    filters["OR"].push({ name: { contains: query } });
    filters["OR"].push({ email: { contains: query } });
  } else {
    delete filters["OR"];
  }
  if (status != "*") {
    filters["paymentStatus"] = { equals: status };
  }

  if (outreach != "*") {
    filters["outreachId"] = { equals: outreach };
  }

  if (bank != "*") {
    filters["bankId"] = { equals: bank };
  }

  if (gender != "*") {
    filters["gender"] = { equals: gender };
  }

  const payments = await prisma.payment.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
    include: {
      outreach: true,
      bank: true,
    },
  });
  const serializedPayments = payments.map((item) => ({
    ...item,
    outreach: item.outreach?.theme,
    bank: item?.bank ? `${item.bank?.name} - ${item.bank.bank}` : "",
  }));
  return Response({
    status: 200,
    data: serializedPayments,
  });
};

const generatePaymentId = async (outreachId?: string, crew?: string) => {
  crew = crew ?? "nocrew";
  const paymentCount = await prisma.payment.count({
    where: { crew: crew, outreachId },
  });
  return `${crew.slice(0, 3).toUpperCase()}/${formatNumber(paymentCount + 1)}`;
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validatedBody = PaymentSchema.parse(body);

    const payment = await prisma.payment.create({
      data: {
        ...validatedBody,
        id: await generatePaymentId(
          validatedBody.outreachId,
          validatedBody.crew
        ),
        outreachId: validatedBody.outreachId,
      },
    });

    return Response({
      status: 201,
      data: payment,
    });
  } catch (error: any) {
    return Response({
      status: 400,
      message: error?.message,
      data: error.errors,
    });
  }
};
