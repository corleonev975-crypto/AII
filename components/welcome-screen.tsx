'use client';

import { HeroAvatar } from '@/components/hero-avatar';

type WelcomeScreenProps = {
  onSuggestionClick: (value: string) => void;
};

const suggestions = [
  'Buatkan landing page modern untuk bisnis top up game.',
  'Tolong jelaskan ide bisnis digital yang cocok untuk pelajar.',
  'Analisis gambar ini dan jelaskan isinya.',
  'Bantu saya perbaiki kode Next.js yang error.'
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <section className="welcome-screen">
      <HeroAvatar />
      <h1>
        Xinn <span>AI</span>
      </h1>
      <p>Aku adalah Xinn AI cerdas, pintar, dan bisa membantu anda.</p>

      <div className="suggestion-grid">
        {suggestions.map((suggestion) => (
          <button key={suggestion} className="suggestion-card" onClick={() => onSuggestionClick(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}
