"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onSend: (text: string, image?: string) => void;
  disabled?: boolean;
};

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState("");
  const [previewSize, setPreviewSize] = useState("");
  const [uploading, setUploading] = useState(false);
  const [listening, setListening] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!listening) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [listening]);

  const formatTime = (s: number) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const formatSize = (size: number) => {
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSend = () => {
    if (!text.trim() && !preview) return;

    onSend(text || "Jelaskan gambar ini", preview || undefined);

    setText("");
    setPreview(null);
    setPreviewName("");
    setPreviewSize("");
    setUploading(false);
    setMenuOpen(false);

    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    setUploading(true);
    setPreviewName(file.name);
    setPreviewSize(formatSize(file.size));

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setMenuOpen(false);
      setTimeout(() => setUploading(false), 1200);
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

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = true;
    recognition.continuous = false;

    setListening(true);
    setSeconds(0);

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
      <div className="mx-auto max-w-4xl">
        {menuOpen && (
          <div className="mb-3 w-[240px] rounded-[26px] border border-white/10 bg-[#14141a]/95 p-2 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white hover:bg-white/10"
            >
              <span className="text-2xl">📎</span>
              <div>
                <p className="text-[17px]">Tambah file</p>
                <p className="text-xs text-white/45">PDF, DOC, TXT, ZIP</p>
              </div>
            </button>

            <button
              onClick={() => cameraRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white hover:bg-white/10"
            >
              <span className="text-2xl">📷</span>
              <div>
                <p className="text-[17px]">Ambil foto</p>
                <p className="text-xs text-white/45">Gunakan kamera</p>
              </div>
            </button>

            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white hover:bg-white/10"
            >
              <span className="text-2xl">🖼️</span>
              <div>
                <p className="text-[17px]">Pilih foto</p>
                <p className="text-xs text-white/45">Dari galeri</p>
              </div>
            </button>

            <button
              onClick={handleVoice}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white hover:bg-white/10"
            >
              <span className="text-2xl">🎤</span>
              <div>
                <p className="text-[17px]">Voice input</p>
                <p className="text-xs text-white/45">Bicara dengan AI</p>
              </div>
            </button>
          </div>
        )}

        {listening && (
          <div className="mb-3 flex items-center justify-between rounded-[24px] border border-white/10 bg-[#14141a]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6d28d9] text-white">
                〰️
              </div>
              <div>
                <p className="text-sm text-white">Mendengarkan...</p>
                <p className="text-xs text-white/50">{formatTime(seconds)}</p>
              </div>
            </div>

            <button
              onClick={() => setListening(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white"
            >
              ■
            </button>
          </div>
        )}

        {(preview || uploading) && (
          <div className="mb-3 flex items-center justify-between rounded-[24px] border border-white/10 bg-[#14141a]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#6d28d9] text-white">
                🖼️
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm text-white">
                  {previewName || "IMG_UPLOAD.jpg"}
                </p>
                <p className="text-xs text-white/50">
                  {previewSize || "2.4 MB"} •{" "}
                  {uploading ? "Mengupload..." : "Siap dikirim"}
                </p>

                <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-[#9333ea] ${
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
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#15151c]/92 px-2 py-2 shadow-[0_0_25px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6d28d9] text-[22px] leading-none text-white"
          >
            +
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf,.txt,.doc,.docx,.zip"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Balas ke Xinn AI"
            disabled={disabled}
            className="h-10 flex-1 bg-transparent px-1 text-[16px] text-white outline-none placeholder:text-white/35"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            onClick={handleVoice}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-transparent text-white/80"
          >
            🎤
          </button>

          <button
            onClick={handleSend}
            disabled={disabled}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black disabled:opacity-50"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
                      }
