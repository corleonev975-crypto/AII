"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/message-bubble";
import HeroAvatar from "@/components/hero-avatar";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("xinn-chat");
    if (raw) setMessages(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("xinn-chat", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
          content: "Terjadi error saat menghubungi AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#0a0a0f] text-white">
      <aside className="hidden w-[260px] shrink-0 border-r border-white/5 bg-[#0c0c12] md:flex md:flex-col">
        <div className="p-4">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-purple-500/40">
              <img
                src="/avatar.gif"
                alt="Xinn AI"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Xinn AI</p>
              <p className="text-xs text-white/50">AI Assistant</p>
            </div>
          </div>

          <button className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-medium transition hover:bg-white/[0.07]">
            + New Chat
          </button>
        </div>

        <div className="px-3 pb-3">
          <p className="mb-2 px-2 text-xs uppercase tracking-[0.2em] text-white/35">
            Recent
          </p>

          <div className="space-y-2">
            <div className="rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/[0.05]">
              Chat terbaru
            </div>
            <div className="rounded-xl px-3 py-2 text-sm text-white/45 hover:bg-white/[0.05]">
              Tanya coding
            </div>
          </div>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">
            Xinn AI dapat membuat kesalahan.
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col">
        <div className="sticky top-0 z-20 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 overflow-hidden rounded-full border border-purple-500/40 md:hidden">
                <img
                  src="/avatar.gif"
                  alt="Xinn AI"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-base font-semibold md:text-lg">Xinn AI</h1>
                <p className="text-xs text-white/45">Online</p>
              </div>
            </div>

            <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80">
              GPT Style
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-36 pt-6">
          <div className="mx-auto flex max-w-4xl flex-col gap-5">
            {messages.length === 0 && (
              <div className="flex min-h-[70vh] flex-col items-center justify-center">
                <HeroAvatar />

                <h2 className="mt-6 text-center text-4xl font-bold tracking-tight md:text-5xl">
                  Xinn <span className="text-purple-400">AI</span>
                </h2>

                <p className="mt-3 max-w-md text-center text-sm leading-7 text-white/55 md:text-base">
                  Aku adalah Xinn AI cerdas, pintar, dan bisa membantu anda.
                </p>

                <div className="mt-8 grid w-full max-w-3xl gap-3 md:grid-cols-2">
                  <button className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]">
                    <p className="font-medium">Buatkan website modern</p>
                    <p className="mt-1 text-sm text-white/45">
                      Landing page premium, clean, dan mobile friendly
                    </p>
                  </button>

                  <button className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]">
                    <p className="font-medium">Jelaskan coding error</p>
                    <p className="mt-1 text-sm text-white/45">
                      Bantu debug biar cepat beres
                    </p>
                  </button>

                  <button className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]">
                    <p className="font-medium">Buatkan prompt AI</p>
                    <p className="mt-1 text-sm text-white/45">
                      Untuk website, bot, atau desain
                    </p>
                  </button>

                  <button className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]">
                    <p className="font-medium">Bantu ide bisnis digital</p>
                    <p className="mt-1 text-sm text-white/45">
                      Cari ide yang realistis dan cuan
                    </p>
                  </button>
                </div>
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
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-purple-500/40">
                  <img
                    src="/avatar.gif"
                    alt="Xinn AI"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400" />
                  </div>
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
