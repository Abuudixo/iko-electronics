/**
 * Catalog types.
 *
 * These are shaped to match what the Express BFF will return once it is
 * adapting Odoo, so step 10 is a swap of the data source rather than a rewrite
 * of every component. Odoo field origins are noted per property.
 */

/** Money is always integer cents. Never a float — 0.1 + 0.2 !== 0.3. */
export type Money = number;

export const CATEGORIES = [
  { slug: "smartphones", label: "Smartphones" },
  { slug: "laptops", label: "Laptops" },
  { slug: "audio", label: "Audio" },
  { slug: "wearables", label: "Wearables" },
  { slug: "accessories", label: "Accessories" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export type ProductImage = {
  /** Empty until Odoo image_1920 is wired; the UI renders a placeholder. */
  url: string | null;
  alt: string;
};

/** A selectable option, e.g. a colour. Maps to Odoo product.attribute.value. */
export type VariantOption = {
  id: string;
  label: string;
  /** Swatch colour when the attribute is a colour; omitted otherwise. */
  hex?: string;
  inStock: boolean;
};

export type Spec = { label: string; value: string };

export type Product = {
  /** Odoo product.template id. */
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  /** Odoo default_code. */
  sku: string;
  /** Odoo description_sale. */
  description: string;
  highlights: string[];
  specs: Spec[];
  images: ProductImage[];
  /** Odoo list_price, converted to cents. */
  price: Money;
  /** Was-price for a discount. null when not on sale. */
  compareAtPrice: Money | null;
  /** Odoo qty_available. */
  stock: number;
  isNew: boolean;
  /** Label for the option group, e.g. "Colour". Absent if no variants. */
  optionLabel?: string;
  options?: VariantOption[];
};

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
];

/** A line in the cart. Quantity lives here; price is snapshotted at add time. */
export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  optionLabel: string | null;
  optionName: string | null;
  unitPrice: Money;
  quantity: number;
  stock: number;
};

export function isOnSale(p: Product): boolean {
  return p.compareAtPrice !== null && p.compareAtPrice > p.price;
}

export function discountPercent(p: Product): number | null {
  if (p.compareAtPrice === null || p.compareAtPrice <= p.price) return null;
  return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
}
