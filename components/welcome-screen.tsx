"use client";

import HeroAvatar from "@/components/hero-avatar";

export default function WelcomeScreen() {
  return (
    <div className="flex min-h-[68vh] flex-col items-center justify-center px-6">
      <HeroAvatar />

      <h2 className="mt-6 text-center text-5xl font-bold tracking-tight">
        Xinn <span className="text-purple-500">AI</span>
      </h2>

      <p className="mt-4 max-w-md text-center text-[18px] leading-9 text-white/60">
        Aku adalah Xinn AI cerdas, pintar,
        <br />
        dan bisa membantu anda.
      </p>
    </div>
  );
}
