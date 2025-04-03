import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import { PaymentSchema } from "@/lib/schema";
import { PaymentStatus } from "@prisma/client";

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const payload = await req.json();

  if (!id) {
    return Response({ message: "Invalid ID", status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { id } });

  if (!payment) {
    return Response({ status: 404, message: "Payment not found." });
  }

  const validatedData = PaymentSchema.partial().strict().parse(payload) as any;

  if (validatedData.pendingAmount) {
    // Ensure pending amount adds to existing
    validatedData.pendingAmount =
      (payment.pendingAmount ?? 0) + validatedData.pendingAmount;
    validatedData.paymentStatus = PaymentStatus.PENDING;
  }

  try {
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { ...validatedData },
    });

    return Response({ data: updatedPayment, status: 200 });
  } catch (error: any) {
    return Response({
      message: `Internal server error. ${error.message}`,
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response({ message: "Invalid ID", status: 400 });
  }

  try {
    await prisma.payment.update({
      where: { id: id },
      data: {
        isDeleted: true,
      }
    });

    return Response({ status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// export async function OPTIONS() {
//     return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
// }
