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

async function generateNextId(outreachId?: string, crew?: string): Promise<string> {
  const prefix = (crew ?? "nocrew").slice(0, 3).toUpperCase();

  // Find the record with the highest sequential ID starting with this prefix
  const lastPayment = await prisma.payment.findFirst({
    where: {
      crew: crew ?? "nocrew",
      outreachId,
      id: {
        startsWith: `${prefix}/`,
      },
    },
    orderBy: {
      id: 'desc', // Pulls the highest string value (e.g., "NOC/010" comes after "NOC/009")
    },
    select: {
      id: true,
    },
  });

  let nextNumber = 1;

  if (lastPayment?.id) {
    // Split "NOC/010" by the slash, grab "010", and convert it to an integer
    const parts = lastPayment.id.split("/");
    const lastNumber = parseInt(parts[1], 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  // Format the incremented number back into a padded string (e.g., "011")
  return `${prefix}/${String(nextNumber).padStart(3, "0")}`;
}
  // const validateUniqueness = await prisma.payment.count({
  //   where: {
  //     OR: [{ email: validatedBody.email }, { phone: validatedBody.phone }],
  //   },
  // });

  // if (validateUniqueness) {
  //   return Response({
  //     status: 400,
  //     message: "Email or Phone number already exists.",
  //   });
  // }

 export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedBody = PaymentSchema.parse(body) as any;

    let payment;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      // Generate the ID INSIDE the loop so a retry fetches an updated number
      const paymentId = await generateNextId(
        validatedBody.outreachId,
        validatedBody.crew
      );

      try {
        payment = await prisma.payment.create({
          data: {
            ...validatedBody,
            id: paymentId,
            outreachId: validatedBody.outreachId,
          },
        });
        
        // Break out of the retry loop if creation succeeds
        break; 
      } catch (error: any) {
        // P2002 is Prisma's error code for Unique Constraint Violation
        if (error.code === 'P2002' && attempts < maxAttempts - 1) {
          attempts++;
          continue; // Concurrency collision occurred; try again with a new ID
        }
        throw error; // Re-throw if it's a completely different DB error
      }
    }

    return NextResponse.json({ status: 201, data: payment }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      {
        status: 400,
        message: error?.message || "An error occurred during execution",
        data: error.errors || null,
      },
      { status: 400 }
    );
  }
};


