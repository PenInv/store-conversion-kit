'use client';

import { useEffect } from 'react';
import { CATEGORY_LABELS, type LiquidScript } from '@/types/script';
import CopyButton from './CopyButton';
import LivePreview from './LivePreview';

export default function ScriptModal({
  script,
  onFechar,
}: {
  script: LiquidScript | null;
  onFechar: () => void;
}) {
  useEffect(() => {
    if (!script) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
    };
    document.addEventListener('keydown', onKey);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowAnterior;
    };
  }, [script, onFechar]);

  if (!script) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={script.title}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8"
      onClick={onFechar}
    >
      <div
        className="mx-auto max-w-4xl border border-hairbright bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="m-stripe h-[3px]" />

        <header className="flex items-start justify-between gap-6 border-b border-hairline p-6">
          <div>
            <span className="text-caption font-bold uppercase tracking-[1.5px] text-m-blue">
              {CATEGORY_LABELS[script.category]}
            </span>
            <h2 className="mt-2 text-title-lg">{script.title}</h2>
            <p className="mt-1 text-body-sm text-muted">{script.shortDescription}</p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="shrink-0 border border-hairline px-3 py-1 text-caption transition-colors hover:border-hairbright"
          >
            ESC ✕
          </button>
        </header>

        <LivePreview code={script.code} altura={360} preview={script.preview} />

        {script.compatibilityNotes && (
          <div className="border-b border-hairline bg-elevated p-6">
            <h3 className="text-caption font-bold uppercase tracking-[1.5px] text-muted">
              Como usar
            </h3>
            <p className="mt-2 text-body-sm text-muted">{script.compatibilityNotes}</p>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-hairline px-6 py-3">
          <span className="font-mono text-[11px] text-muted">{script.slug}.liquid</span>
          <CopyButton code={script.code} />
        </div>

        <pre className="max-h-[50vh] overflow-auto bg-[#0d0d0d] p-6 font-mono text-[13px] leading-relaxed text-muted">
          <code>{script.code}</code>
        </pre>
      </div>
    </div>
  );
}
