'use client';

import { CATEGORY_LABELS, type Category } from '@/types/script';

export default function CategoryFilters({
  categorias,
  ativa,
  onChange,
}: {
  categorias: Category[];
  ativa: Category | 'all';
  onChange: (c: Category | 'all') => void;
}) {
  const itens: Array<{ id: Category | 'all'; rotulo: string }> = [
    { id: 'all', rotulo: 'All' },
    ...categorias.map((c) => ({ id: c, rotulo: CATEGORY_LABELS[c] })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {itens.map((i) => {
        const sel = i.id === ativa;
        return (
          <button
            key={i.id}
            type="button"
            onClick={() => onChange(i.id)}
            aria-pressed={sel}
            className={`border px-4 py-2 text-caption font-bold uppercase tracking-[1.5px] transition-colors ${
              sel
                ? 'border-ink bg-ink text-canvas'
                : 'border-hairline text-muted hover:border-hairbright hover:text-ink'
            }`}
          >
            {i.rotulo}
          </button>
        );
      })}
    </div>
  );
}
