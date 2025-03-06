import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma";

const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        const userCredentials = {
          email: credentials?.email,
          password: credentials?.password,
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/users/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(userCredentials),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      },
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "user@outreach.com",
        },
        password: { label: "Password", type: "password" },
      },
    }),
  ],

  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
    // encryption: true,
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  callbacks: {
    async session({ session, user, token }) {
      if (user !== null) {
        session.user = user;
      }
      return await session;
    },

    async jwt({ token, user }: { token: any; user: any }) {
      return await token;
    },
  },
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as any,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as any,
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
