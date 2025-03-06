import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { name, crew, email, paymentStatus, paidAmount } = await req.json();

  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const updatedPayment = await prisma.payment.update({
      where: { id: id },
      data: {
        name,
        crew,
        email,
        paymentStatus,
        paidAmount,
      },
    });

    return NextResponse.json(updatedPayment, { status: 200 });
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
