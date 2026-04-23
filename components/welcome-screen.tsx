"use client";

import HeroAvatar from "@/components/hero-avatar";

type WelcomeScreenProps = {
  onSuggestionClick: (value: string) => void;
};

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      
      <HeroAvatar />

      <h2 className="mt-6 text-center text-4xl font-bold tracking-tight md:text-5xl">
        Xinn <span className="text-purple-400">AI</span>
      </h2>

      <p className="mt-3 max-w-md text-center text-sm leading-7 text-white/55 md:text-base">
        Aku adalah Xinn AI cerdas, pintar, dan bisa membantu anda.
      </p>

      <div className="mt-8 grid w-full max-w-3xl gap-3 md:grid-cols-2">

        <button
          onClick={() => onSuggestionClick("Buatkan website modern")}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]"
        >
          <p className="font-medium">Buatkan website modern</p>
          <p className="mt-1 text-sm text-white/45">
            Landing page premium, clean, dan mobile friendly
          </p>
        </button>

        <button
          onClick={() => onSuggestionClick("Jelaskan coding error")}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]"
        >
          <p className="font-medium">Jelaskan coding error</p>
          <p className="mt-1 text-sm text-white/45">
            Bantu debug biar cepat beres
          </p>
        </button>

        <button
          onClick={() => onSuggestionClick("Buatkan prompt AI")}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]"
        >
          <p className="font-medium">Buatkan prompt AI</p>
          <p className="mt-1 text-sm text-white/45">
            Untuk website, bot, atau desain
          </p>
        </button>

        <button
          onClick={() => onSuggestionClick("Bantu ide bisnis digital")}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]"
        >
          <p className="font-medium">Bantu ide bisnis digital</p>
          <p className="mt-1 text-sm text-white/45">
            Cari ide yang realistis dan cuan
          </p>
        </button>

      </div>
    </div>
  );
}
