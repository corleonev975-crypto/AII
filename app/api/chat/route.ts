import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "API KEY belum diisi" },
        { status: 500 }
      );
    }

    let messages;

    // 👉 FIX STRUCTURE DI SINI
    if (image) {
      messages = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message || "Jelaskan gambar ini",
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ];
    } else {
      messages = [
        {
          role: "user",
          content: message,
        },
      ];
    }

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: image
            ? "meta-llama/llama-4-scout-17b-16e-instruct"
            : "llama3-70b-8192",
          messages: messages,
        }),
      }
    );

    const data = await res.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Tidak ada balasan dari AI";

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { reply: "Server error" },
      { status: 500 }
    );
  }
}
