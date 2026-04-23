"use client";

import HeroAvatar from "@/components/hero-avatar";

export default function WelcomeScreen() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6">
      <HeroAvatar />

      <h2 className="mt-6 text-center text-4xl font-bold tracking-tight md:text-5xl">
        Xinn <span className="text-purple-400">AI</span>
      </h2>

      <p className="mt-3 max-w-md text-center text-sm leading-7 text-white/55 md:text-base">
        Aku adalah Xinn AI cerdas, pintar, dan bisa membantu anda.
      </p>
    </div>
  );
}
