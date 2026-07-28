import fs from 'node:fs';
import path from 'node:path';
import { SCRIPT_REGISTRY } from './registry';
import type { Category, LiquidScript } from '@/types/script';

const LIQUIDS_DIR = path.join(process.cwd(), 'liquids');
const PREVIEWS_DIR = path.join(process.cwd(), 'public', 'previews');

/**
 * Le os .liquid do disco e monta a lista final.
 * Roda so no servidor (build time) — a home e um Server Component.
 */
export function getScripts(): LiquidScript[] {
  return SCRIPT_REGISTRY.map((meta) => {
    const file = path.join(LIQUIDS_DIR, `${meta.slug}.liquid`);
    if (!fs.existsSync(file)) {
      throw new Error(
        `Script "${meta.slug}" esta no registry mas falta liquids/${meta.slug}.liquid`
      );
    }
    const preview = fs.existsSync(path.join(PREVIEWS_DIR, `${meta.slug}.png`))
      ? `/previews/${meta.slug}.png`
      : undefined;

    return { ...meta, code: fs.readFileSync(file, 'utf8'), preview };
  });
}

/** Categorias presentes, na ordem em que aparecem no registry. */
export function getCategories(): Category[] {
  const vistas: Category[] = [];
  for (const s of SCRIPT_REGISTRY) {
    if (!vistas.includes(s.category)) vistas.push(s.category);
  }
  return vistas;
}
