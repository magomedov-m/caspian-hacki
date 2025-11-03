import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      where: { show: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports || []);
  } catch (error) {
    console.error("Ошибка при получении отчётов:", error);

    return NextResponse.json(
      { error: "Ошибка сервера при получении отчётов" },
      { status: 500 }
    );
  }
}
