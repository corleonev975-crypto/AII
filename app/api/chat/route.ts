import { NextResponse } from "next/server";

const TEXT_MODEL = "llama-3.3-70b-versatile";
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "GROQ_API_KEY belum diisi di Vercel." },
        { status: 500 }
      );
    }

    const body = image
      ? {
          model: VISION_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Kamu adalah Xinn AI, asisten yang santai, pintar, dan membantu. Jawab pakai bahasa Indonesia yang natural.",
            },
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
          temperature: 0.7,
          max_tokens: 1024,
        }
      : {
          model: TEXT_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Kamu adalah Xinn AI, asisten yang santai, pintar, dan membantu. Jawab pakai bahasa Indonesia yang natural.",
            },
            {
              role: "user",
              content: message || "Halo",
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
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

    if (!res.ok) {
      return NextResponse.json(
        {
          reply:
            data?.error?.message ||
            "Request ke Groq gagal.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "Groq tidak memberi balasan.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        reply: "Terjadi error server saat menghubungi Groq.",
      },
      { status: 500 }
    );
  }
              }
