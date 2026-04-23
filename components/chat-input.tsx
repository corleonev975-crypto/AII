"use client";

import { useState } from "react";

export function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full border-t border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl p-3">
      <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
        
        <button className="text-purple-400 text-xl">+</button>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ketik pesan kamu di sini..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
        />

        <button className="text-white/50">🎤</button>

        <button
          onClick={send}
          className="rounded-full bg-purple-600 px-4 py-1 text-sm hover:bg-purple-500"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
