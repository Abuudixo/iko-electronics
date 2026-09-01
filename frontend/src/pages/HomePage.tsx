import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Laptop, Plug, Smartphone, Watch } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/types/catalog";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/shop/ProductCard";

const CATEGORY_ICONS = {
  smartphones: Smartphone,
  laptops: Laptop,
  audio: Headphones,
  wearables: Watch,
  accessories: Plug,
} as const;

const featured = PRODUCTS.filter((p) => p.compareAtPrice !== null || p.isNew).slice(0, 8);

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ---------- Categories ---------- */}
      <section className="mx-auto max-w-(--container-page) px-4 py-16 md:px-8 md:py-20">
        <h2 className="text-headline-lg-responsive">Shop by category</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map(({ slug, label }) => {
            const Icon = CATEGORY_ICONS[slug];
            const count = PRODUCTS.filter((p) => p.category === slug).length;
            return (
              <li key={slug}>
                <Link
                  to={`/shop?category=${slug}`}
                  className="group flex items-center gap-4 rounded-lg bg-surface-lowest p-5 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <Icon aria-hidden="true" strokeWidth={1.25} className="size-7 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="block truncate text-body-md font-semibold">{label}</span>
                    <span className="block text-label-sm text-on-surface-variant">
                      {count} {count === 1 ? "product" : "products"}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="mx-auto max-w-(--container-page) px-4 pb-20 md:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-headline-lg-responsive">New &amp; on offer</h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            View all
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
