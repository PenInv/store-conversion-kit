'use client';

import { useMemo, useState } from 'react';
import type { Category, LiquidScript } from '@/types/script';
import CategoryFilters from './CategoryFilters';
import ScriptCard from './ScriptCard';
import ScriptModal from './ScriptModal';
import SearchBar from './SearchBar';

export default function LibraryClient({
  scripts,
  categorias,
}: {
  scripts: LiquidScript[];
  categorias: Category[];
}) {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState<Category | 'all'>('all');
  const [aberto, setAberto] = useState<LiquidScript | null>(null);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return scripts.filter((s) => {
      if (categoria !== 'all' && s.category !== categoria) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [scripts, busca, categoria]);

  // Numeracao por categoria (#01, #02...), como no layout original.
  const indices = useMemo(() => {
    const contador: Partial<Record<Category, number>> = {};
    const mapa: Record<string, number> = {};
    for (const s of scripts) {
      contador[s.category] = (contador[s.category] ?? 0) + 1;
      mapa[s.slug] = contador[s.category]!;
    }
    return mapa;
  }, [scripts]);

  return (
    <>
      <div className="mb-8 flex items-center gap-4">
        <div className="m-stripe h-[3px] w-14" />
        <span className="text-caption uppercase tracking-[1.5px] text-muted">02 — Biblioteca</span>
      </div>

      <div className="max-w-2xl">
        <SearchBar valor={busca} onChange={setBusca} />
      </div>

      <div className="mt-6">
        <CategoryFilters categorias={categorias} ativa={categoria} onChange={setCategoria} />
      </div>

      <p className="mt-8 border-t border-hairline pt-6 text-caption uppercase tracking-[1.5px] text-muted">
        {filtrados.length} {filtrados.length === 1 ? 'script encontrado' : 'scripts encontrados'}
      </p>

      {filtrados.length === 0 ? (
        <p className="py-24 text-center text-body-sm text-muted">
          Nenhum script para “{busca}”.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((s) => (
            <ScriptCard
              key={s.slug}
              script={s}
              indice={indices[s.slug]}
              onAbrir={() => setAberto(s)}
            />
          ))}
        </div>
      )}

      <ScriptModal script={aberto} onFechar={() => setAberto(null)} />
    </>
  );
}
