"use client";

import { useState } from "react";

export default function ChatInput({ onSend }: any) {
  const [text, setText] = useState("");

  return (
    <div className="flex p-4 border-t border-white/10 gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ketik pesan..."
        className="flex-1 bg-transparent border border-white/10 px-3 py-2 rounded-lg"
      />

      <button
        onClick={() => {
          onSend(text);
          setText("");
        }}
        className="bg-purple-600 px-4 py-2 rounded-lg"
      >
        Kirim
      </button>
    </div>
  );
}
