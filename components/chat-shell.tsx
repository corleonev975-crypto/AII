"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { MessageBubble } from "@/components/message-bubble";
import WelcomeScreen from "@/components/welcome-screen";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("xinn_messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("xinn_messages", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
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
          message: text,
        }),
      });

      const data = await res.json();

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply || "Maaf, tidak ada balasan.",
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Terjadi error saat menghubungi AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("xinn_messages");
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white">
      <aside className="hidden w-[280px] shrink-0 border-r border-white/10 bg-[#0b0b12] md:flex md:flex-col">
        <div className="border-b border-white/10 p-4">
          <button
            onClick={clearChat}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-medium transition hover:bg-white/[0.07]"
          >
            + New chat
          </button>
        </div>

        <div className="flex-1 p-3">
          <p className="mb-3 px-2 text-xs uppercase tracking-[0.2em] text-white/35">
            Recent
          </p>

          <div className="space-y-2">
            <button className="w-full rounded-xl px-3 py-3 text-left text-sm text-white/75 transition hover:bg-white/[0.05]">
              Xinn AI chat
            </button>
            <button className="w-full rounded-xl px-3 py-3 text-left text-sm text-white/45 transition hover:bg-white/[0.05]">
              Debug coding
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <img
              src="/avatar.gif"
              alt="Xinn AI"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">Xinn AI</p>
              <p className="text-xs text-white/45">GPT Style Assistant</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <img
                src="/avatar.gif"
                alt="Xinn AI"
                className="h-11 w-11 rounded-full object-cover ring-1 ring-purple-500/40"
              />
              <div>
                <h1 className="text-base font-semibold md:text-lg">Xinn AI</h1>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>

            <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80">
              GPT Style
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-36 pt-6">
          <div className="mx-auto flex max-w-4xl flex-col gap-4">
            {messages.length === 0 && (
              <WelcomeScreen onSuggestionClick={sendMessage} />
            )}

            {messages.map((msg, index) => (
              <MessageBubble
                key={index}
                role={msg.role}
                content={msg.content}
              />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] items-start gap-3">
                  <img
                    src="/avatar.gif"
                    alt="Xinn AI"
                    className="mt-1 h-9 w-9 rounded-full object-cover ring-1 ring-purple-500/30"
                  />

                  <div className="rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/50"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:0.3s]"></span>
                    </div>
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
