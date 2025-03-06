import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Response } from "@/lib/utils";
import { compare } from "bcryptjs";

function exclude(user: any, keys: string[]) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

export default async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response({ status: 400, message: "invalid inputs" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    const isPasswordValid = await compare(password, user?.password as any);

    if (user && isPasswordValid) {
      // exclude password from json response
      return Response({ status: 200, data: exclude(user, ["password"]) });
    } else {
      return Response({ status: 401, message: "invalid credentials" });
    }
  } catch (e) {
    throw new Error(e as any);
  }
}
