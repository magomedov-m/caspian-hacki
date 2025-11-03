import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_API_URL
});

export async function POST(req: Request) {
  try {
    let { message } = await req.json();
    message = message?.trim();
    if (!message) return NextResponse.json({ error: "Пустой запрос" }, { status: 400 });

    const reports = await prisma.report.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
    const users = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    const context = `Используй только данные проекта.
Последние 10 отчетов:
${reports.map(r => `ID:${r.id}, Тип:${r.wasteType}, Статус:${r.status}, Координаты:(${r.latitude},${r.longitude}), Показ на карте:${r.show}`).join("\n")}

Последние 10 пользователей:
${users.map(u => `ID:${u.id}, Имя:${u.name}, Email:${u.email}, Email подтверждён:${u.emailVerified}`).join("\n")}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Ты умный помощник для админ-панели. Используй только информацию из этого проекта. Если вопрос не связан с проектом, ответь: 'Могу помочь только с информацией проекта'." },
        { role: "system", content: context },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "Нет ответа";
    return NextResponse.json({ answer: reply });

  } catch (err: any) {
    console.error("❌ Ошибка:", err);
    return NextResponse.json({ error: err.message || "Ошибка сервера" }, { status: 500 });
  }
}
