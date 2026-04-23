import { NextResponse } from "next/server";

const TEXT_MODEL = "llama3-70b-8192";
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "GROQ_API_KEY belum diisi." },
        { status: 500 }
      );
    }

    const body = image
      ? {
          model: VISION_MODEL,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: message || "Jelaskan gambar ini.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: image,
                  },
                },
              ],
            },
          ],
        }
      : {
          model: TEXT_MODEL,
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    const reply =
      data?.choices?.[0]?.message?.content || "Maaf, AI tidak memberi balasan.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
