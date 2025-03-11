import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  if (!params) {
    return Response({ status: 401, message: "Invalid user ID." });
  }

  const user = await prisma.user.findUnique({
    where: { email: id },
  });

  if (!user) {
    return Response({ status: 404 });
  }
  return Response({ status: 200, data: user });
};
