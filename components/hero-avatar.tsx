'use client';

export function HeroAvatar() {
  return (
    <div className="hero-avatar-wrap" aria-hidden="true">
      <div className="hero-ring hero-ring-one" />
      <div className="hero-ring hero-ring-two" />
      <div className="hero-avatar-frame">
        <img src="/avatar.gif" alt="Xinn AI avatar" className="hero-avatar-image" />
      </div>
    </div>
  );
}
