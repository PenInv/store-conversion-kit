'use client';

import { useEffect, useRef, useState } from 'react';
import { liquidParaHtml } from '@/lib/liquid-preview';

/**
 * Renderiza o snippet num iframe isolado (srcdoc + sandbox), para o CSS/JS
 * do script nao vazar para o site. So monta quando entra na viewport.
 */
export default function LivePreview({
  code,
  altura = 280,
  preview,
}: {
  code: string;
  altura?: number;
  preview?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visivel) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visivel]);

  const doc = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;padding:12px;background:#fff;font-family:Inter,system-ui,sans-serif}</style>
</head><body>${liquidParaHtml(code)}</body></html>`;

  // Scripts que dependem de API da loja (Storefront/cart) nao renderizam fora
  // do Shopify: nesses casos mostramos um screenshot do widget em producao.
  if (preview) {
    return (
      <div
        className="overflow-hidden border-b border-hairline bg-white"
        style={{ height: altura }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Screenshot do script em funcionamento na loja"
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div ref={ref} className="border-b border-hairline bg-white" style={{ height: altura }}>
      {visivel && (
        <iframe
          srcDoc={doc}
          title="Preview do script"
          loading="lazy"
          sandbox="allow-scripts"
          className="h-full w-full"
        />
      )}
    </div>
  );
}
