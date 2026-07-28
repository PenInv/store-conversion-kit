export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-baseline gap-3">
          <span className="text-label font-bold uppercase tracking-[1.5px]">
            Store Conversion Kit
          </span>
          <span className="hidden text-caption uppercase text-muted sm:inline">
            · Custom Liquid Library
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <span className="hidden text-caption uppercase tracking-[1.5px] text-muted md:inline">
            Shopify · Premium Scripts
          </span>
          <a
            href="https://shopify.dev/docs/api/liquid"
            target="_blank"
            rel="noreferrer"
            className="text-caption font-bold uppercase tracking-[1.5px] transition-colors hover:text-m-blue"
          >
            Docs →
          </a>
        </nav>
      </div>
    </header>
  );
}
