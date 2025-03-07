import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";

export const GET = async ({ params }: { params: Promise<{ id: string }> }) => {
  console.log(params);

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
