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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text || "Jelaskan gambar ini", image },
    ];

    setMessages(newMessages);
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
        ...newMessages,
        {
          role: "assistant",
          content: data.reply || "Tidak ada balasan",
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Terjadi error saat menghubungi AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#05050a] text-white">
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-[300px] border-r border-white/10 bg-[#090910]/95 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.9)]" />
              <p className="tracking-[0.4em] text-white">XINN AI</p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-3xl text-white/80 md:hidden"
            >
              ✕
            </button>
          </div>

          <button className="mb-5 rounded-[24px] bg-[#6d28d9] px-5 py-5 text-left text-[18px] text-white shadow-[0_0_30px_rgba(109,40,217,0.35)]">
            + Chat baru
          </button>

          <input
            placeholder="Cari chat..."
            className="mb-5 rounded-[20px] border border-white/10 bg-transparent px-4 py-4 text-[17px] text-white outline-none placeholder:text-white/35"
          />

          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-[18px] text-white">
            Chat baru
          </div>

          <div className="mt-auto space-y-4">
            <button className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-5 text-[18px] text-white">
              Upgrade
            </button>

            <button className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-5 text-[18px] text-white">
              Login
            </button>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-4xl text-white"
          >
            ☰
          </button>

          <h1 className="text-[18px] tracking-[0.45em] text-white">XINN AI</h1>

          <div className="flex items-center gap-2">
            <img
              src="/avatar.gif"
              alt="avatar"
              className="h-16 w-16 rounded-full object-cover ring-1 ring-purple-500/50"
            />
            <span className="text-2xl text-white">⌄</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-40 pt-2">
          <div className="mx-auto flex max-w-4xl flex-col gap-4">
            {messages.length === 0 && <WelcomeScreen />}

            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                role={msg.role}
                content={msg.content}
                image={msg.image}
              />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/60">
                  Typing...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <ChatInput onSend={sendMessage} disabled={loading} />
      </main>
    </div>
  );
            }
