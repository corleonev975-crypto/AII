'use client';

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="topbar">
      <button className="icon-button" onClick={onMenuClick} aria-label="Buka menu">
        <span />
        <span />
        <span />
      </button>

      <div className="brand-wrap">
        <div className="brand-title">
          Xinn <span>AI</span>
        </div>
      </div>

      <div className="status-pill">
        <span className="status-dot" />
        Online
      </div>
    </header>
  );
}
