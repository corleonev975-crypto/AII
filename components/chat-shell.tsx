"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "@/components/chat-input";
import MessageBubble from "@/components/message-bubble";
import WelcomeScreen from "@/components/welcome-screen";

type Message = {
  role: "user" | "assistant";
  content: string;
  image?: string;
};

export default function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const nextMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: text || "Jelaskan gambar ini",
        image,
      },
    ];

    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text || "Jelaskan gambar ini",
          image,
        }),
      });

      const data = await res.json();

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply || "Tidak ada balasan",
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Terjadi error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && <WelcomeScreen />}

          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              role={msg.role}
              content={msg.content}
              image={msg.image}
            />
          ))}

          {loading && <p className="text-white/50">Typing...</p>}

          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
      }
