import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();

    // ⚠️ GANTI API KEY KAMU DI SINI
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Kamu adalah Xinn AI, asisten pintar, santai, dan membantu.",
          },
          {
            role: "user",
            content: image
              ? [
                  { type: "text", text: message },
                  { type: "image_url", image_url: { url: image } },
                ]
              : message,
          },
        ],
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "AI tidak merespon.",
    });
  } catch (err) {
    return NextResponse.json({
      reply: "Terjadi error server.",
    });
  }
}
