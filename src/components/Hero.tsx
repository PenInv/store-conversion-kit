const STATS = [
  { valor: (n: number) => String(n), rotulo: 'Scripts' },
  { valor: () => 'Shopify', rotulo: 'Plataforma' },
  { valor: () => 'Liquid', rotulo: 'Sintaxe' },
  { valor: () => 'R$ 0', rotulo: 'Custo' },
];

export default function Hero({ total }: { total: number }) {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto max-w-content px-6 pb-24 pt-20 sm:px-10 sm:pt-28">
        <div className="mb-10 flex items-start gap-6">
          <div className="m-stripe h-[3px] w-full max-w-[720px]" />
          <span className="hidden shrink-0 pt-1 text-caption uppercase tracking-[1.5px] text-muted lg:block">
            01 — Custom Liquid Library
          </span>
        </div>

        <h1 className="text-display-lg uppercase">
          Scripts que
          <br />
          <span className="text-m-red">convertem</span> sua loja.
        </h1>

        <p className="mt-8 max-w-xl text-body-sm text-muted">
          Biblioteca premium de Custom Liquid Scripts para Shopify. Copie, cole e converta. Sem
          plugin. Sem complicação.
        </p>

        <dl className="mt-14 flex flex-wrap gap-x-16 gap-y-8">
          {STATS.map((s) => (
            <div key={s.rotulo}>
              <dt className="text-display-sm">{s.valor(total)}</dt>
              <dd className="mt-1 text-caption uppercase tracking-[1.5px] text-muted">
                {s.rotulo}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
