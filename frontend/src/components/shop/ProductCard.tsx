import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/catalog";
import { discountPercent, isOnSale } from "@/types/catalog";
import { useCart } from "@/context/CartContext";
import Badge from "@/components/ui/Badge";
import Price from "@/components/ui/Price";
import ProductImage from "@/components/ui/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const soldOut = product.stock <= 0;
  const off = discountPercent(product);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/80 bg-surface-lowest shadow-[0_8px_22px_rgba(17,24,39,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(17,24,39,0.08)]">
      <div className="relative aspect-[1.08] overflow-hidden bg-[#edf3ff] p-2.5 sm:aspect-square sm:p-4">
        <ProductImage product={product} className="rounded-[0.8rem]" />

        <button
          type="button"
          aria-label={`Add ${product.name} to favourites`}
          className="relative z-10 absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-surface-lowest text-primary shadow-sm transition-colors hover:bg-primary-container"
        >
          <Heart aria-hidden="true" className="size-5" />
        </button>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {isOnSale(product) && <Badge tone="sale">{off}% off</Badge>}
          {product.isNew && !isOnSale(product) && <Badge tone="new">New</Badge>}
          {soldOut && <Badge tone="error">Out of stock</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 pt-3 sm:gap-2 sm:p-4 sm:pt-4">
        <p className="text-label-sm uppercase text-on-surface-variant">{product.brand}</p>

        <h3 className="text-body-md font-semibold text-on-surface">
          <Link to={`/product/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex flex-col items-stretch gap-3 pt-2">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />

          <button
            type="button"
            disabled={soldOut}
            onClick={() => add(product, product.options?.[0] ?? null, 1)}
            aria-label={soldOut ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
            className="relative z-10 inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-primary px-3 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:bg-surface-container disabled:text-outline"
          >
            <ShoppingCart aria-hidden="true" className="size-4" />
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
