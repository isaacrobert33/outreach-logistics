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

  const filters: { [key: string]: any } = { OR: [], isDeleted: false };

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
    bank: item?.bank ? `${item.bank?.name} - ${item.bank.bank}` : "",
  }));
  return Response({
    status: 200,
    data: serializedPayments,
  });
};

// const generatePaymentId = async (outreachId?: string, crew?: string) => {
//   crew = crew ?? "nocrew";
//   const paymentCount = await prisma.payment.count({
//     where: { crew: crew, outreachId },
//   });
//   const id = `${crew.slice(0, 3).toUpperCase()}/${formatNumber(paymentCount + 1)}`;
//   const idExists = !!(await prisma.payment.count({ where: { id } }));

//   return idExists ? `${crew.slice(0, 3).toUpperCase()}/${formatNumber(paymentCount + 2)}`: id;
// };

async function generateNextId(outreachId?: string, crew?: string) {
  // Get the last created record by ID (assuming sequential creation)
  const lastRecord = await prisma.payment.findFirst({
    where: { crew: crew ?? "nocrew", outreachId },
    orderBy: { createdAt: "desc" },
  });

  let newId;
  if (lastRecord && lastRecord.id) {
    const [prefix, numPart] = lastRecord.id.split("/");
    const nextNumber = String(parseInt(numPart, 10) + 1).padStart(3, "0");
    newId = `${prefix}/${nextNumber}`;
  } else {
    // If no record exists yet
    newId = `${(crew ?? "nocrew").slice(0, 3).toUpperCase()}/001`;
  }

  return newId;
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const validatedBody = PaymentSchema.parse(body) as any;

  const validateUniqueness = await prisma.payment.count({
    where: {
      OR: [{ email: validatedBody.email }, { phone: validatedBody.phone }],
    },
  });

  if (validateUniqueness) {
    return Response({
      status: 400,
      message: "Email or Phone number already exists.",
    });
  }

  const paymentId = await generateNextId(
    validatedBody.outreachId,
    validatedBody.crew
  );

  try {
    const payment = await prisma.payment.create({
      data: {
        ...validatedBody,
        id: paymentId,
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
      message: `${error?.message} ${paymentId}`,
      data: error.errors,
    });
  }
};
