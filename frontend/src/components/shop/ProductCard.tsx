import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
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
    <article className="group relative flex flex-col overflow-hidden rounded-lg bg-surface-lowest shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-square bg-surface-low p-4">
        <ProductImage product={product} />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {isOnSale(product) && <Badge tone="sale">{off}% off</Badge>}
          {product.isNew && !isOnSale(product) && <Badge tone="new">New</Badge>}
          {soldOut && <Badge tone="error">Out of stock</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-label-sm uppercase text-on-surface-variant">{product.brand}</p>

        <h3 className="text-body-md font-semibold text-on-surface">
          {/*
            Stretched link: the whole card is clickable, but only the title is
            in the tab order and read as the link — so a screen reader announces
            the product name, not "link, link, link" for image, title and card.
          */}
          <Link to={`/product/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />

          {/*
            Sits above the stretched link so it stays independently clickable.
            Quick-add always adds one of the default option; anything with a
            real choice to make sends you to the product page instead.
          */}
          <button
            type="button"
            disabled={soldOut}
            onClick={() => add(product, product.options?.[0] ?? null, 1)}
            aria-label={soldOut ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
            className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-colors hover:bg-primary-hover disabled:bg-surface-container disabled:text-outline"
          >
            <ShoppingCart aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
