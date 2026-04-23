"use client";

import { useEffect, useRef, useState } from "react";

type ChatInputProps = {
  onSend: (value: string, image?: string) => void;
  disabled?: boolean;
};

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState("");
  const [previewSize, setPreviewSize] = useState("");
  const [uploading, setUploading] = useState(false);
  const [listening, setListening] = useState(false);
  const [recordSec, setRecordSec] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!listening) return;
    const timer = setInterval(() => {
      setRecordSec((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [listening]);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSend = async () => {
    if (!value.trim() && !preview) return;

    const text = value.trim();
    const image = preview || undefined;

    setValue("");
    setPreview(null);
    setPreviewName("");
    setPreviewSize("");
    setMenuOpen(false);
    setUploading(false);

    onSend(text || "Jelaskan gambar ini", image);

    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const handleFileChange = (file?: File) => {
    if (!file) return;

    setUploading(true);
    setPreviewName(file.name);
    setPreviewSize(formatBytes(file.size));

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setMenuOpen(false);

      setTimeout(() => {
        setUploading(false);
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  const handleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input belum didukung browser ini.");
      return;
    }

    if (listening) {
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = true;
    recognition.continuous = false;

    setListening(true);
    setRecordSec(0);

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-4">
      <div className="mx-auto max-w-4xl">
        {menuOpen && (
          <div className="mb-3 w-[240px] rounded-[28px] border border-white/10 bg-[#14141a]/95 p-2 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white hover:bg-white/10"
            >
              <span className="text-2xl">📎</span>
              <div>
                <p className="text-base">Tambah file</p>
                <p className="text-sm text-white/45">PDF, DOC, TXT, ZIP</p>
              </div>
            </button>

            <button
              onClick={() => cameraRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white hover:bg-white/10"
            >
              <span className="text-2xl">📷</span>
              <div>
                <p className="text-base">Ambil foto</p>
                <p className="text-sm text-white/45">Gunakan kamera</p>
              </div>
            </button>

            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white hover:bg-white/10"
            >
              <span className="text-2xl">🖼️</span>
              <div>
                <p className="text-base">Pilih foto</p>
                <p className="text-sm text-white/45">Dari galeri</p>
              </div>
            </button>

            <button
              onClick={handleVoice}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white hover:bg-white/10"
            >
              <span className="text-2xl">🎙️</span>
              <div>
                <p className="text-base">Voice input</p>
                <p className="text-sm text-white/45">Bicara dengan AI</p>
              </div>
            </button>
          </div>
        )}

        {listening && (
          <div className="mb-3 flex items-center justify-between rounded-[28px] border border-white/10 bg-[#14141a]/95 px-4 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6d28d9] text-white">
                〰️
              </div>
              <div>
                <p className="text-base text-white">Mendengarkan...</p>
                <p className="text-sm text-white/50">{formatTime(recordSec)}</p>
              </div>
            </div>

            <button
              onClick={() => setListening(false)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white"
            >
              ■
            </button>
          </div>
        )}

        {(preview || uploading) && (
          <div className="mb-3 flex items-center justify-between rounded-[28px] border border-white/10 bg-[#14141a]/95 px-4 py-4 backdrop-blur-xl">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#6d28d9] text-white">
                🖼️
              </div>

              <div className="min-w-0">
                <p className="truncate text-base text-white">
                  {previewName || "IMG_UPLOAD.jpg"}
                </p>
                <p className="text-sm text-white/50">
                  {previewSize || "2.4 MB"} • {uploading ? "Mengupload..." : "Siap dikirim"}
                </p>

                <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-[#9333ea] transition-all duration-500 ${
                      uploading ? "w-3/4" : "w-full"
                    }`}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setPreview(null);
                setPreviewName("");
                setPreviewSize("");
                setUploading(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#15151c]/95 px-3 py-3 shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#6d28d9] text-[30px] leading-none text-white"
          >
            +
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf,.txt,.doc,.docx,.zip"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />

          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Balas ke Xinn AI"
            disabled={disabled}
            className="h-12 flex-1 bg-transparent text-[18px] text-white outline-none placeholder:text-white/35"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            onClick={handleVoice}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-transparent text-white"
          >
            🎤
          </button>

          <button
            onClick={handleSend}
            disabled={disabled}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-black disabled:opacity-50"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
  }
