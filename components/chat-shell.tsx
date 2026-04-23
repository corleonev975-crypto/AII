"use client";

import { useEffect, useState } from "react";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/message-bubble";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("xinn-chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("xinn-chat", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply || "Tidak ada balasan",
      };

      setMessages([...next, aiMsg]);
    } catch {
      setMessages([
        ...next,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Terjadi error saat menghubungi AI",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      
      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 pt-6">
        <div className="mx-auto max-w-3xl flex flex-col gap-4">

          {messages.length === 0 && (
            <div className="text-center mt-10">
              <h1 className="text-3xl font-bold">
                Xinn <span className="text-purple-400">AI</span>
              </h1>
              <p className="mt-2 text-white/60">
                Tanyakan apa saja...
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              isUser={msg.role === "user"}
            />
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                typing...
              </div>
            </div>
          )}

        </div>
      </div>

      {/* INPUT */}
      <ChatInput onSend={sendMessage} disabled={loading} />

    </div>
  );
}
