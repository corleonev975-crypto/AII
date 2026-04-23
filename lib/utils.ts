export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp);
}

export function clampText(input: string, max = 80) {
  const clean = input.trim().replace(/\s+/g, ' ');
  return clean.length <= max ? clean : `${clean.slice(0, max)}…`;
}
