'use client';

import { useEffect, useState } from 'react';

export default function CopyButton({
  code,
  className = '',
}: {
  code: string;
  className?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(false), 2000);
    return () => clearTimeout(t);
  }, [copiado]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(code);
      setCopiado(true);
    } catch {
      // Fallback para navegadores sem permissao de clipboard.
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiado(true);
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className={`text-caption font-bold uppercase tracking-[1.5px] transition-colors ${
        copiado ? 'text-m-blue' : 'hover:text-m-blue'
      } ${className}`}
    >
      {copiado ? 'Copiado ✓' : 'Copiar'}
    </button>
  );
}
