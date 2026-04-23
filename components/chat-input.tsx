"use client";

import { useState } from "react";

type ChatInputProps = {
  onSend: (value: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0a0a0f]/80 px-3 py-4 backdrop-blur-xl">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-2 rounded-[30px] border border-white/10 bg-white/[0.04] p-2 shadow-[0_0_35px_rgba(168,85,247,0.08)]">
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-2xl text-white"
          >
            +
          </button>

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ketik pesan kamu di sini..."
            disabled={disabled}
            rows={1}
            className="max-h-40 min-h-[48px] flex-1 resize-none bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/35"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-lg text-white/70"
          >
            🎤
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={disabled}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#9333ea] text-lg text-white transition hover:bg-[#a855f7] disabled:opacity-50"
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
