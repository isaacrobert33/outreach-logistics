import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider, QueryProvider } from "@/lib/providers";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { OutreachType } from "@/lib/types/common";
import axios from "axios";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Outreach '25",
//   description: "Outreach '25",
// };

export async function generateMetadata() {
  try {
    const data = await axios.get<{ data: OutreachType }>(
      `/api/v1/outreach/latest`
    );
    return {
      title: data?.data?.data?.theme || `Outreach ${new Date().getFullYear()}`,
      description: data?.data?.data?.description,
      openGraph: {
        title:
          data?.data?.data?.theme || `Outreach ${new Date().getFullYear()}`,
        description: data?.data?.data?.description,
        url: `https://outreach-caccf.vercel.app/`,
      },
    };
  } catch (err) {
    return {
      title: "Outreach",
      description: `Outreach ${new Date().getFullYear()}`,
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <QueryProvider>
          <NextAuthProvider>
            <Suspense>{children}</Suspense>
          </NextAuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
