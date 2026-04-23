import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "GROQ API KEY belum diset.",
      });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Kamu adalah Xinn AI yang santai, pintar, dan membantu.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await res.json();

    console.log("GROQ:", data); // 🔥 lihat di logs

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "AI tidak memberi balasan.",
    });
  } catch (err) {
    console.error("ERROR:", err);

    return NextResponse.json({
      reply: "Terjadi error server.",
    });
  }
}
