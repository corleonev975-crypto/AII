"use client";

export default function HeroAvatar() {
  return (
    <div className="relative flex items-center justify-center">
      
      {/* glow */}
      <div className="absolute h-[240px] w-[240px] rounded-full bg-purple-600/20 blur-3xl" />

      {/* ring */}
      <div className="absolute h-[230px] w-[230px] animate-[spin_12s_linear_infinite] rounded-full border border-purple-500/30 border-t-purple-300/70" />

      {/* outer */}
      <div className="absolute h-[200px] w-[200px] rounded-full border border-white/10" />

      {/* avatar */}
      <div className="relative h-[170px] w-[170px] overflow-hidden rounded-full border border-purple-400/50 bg-black">
        <img
          src="/avatar.gif"
          alt="avatar"
          className="h-full w-full object-cover"
        />
      </div>

    </div>
  );
}
