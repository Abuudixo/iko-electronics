import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ChevronRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { findProductBySlug, PRODUCTS } from "@/data/products";
import { CATEGORIES, discountPercent, isOnSale, type VariantOption } from "@/types/catalog";
import { useCart } from "@/context/CartContext";
import Badge, { StockBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Price from "@/components/ui/Price";
import ProductImage from "@/components/ui/ProductImage";
import QuantityStepper from "@/components/ui/QuantityStepper";
import ProductCard from "@/components/shop/ProductCard";
import NotFoundPage from "./NotFoundPage";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? findProductBySlug(slug) : undefined;
  const { add } = useCart();

  const [option, setOption] = useState<VariantOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return <NotFoundPage />;

  const soldOut = product.stock <= 0;
  const chosen = option ?? product.options?.find((o) => o.inStock) ?? null;
  const optionUnavailable = chosen !== null && !chosen.inStock;
  const categoryLabel = CATEGORIES.find((c) => c.slug === product.category)?.label ?? "Shop";

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  function handleAdd() {
    if (!product || soldOut || optionUnavailable) return;
    add(product, chosen, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-6 md:px-8 md:py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-label-sm text-on-surface-variant">
          <li><Link to="/shop" className="hover:text-primary hover:underline">Shop</Link></li>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <li>
            <Link to={`/shop?category=${product.category}`} className="hover:text-primary hover:underline">
              {categoryLabel}
            </Link>
          </li>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <li><span aria-current="page" className="text-on-surface">{product.name}</span></li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative overflow-hidden rounded-lg bg-surface-low p-8">
          <div className="aspect-square">
            <ProductImage product={product} iconClassName="size-24" />
          </div>
          {isOnSale(product) && (
            <div className="absolute left-4 top-4">
              <Badge tone="sale">Save {discountPercent(product)}%</Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-5">
          <div>
            <p className="text-label-md uppercase text-on-surface-variant">{product.brand}</p>
            <h1 className="mt-1.5 text-headline-lg-responsive">{product.name}</h1>
          </div>

          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="md" />

          <StockBadge stock={product.stock} />

          <p className="max-w-prose text-body-md text-on-surface-variant">{product.description}</p>

          <ul className="flex flex-wrap gap-2">
            {product.highlights.map((h) => (
              <li key={h} className="rounded-full border border-outline-variant px-3 py-1.5 text-label-sm">
                {h}
              </li>
            ))}
          </ul>

          {product.options && product.optionLabel && (
            <fieldset className="w-full">
              <legend className="mb-2.5 text-body-md">
                <span className="font-semibold">{product.optionLabel}:</span>{" "}
                <span className="text-on-surface-variant">{chosen?.label}</span>
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {product.options.map((o) => {
                  const selected = chosen?.id === o.id;
                  return (
                    <label
                      key={o.id}
                      className={[
                        "cursor-pointer rounded border px-4 py-2.5 text-body-md transition-colors",
                        selected ? "border-primary bg-primary-container text-on-primary-container" : "border-outline-variant hover:border-outline",
                        !o.inStock && "cursor-not-allowed text-outline line-through",
                      ].filter(Boolean).join(" ")}
                    >
                      <input
                        type="radio"
                        name="option"
                        className="sr-only"
                        checked={selected}
                        disabled={!o.inStock}
                        onChange={() => setOption(o)}
                      />
                      <span className="flex items-center gap-2">
                        {o.hex && (
                          <span
                            aria-hidden="true"
                            style={{ backgroundColor: o.hex }}
                            className="size-4 rounded-full border border-outline-variant"
                          />
                        )}
                        {o.label}
                        {!o.inStock && <span className="sr-only"> (unavailable)</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {!soldOut && (
            <div className="flex flex-wrap items-center gap-3">
              <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} />
              <Button onClick={handleAdd} disabled={optionUnavailable}>
                Add to cart
              </Button>
              <Button to="/checkout" variant="secondary">
                Checkout
              </Button>
            </div>
          )}

          {soldOut && (
            <Button disabled fullWidth>
              Out of stock
            </Button>
          )}

          {/* Confirmation is announced, not just shown — role="status" is polite. */}
          <p role="status" className="min-h-6 text-body-md text-success">
            {added && (
              <span className="inline-flex items-center gap-1.5">
                <Check aria-hidden="true" className="size-4" />
                Added to your cart
              </span>
            )}
          </p>

          <ul className="grid w-full gap-4 rounded-lg border border-outline-variant p-5 sm:grid-cols-2">
            {[
              { Icon: Truck, title: "Free delivery", body: "On orders over $50" },
              { Icon: ShieldCheck, title: "Warranty included", body: product.specs.find((s) => s.label === "Warranty")?.value ?? "12 months" },
              { Icon: RotateCcw, title: "7-day returns", body: "Unopened, in original packaging" },
            ].map(({ Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-label-md">{title}</p>
                  <p className="text-label-sm text-on-surface-variant">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-headline-md">Specifications</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-outline-variant">
          <dl className="divide-y divide-outline-variant">
            {product.specs.map((s) => (
              <div key={s.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-3">
                <dt className="text-body-md text-on-surface-variant">{s.label}</dt>
                <dd className="text-body-md sm:col-span-2">{s.value}</dd>
              </div>
            ))}
            <div className="grid gap-1 px-5 py-3.5 sm:grid-cols-3">
              <dt className="text-body-md text-on-surface-variant">SKU</dt>
              <dd className="text-body-md sm:col-span-2">{product.sku}</dd>
            </div>
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-headline-md">You might also like</h2>
          <ul className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
