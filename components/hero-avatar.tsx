"use client";

export default function HeroAvatar() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute h-[260px] w-[260px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute h-[230px] w-[230px] animate-[spin_12s_linear_infinite] rounded-full border border-purple-500/35 border-t-purple-300/80" />
      <div className="absolute h-[200px] w-[200px] rounded-full border border-white/10" />

      <div className="relative h-[170px] w-[170px] overflow-hidden rounded-full border border-purple-400/50 bg-black shadow-[0_0_60px_rgba(168,85,247,0.35)]">
        <img
          src="/avatar.gif"
          alt="avatar"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
