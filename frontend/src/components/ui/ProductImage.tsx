import { Headphones, Laptop, Plug, Smartphone, Watch } from "lucide-react";
import type { CategorySlug, Product } from "@/types/catalog";
import { cn } from "@/lib/utils";

const ICONS: Record<CategorySlug, typeof Smartphone> = {
  smartphones: Smartphone,
  laptops: Laptop,
  audio: Headphones,
  wearables: Watch,
  accessories: Plug,
};

/**
 * Product imagery.
 *
 * No stock photos are invented for this build. Until Odoo's image_1920 field is
 * wired up in step 10, this renders a deliberate placeholder — a category icon
 * on a tinted panel — rather than a broken image or a misleading photo of some
 * other company's product.
 *
 * The placeholder is aria-hidden: the product name is always adjacent in the
 * card or page heading, so announcing "placeholder image" adds nothing.
 */
export default function ProductImage({
  product,
  className,
  iconClassName,
}: {
  product: Product;
  className?: string;
  iconClassName?: string;
}) {
  const first = product.images[0];
  const Icon = ICONS[product.category];

  if (first?.url) {
    return (
      <img
        src={first.url}
        alt={first.alt}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-contain", className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid h-full w-full place-items-center bg-surface-low",
        className,
      )}
    >
      <Icon
        strokeWidth={1.25}
        className={cn("size-12 text-outline-variant", iconClassName)}
      />
    </div>
  );
}
