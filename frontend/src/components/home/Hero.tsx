import { Link } from "react-router-dom";
import { ArrowRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";

const TRUST = [
  { Icon: Truck, label: "Free delivery over $50" },
  { Icon: ShieldCheck, label: "12-month warranty" },
  { Icon: PackageCheck, label: "Genuine stock only" },
];

/**
 * Hero.
 *
 * Structure follows current CRO guidance — headline, subheadline, ONE primary
 * action, then trust signals — rather than the mockup's two co-equal buttons.
 *
 * Set on navy and carried entirely by type: there is no product photography
 * yet, and a stock photo of someone else's hardware would misrepresent what IKO
 * sells.
 *
 * Contrast note: brand purple #683695 on navy #0E2043 is only 1.95:1 and is
 * unusable here. Everything accented uses inverse-primary #C9B3DD (8.4:1).
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-inverse-surface text-inverse-on-surface">
      {/* Ambient wash. Decorative only, and kept faint so type stays crisp. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-primary/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-(--container-page) px-4 py-20 md:px-8 md:py-28">
        <div className="flex max-w-3xl flex-col items-start">
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
            className="animate-rise mt-6 max-w-xl text-body-lg text-inverse-on-surface/80"
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
      </div>
    </section>
  );
}
