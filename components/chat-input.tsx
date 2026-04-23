'use client';

import { Attachment } from '@/lib/types';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (payload: { text: string; attachments: Attachment[] }) => Promise<void>;
  loading: boolean;
};

export function ChatInput({ value, onChange, onSubmit, loading }: ChatInputProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(() => value.trim().length > 0 || attachments.length > 0, [value, attachments]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    const images = await Promise.all(
      files.map(
        (file) =>
          new Promise<Attachment>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                type: 'image',
                mimeType: file.type || 'image/png',
                dataUrl: String(reader.result),
                name: file.name
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );
    setAttachments((prev) => [...prev, ...images]);
    event.target.value = '';
  }

  function startSpeechRecognition() {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? ((window as Window & { webkitSpeechRecognition?: any }).webkitSpeechRecognition ||
            (window as Window & { SpeechRecognition?: any }).SpeechRecognition)
        : null;

    if (!SpeechRecognition) {
      window.alert('Browser kamu belum support voice input. Coba Chrome Android terbaru.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript || '')
        .join(' ');
      onChange(`${value}${value ? ' ' : ''}${transcript}`.trim());
    };

    recognition.start();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || loading) return;
    const payload = { text: value, attachments };
    setAttachments([]);
    await onSubmit(payload);
  }

  return (
    <div className="composer-wrap">
      {attachments.length > 0 ? (
        <div className="composer-previews">
          {attachments.map((attachment, index) => (
            <div key={`${attachment.dataUrl}-${index}`} className="composer-preview-card">
              <img src={attachment.dataUrl} alt={attachment.name || 'Upload'} />
              <button onClick={() => setAttachments((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}>
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <form className="composer" onSubmit={handleSubmit}>
        <button type="button" className="composer-circle primary" onClick={() => fileRef.current?.click()}>
          +
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          multiple
          onChange={handleFileChange}
        />

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ketik pesan kamu di sini..."
          rows={1}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSubmit(event as unknown as FormEvent);
            }
          }}
        />

        <button
          type="button"
          className={`composer-circle ${listening ? 'active' : ''}`}
          onClick={startSpeechRecognition}
          aria-label="Voice input"
        >
          🎤
        </button>

        <button type="submit" className="composer-circle primary" disabled={!canSubmit || loading}>
          ↑
        </button>
      </form>

      <p className="composer-note">Xinn AI dapat membuat kesalahan. Periksa info penting.</p>
    </div>
  );
}
