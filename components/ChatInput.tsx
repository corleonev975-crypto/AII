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
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur p-3 border-t border-white/10">
      <div className="max-w-3xl mx-auto flex gap-2">
        
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik pesan kamu di sini..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white outline-none"
          disabled={disabled}
        />

        <button
          onClick={handleSend}
          disabled={disabled}
          className="bg-purple-600 px-5 rounded-full text-white"
        >
          Kirim
        </button>

      </div>
    </div>
  );
}
