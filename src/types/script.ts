export type Category =
  | 'social-proof'
  | 'urgency'
  | 'payment'
  | 'size'
  | 'product'
  | 'offer'
  | 'shipping'
  | 'banner';

export interface LiquidScript {
  slug: string;
  title: string;
  shortDescription: string;
  category: Category;
  tags: string[];
  compatibilityNotes?: string;
  /** Conteudo do arquivo liquids/<slug>.liquid, injetado no build. */
  code: string;
  /** Preview em /public/previews/<slug>.png, quando existir. */
  preview?: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  'social-proof': 'Social Proof',
  urgency: 'Urgency',
  payment: 'Payment',
  size: 'Size',
  product: 'Product',
  offer: 'Offer',
  shipping: 'Shipping',
  banner: 'Banner',
};
