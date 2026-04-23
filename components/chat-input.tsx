"use client";

import { useState } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="p-3 border-t border-white/10">
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Balas ke Xinn AI..."
          className="flex-1 bg-white/10 px-3 py-2 rounded-lg text-white outline-none"
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 px-4 py-2 rounded-lg"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
