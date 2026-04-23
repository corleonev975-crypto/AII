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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  }, [messages]);

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
          content: data.reply || "Tidak ada balasan.",
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
    setSidebarOpen(false);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[#05050a] text-white">
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[1px] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-[290px] border-r border-white/10 bg-[#090910]/96 shadow-[0_0_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3.5 w-3.5 rounded-full bg-purple-500 shadow-[0_0_18px_rgba(168,85,247,0.95)]" />
              <p className="tracking-[0.35em] text-white">XINN AI</p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-3xl leading-none text-white/80"
            >
              ✕
            </button>
          </div>

          <button
            onClick={clearChat}
            className="mb-4 rounded-[22px] bg-[#6d28d9] px-5 py-4 text-left text-[17px] text-white shadow-[0_0_24px_rgba(109,40,217,0.35)] transition hover:bg-[#7c3aed]"
          >
            + Chat baru
          </button>

          <input
            placeholder="Cari chat..."
            className="mb-4 rounded-[18px] border border-white/10 bg-transparent px-4 py-3.5 text-[15px] text-white outline-none placeholder:text-white/35"
          />

          <div className="space-y-2">
            <button className="w-full rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left text-[15px] text-white/90 transition hover:bg-white/[0.06]">
              Chat baru
            </button>
          </div>

          <div className="mt-auto space-y-3">
            <button className="w-full rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-[16px] text-white transition hover:bg-white/[0.06]">
              Upgrade
            </button>

            <button className="w-full rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-[16px] text-white transition hover:bg-white/[0.06]">
              Login
            </button>
          </div>
        </div>
      </aside>

      <main className="flex h-full flex-col">
        <header className="sticky top-0 z-20 bg-transparent">
          <div className="flex items-center justify-between px-4 py-5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[28px] leading-none text-white"
            >
              ☰
            </button>

            <h1 className="text-[17px] tracking-[0.42em] text-white/95">
              XINN AI
            </h1>

            <div className="flex items-center gap-2">
              <img
                src="/avatar.gif"
                alt="avatar"
                className="h-14 w-14 rounded-full object-cover ring-1 ring-purple-500/50"
              />
              <span className="text-xl text-white/90">˅</span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-4 pb-28 pt-2">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.length === 0 && <WelcomeScreen />}

            {messages.map((msg, i) => (
              <div key={i} className="animate-[fadeInUp_.28s_ease]">
                <MessageBubble
                  role={msg.role}
                  content={msg.content}
                  image={msg.image}
                />
              </div>
            ))}

            {loading && (
              <div className="animate-[fadeInUp_.25s_ease] flex justify-start">
                <div className="rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white/45"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white/45 [animation-delay:0.15s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white/45 [animation-delay:0.3s]"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </section>

        <ChatInput onSend={sendMessage} disabled={loading} />
      </main>
    </div>
  );
}
