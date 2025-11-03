import OpenAI from "openai";
import { NextResponse } from "next/server";

// ТУТ ДОЛЖЕН БЫТЬ КОД С КЛЮЧОМ И URL

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Пустой запрос" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Ты умный помощник для админ-панели." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? null;

    if (!reply) {
      return NextResponse.json({ error: "Нет ответа от модели" }, { status: 502 });
    }

    return NextResponse.json({ answer: reply });
  } catch (err: any) {
    console.error("❌ Ошибка OpenAI:", err);
    return NextResponse.json(
      { error: err.message || "Ошибка получения ответа от ИИ" },
      { status: 500 }
    );
  }
}
