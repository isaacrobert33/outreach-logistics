import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import { NextRequest } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const { name, bank, acctNo, outreachId, isPublic } = await req.json();
  const outreach = await prisma.bankDetail.update({
    where: {
      id,
    },
    data: {
      name,
      bank,
      acctNo,
      outreachId,
      isPublic,
    },
  });
  return Response({ status: 201, data: outreach });
};

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return Response({ message: "Invalid ID", status: 400 });
  }

  try {
    await prisma.bankDetail.delete({
      where: { id: id },
    });

    return Response({ status: 204 });
  } catch (error: any) {
    return Response({
      message: `Internal server error. ${error.message}`,
      status: 500,
    });
  }
}
