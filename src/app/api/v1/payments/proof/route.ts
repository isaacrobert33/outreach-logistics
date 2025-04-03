import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Response } from "@/lib/utils";
import cloudinary from "cloudinary";
import { Readable } from "stream";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // if (!id) {
  //   return Response({ message: "Invalid ID", status: 400 });
  // }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadPromise = new Promise<cloudinary.UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "outreach" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          }
        );

        Readable.from(buffer).pipe(uploadStream);
      }
    );

    const result = await uploadPromise;

    if (id) {
    // Update payment
    await prisma.payment.update({
      where: { id },
      data: {
        proof_image: {
          push: result.public_id,
        },
      },
    });
  }

    return Response({ data: result, status: 200, message: "File uploaded" });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to upload file ${error}` },
      { status: 500 }
    );
  }
}
