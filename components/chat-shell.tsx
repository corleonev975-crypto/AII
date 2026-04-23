"use client";

import { useState, useRef, useEffect } from "react";
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

  // auto scroll ke bawah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // kirim chat
  const sendMessage = async (text: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content: text }];

    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.reply || "Error",
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Terjadi error.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src="/avatar.gif"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">Xinn AI</p>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>

        <button className="rounded-full border border-white/10 px-4 py-1 text-sm">
          GPT Style
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        {messages.length === 0 && (
          <WelcomeScreen onSuggestionClick={sendMessage} />
        )}

        <div className="mx-auto flex max-w-3xl flex-col gap-4">

          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              role={msg.role}
              content={msg.content}
            />
          ))}

          {/* LOADING (TYPING DOTS) */}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/50"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:0.15s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:0.3s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />

        </div>
      </div>

      {/* INPUT */}
      <ChatInput onSend={sendMessage} />

    </div>
  );
              }
