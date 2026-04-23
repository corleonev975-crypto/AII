"use client";

import { useState } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string, image?: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex gap-2 p-4 border-t border-white/10">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ketik pesan..."
        className="flex-1 bg-transparent border border-white/10 px-3 py-2 rounded-lg"
      />

      <button
        onClick={handleSend}
        disabled={disabled}
        className="bg-purple-600 px-4 py-2 rounded-lg"
      >
        Kirim
      </button>
    </div>
  );
}
