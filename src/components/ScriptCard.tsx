'use client';

import { CATEGORY_LABELS, type LiquidScript } from '@/types/script';
import CopyButton from './CopyButton';
import LivePreview from './LivePreview';

export default function ScriptCard({
  script,
  indice,
  onAbrir,
}: {
  script: LiquidScript;
  indice: number;
  onAbrir: () => void;
}) {
  return (
    <article className="group flex flex-col border border-hairline bg-surface transition-colors hover:border-hairbright">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2">
        <span className="text-caption uppercase tracking-[1.5px] text-muted">
          {script.preview ? 'Screenshot' : 'Live Preview'}
        </span>
        {script.preview && (
          <span
            className="text-caption uppercase tracking-[1.5px] text-muted"
            title="Este script busca dados da loja via API e so renderiza dentro do Shopify"
          >
            requer loja
          </span>
        )}
      </div>

      <LivePreview code={script.code} preview={script.preview} />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-caption font-bold uppercase tracking-[1.5px] text-m-blue">
            {CATEGORY_LABELS[script.category]}
          </span>
          <span className="text-caption text-muted">
            #{String(indice).padStart(2, '0')}
          </span>
        </div>

        <h3 className="text-title-lg">{script.title}</h3>
        <p className="mt-2 text-body-sm text-muted">{script.shortDescription}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {script.tags.slice(0, 3).map((t) => (
            <li
              key={t}
              className="border border-hairline px-2 py-1 font-mono text-[11px] text-muted"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
          <button
            type="button"
            onClick={onAbrir}
            className="text-caption font-bold uppercase tracking-[1.5px] transition-colors hover:text-m-blue"
          >
            Ver detalhes
          </button>
          <CopyButton code={script.code} />
        </div>
      </div>
    </article>
  );
}
