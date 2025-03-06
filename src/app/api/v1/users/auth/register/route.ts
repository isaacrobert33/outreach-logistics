import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hashPassword, Response } from "@/lib/utils";

// We hash the user entered password using crypto.js

export default async function POST(req: NextRequest) {
  let errors = [];
  const body = await req.json();

  if (body?.password.length < 6) {
    errors.push("password length should be more than 6 characters");
    return Response({ status: 400, message: errors });
  }

  try {
    const user = await prisma.user.create({
      data: { ...body, password: hashPassword(body.password) },
    });
    return Response({ data: user, status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return Response({ status: 400, message: e.message });
    }
  }
}
