import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const outreach = await prisma.outreach.findFirst({
    where: {
      id,
    },
  });
  return Response({ status: 200, data: outreach });
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const { theme, description, location, date, fee } = await req.json();
  const outreach = await prisma.outreach.update({
    where: {
      id,
    },
    data: {
      theme,
      description,
      location,
      date,
      fee,
    },
  });
  return Response({ status: 202, data: outreach });
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
    await prisma.outreach.delete({
      where: { id: id },
    });

    return Response({ status: 204 });
  } catch (error: any) {
    return Response({
      message: `Internal server error ${error.message}`,
      status: 500,
    });
  }
}
