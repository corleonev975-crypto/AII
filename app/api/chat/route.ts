import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

type Attachment = {
  type: 'image';
  mimeType: string;
  dataUrl: string;
  name?: string;
};

type IncomingMessage = {
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
};

const apiKey = process.env.GROQ_API_KEY;

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'GROQ_API_KEY belum diisi. Tambahkan ke file .env.local lalu restart server.'
      },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as { messages?: IncomingMessage[] };
    const incomingMessages = body.messages ?? [];

    if (incomingMessages.length === 0) {
      return NextResponse.json({ error: 'Pesan kosong.' }, { status: 400 });
    }

    const hasImage = incomingMessages.some((message) => message.attachments?.some((item) => item.type === 'image'));
    const groq = new Groq({ apiKey });

    const chatMessages = [
      {
        role: 'system' as const,
        content:
          process.env.SYSTEM_PROMPT ||
          'Kamu adalah Xinn AI, asisten AI yang cerdas, natural, sopan, dan membantu. Jawab default dalam Bahasa Indonesia kecuali user memakai bahasa lain.'
      },
      ...incomingMessages.map((message) => {
        if (message.attachments?.length) {
          return {
            role: message.role,
            content: [
              {
                type: 'text' as const,
                text: message.content || 'Analisis gambar ini.'
              },
              ...message.attachments.map((attachment) => ({
                type: 'image_url' as const,
                image_url: {
                  url: attachment.dataUrl
                }
              }))
            ]
          };
        }

        return {
          role: message.role,
          content: message.content
        };
      })
    ];

    const completion = await groq.chat.completions.create({
      model: hasImage
        ? process.env.VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct'
        : process.env.TEXT_MODEL || 'openai/gpt-oss-20b',
      messages: chatMessages,
      temperature: 0.7,
      max_completion_tokens: 1400
    });

    const text = completion.choices?.[0]?.message?.content || 'Maaf, saya belum bisa menjawab sekarang.';

    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
