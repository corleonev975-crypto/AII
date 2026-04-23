"use client";

export default function HeroAvatar() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute h-[280px] w-[280px] rounded-full bg-purple-700/15 blur-3xl" />
      <div className="absolute h-[230px] w-[230px] rounded-full border border-purple-500/35" />
      <div className="absolute h-[205px] w-[205px] rounded-full border border-purple-500/45" />
      <div className="absolute h-[185px] w-[185px] rounded-full border border-purple-400/25" />

      <div className="relative h-[170px] w-[170px] overflow-hidden rounded-full border border-purple-400/50 bg-black shadow-[0_0_65px_rgba(168,85,247,0.40)]">
        <img
          src="/avatar.gif"
          alt="avatar"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
