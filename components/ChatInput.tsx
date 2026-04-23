"use client";

import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-[#0a0a0f]/80 px-3 py-4 backdrop-blur-xl">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-2 rounded-[28px] border border-white/10 bg-white/[0.04] p-2 shadow-[0_0_40px_rgba(124,58,237,0.10)]">
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-2xl text-white"
          >
            +
          </button>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ketik pesan kamu di sini..."
            rows={1}
            disabled={disabled}
            className="max-h-40 min-h-[48px] flex-1 resize-none bg-transparent px-2 py-3 text-white outline-none placeholder:text-white/35"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-lg text-white"
          >
            🎤
          </button>

          <button
            onClick={handleSend}
            disabled={disabled}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-lg text-white disabled:opacity-50"
          >
            ↑
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-white/35">
          Xinn AI dapat membuat kesalahan. Periksa info penting.
        </p>
      </div>
    </div>
  );
}
