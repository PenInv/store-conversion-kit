'use client';

export default function SearchBar({
  valor,
  onChange,
}: {
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">Buscar scripts</span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nome ou tag..."
        className="w-full border border-hairline bg-surface py-4 pl-11 pr-4 text-body-sm placeholder:text-muted focus:border-m-blue focus:outline-none"
      />
    </label>
  );
}
