import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LibraryClient from '@/components/LibraryClient';
import { getCategories, getScripts } from '@/data/scripts';

export default function HomePage() {
  const scripts = getScripts();
  const categorias = getCategories();

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <Hero total={scripts.length} />
      <main className="mx-auto max-w-content px-6 pb-32 pt-20 sm:px-10">
        <LibraryClient scripts={scripts} categorias={categorias} />
      </main>
      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-6 py-10 text-caption uppercase tracking-[1.5px] text-muted sm:px-10">
          <span>Store Conversion Kit · Custom Liquid Library</span>
          <span>{scripts.length} scripts · Shopify Liquid</span>
        </div>
      </footer>
    </div>
  );
}
