import { Link } from "react-router-dom";
import { ArrowRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { discountPercent, isOnSale } from "@/types/catalog";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";

/**
 * The hero features the biggest **absolute** saving, not the biggest
 * percentage. A cable at 32% off is only $6 saved — technically the steepest
 * discount, but a weak thing to lead the shop with. Money off is what actually
 * reads as a deal.
 */
const saving = (p: { price: number; compareAtPrice: number | null }) =>
  (p.compareAtPrice ?? p.price) - p.price;

const featured = [...PRODUCTS].filter(isOnSale).sort((a, b) => saving(b) - saving(a))[0];

const TRUST = [
  { Icon: Truck, label: "Free delivery over $50" },
  { Icon: ShieldCheck, label: "12-month warranty" },
  { Icon: PackageCheck, label: "Genuine stock only" },
];

/**
 * Hero.
 *
 * Follows the structure current CRO guidance converges on — headline,
 * subheadline, visual, ONE primary action, then trust signals — rather than the
 * mockup's two co-equal buttons.
 *
 * Set on navy because we have no product photography. Prevailing 2026 advice
 * leans on lifestyle imagery and near-silent video; with neither available, the
 * weight has to come from type and colour instead of a stock photo that would
 * misrepresent what IKO actually sells.
 *
 * Contrast note: brand purple #683695 on navy #0E2043 is only 1.95:1, so it is
 * unusable here. Everything accented uses inverse-primary #C9B3DD (8.4:1).
 */
export default function Hero() {
  const off = featured ? discountPercent(featured) : null;

  return (
    <section className="relative overflow-hidden bg-inverse-surface text-inverse-on-surface">
      {/* Ambient wash. Decorative only, and kept faint so type stays crisp. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-primary/25 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-(--container-page) items-center gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex flex-col items-start">
          <p className="animate-rise text-label-md uppercase text-inverse-primary">
            IKO Electronics
          </p>

          {/* Oversized and tightly tracked — the type is the hero. */}
          <h1
            className="animate-rise mt-4 text-[2.75rem] font-bold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "60ms" }}
          >
            Technology,
            <br />
            <span className="text-inverse-primary">honestly priced.</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-lg text-body-lg text-inverse-on-surface/80"
            style={{ animationDelay: "120ms" }}
          >
            Phones, laptops and audio chosen because they last &mdash; not because they carry the
            biggest margin. Delivered across the city, same day.
          </p>

          {/* One primary action; the secondary is deliberately quieter. */}
          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              to="/shop"
              className="inline-flex h-14 items-center gap-2 rounded bg-inverse-primary px-8 text-label-md text-inverse-surface transition-colors hover:bg-inverse-primary-hover"
            >
              Shop all products
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              to="/deals"
              className="text-body-md font-semibold text-inverse-on-surface/80 underline-offset-4 transition-colors hover:text-inverse-on-surface hover:underline"
            >
              See this week&rsquo;s deals
            </Link>
          </div>

          {/* Trust signals sit with the CTA, above the fold, not buried below. */}
          <ul
            className="animate-rise mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-inverse-on-surface/75"
            style={{ animationDelay: "240ms" }}
          >
            {TRUST.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-4 text-inverse-primary" />
                <span className="text-label-sm">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* One product, concretely shoppable — not a decorative collage. */}
        {featured && (
          <div className="animate-rise lg:justify-self-end" style={{ animationDelay: "300ms" }}>
            <Link
              to={`/product/${featured.slug}`}
              className="group block w-full max-w-md rounded-xl bg-surface-lowest p-6 text-on-surface shadow-card-hover transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-label-md uppercase text-on-surface-variant">
                  Deal of the week
                </span>
                {off !== null && (
                  <span className="rounded-full bg-sale px-3 py-1 text-label-sm font-semibold text-on-sale">
                    Save {off}%
                  </span>
                )}
              </div>

              <div className="mt-5 aspect-[4/3] rounded-lg bg-surface-low p-6">
                <ProductImage product={featured} iconClassName="size-20" />
              </div>

              <p className="mt-5 text-label-sm uppercase text-on-surface-variant">{featured.brand}</p>
              <h2 className="mt-1 text-headline-md">{featured.name}</h2>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
                <span className="text-headline-md tabular-nums text-primary">
                  {formatPrice(featured.price)}
                </span>
                {featured.compareAtPrice !== null && (
                  <>
                    <span className="sr-only">, was {formatPrice(featured.compareAtPrice)}</span>
                    <s aria-hidden="true" className="text-body-md tabular-nums text-on-surface-variant">
                      {formatPrice(featured.compareAtPrice)}
                    </s>
                  </>
                )}
              </div>

              <span className="mt-4 inline-flex items-center gap-1.5 text-body-md font-semibold text-primary group-hover:underline">
                View product
                <ArrowRight aria-hidden="true" className="size-4" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
