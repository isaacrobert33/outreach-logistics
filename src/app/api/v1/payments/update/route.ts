import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const {
    name,
    crew,
    email,
    phone,
    paymentStatus,
    outreachId,
    bankId,
    paidAmount,
    gender,
  } = await req.json();

  if (!id) {
    return Response({ message: "Invalid ID", status: 400 });
  }

  try {
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        name,
        crew,
        email,
        phone,
        paymentStatus,
        outreachId,
        bankId,
        paidAmount,
        gender,
      },
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
    await prisma.payment.delete({
      where: { id: id },
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
