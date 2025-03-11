import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "*";
  const status = searchParams.get("status") || "*";
  const outreach = searchParams.get("outreach") || "*";

  const filters: { [key: string]: any } = { OR: [] };

  if (query != "*") {
    filters["OR"].push({ name: { contains: query } });
    filters["OR"].push({ email: { contains: query } });
  } else {
    delete filters["OR"];
  }
  if (status != "*") {
    filters["paymentStatus"] = { equals: status };
  }

  if (outreach != "*") {
    filters["outreachId"] = { equals: outreach };
  }

  try {
    // Fetch data from database
    const records = await prisma.payment.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        crew: true,
        paymentStatus: true,
        paidAmount: true,
        createdAt: true,
      },
    }); // Adjust model name

    if (!records.length) {
      return NextResponse.json(
        { message: "No records found" },
        { status: 404 }
      );
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Records");

    // Add headers
    worksheet.addRow(Object.keys(records[0])); // Assuming non-empty records

    // Add data rows
    records.forEach((record) => {
      worksheet.addRow(Object.values(record));
    });

    // Write Excel file to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return response with Excel file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=payments.xlsx",
      },
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
