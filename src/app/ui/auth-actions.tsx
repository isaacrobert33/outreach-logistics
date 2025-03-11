"use server";

import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { signIn } from "next-auth/react";
import AuthError from "next-auth";
import prisma from "@/lib/prisma";

type SignUpData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export async function signUp(data: SignUpData) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    // Hash the password
    const hashedPassword = await hash(data.password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
    revalidatePath("/");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during signup");
  }
}

export async function login(data: LoginData) {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Invalid email or password");
    }

    revalidatePath("/");
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error("Invalid email or password");
    }
    throw new Error("An unexpected error occurred during login");
  }
}
