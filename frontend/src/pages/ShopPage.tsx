import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { BRANDS, PRODUCTS } from "@/data/products";
import { CATEGORIES, SORT_OPTIONS, type Product, type SortKey } from "@/types/catalog";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/shop/ProductCard";
import Button from "@/components/ui/Button";

const PER_PAGE = 12;
const PRICE_STEPS = [0, 5000, 15000, 50000, 150000] as const;

function sortProducts(list: Product[], key: SortKey): Product[] {
  const copy = [...list];
  switch (key) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    default:
      // "Featured" puts discounted and new items first, then in-stock items.
      return copy.sort(
        (a, b) =>
          Number(b.compareAtPrice !== null) - Number(a.compareAtPrice !== null) ||
          Number(b.isNew) - Number(a.isNew) ||
          Number(b.stock > 0) - Number(a.stock > 0),
      );
  }
}

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const query = params.get("q")?.trim().toLowerCase() ?? "";
  const category = params.get("category") ?? "";
  const brands = params.getAll("brand");
  const maxPrice = Number(params.get("maxPrice") ?? 0);
  const inStockOnly = params.get("inStock") === "1";
  const sort = (params.get("sort") as SortKey | null) ?? "featured";
  const page = Math.max(1, Number(params.get("page") ?? 1));

  /** Filter params reset pagination — page 4 of a new filter is usually empty. */
  function update(mutate: (next: URLSearchParams) => void, resetPage = true) {
    const next = new URLSearchParams(params);
    mutate(next);
    if (resetPage) next.delete("page");
    setParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      if (category && p.category !== category) return false;
      if (brands.length > 0 && !brands.includes(p.brand)) return false;
      if (maxPrice > 0 && p.price > maxPrice) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (query) {
        const haystack = `${p.name} ${p.brand} ${p.description} ${p.sku}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
    return sortProducts(list, sort);
  }, [category, brands.join(","), maxPrice, inStockOnly, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const activeCount =
    (category ? 1 : 0) + brands.length + (maxPrice > 0 ? 1 : 0) + (inStockOnly ? 1 : 0);

  // Mobile drawer: same accessibility contract as the nav drawer.
  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFiltersOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      filterButtonRef.current?.focus();
    };
  }, [filtersOpen]);

  const filterPanel = (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="mb-3 text-label-md uppercase text-on-surface-variant">Category</legend>
        <div className="flex flex-col gap-1">
          {[{ slug: "", label: "All categories" }, ...CATEGORIES].map(({ slug, label }) => (
            <label key={slug || "all"} className="flex cursor-pointer items-center gap-3 py-1.5">
              <input
                type="radio"
                name="category"
                checked={category === slug}
                onChange={() => update((n) => (slug ? n.set("category", slug) : n.delete("category")))}
                className="size-4 accent-[var(--color-primary)]"
              />
              <span className="text-body-md">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-label-md uppercase text-on-surface-variant">Brand</legend>
        <div className="flex flex-col gap-1">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-3 py-1.5">
              <input
                type="checkbox"
                checked={brands.includes(brand)}
                onChange={(e) =>
                  update((n) => {
                    const kept = brands.filter((b) => b !== brand);
                    n.delete("brand");
                    (e.target.checked ? [...kept, brand] : kept).forEach((b) => n.append("brand", b));
                  })
                }
                className="size-4 rounded-sm accent-[var(--color-primary)]"
              />
              <span className="text-body-md">{brand}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-label-md uppercase text-on-surface-variant">Max price</legend>
        <div className="flex flex-col gap-1">
          {PRICE_STEPS.map((cents) => (
            <label key={cents} className="flex cursor-pointer items-center gap-3 py-1.5">
              <input
                type="radio"
                name="maxPrice"
                checked={maxPrice === cents}
                onChange={() => update((n) => (cents ? n.set("maxPrice", String(cents)) : n.delete("maxPrice")))}
                className="size-4 accent-[var(--color-primary)]"
              />
              <span className="text-body-md">{cents === 0 ? "Any price" : `Under ${formatPrice(cents)}`}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => update((n) => (e.target.checked ? n.set("inStock", "1") : n.delete("inStock")))}
          className="size-4 rounded-sm accent-[var(--color-primary)]"
        />
        <span className="text-body-md">In stock only</span>
      </label>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => setParams(query ? new URLSearchParams({ q: query }) : new URLSearchParams())}
          className="h-11 cursor-pointer rounded bg-primary px-5 text-label-md font-semibold text-white shadow-none hover:bg-primary-hover"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container px-4 py-8 md:px-8 lg:py-10">
      <h1 className="text-headline-lg-responsive">
        {query ? `Results for “${query}”` : category
          ? CATEGORIES.find((c) => c.slug === category)?.label ?? "Shop"
          : "All products"}
      </h1>

      <div className="mt-7 flex gap-8 xl:gap-10">
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-5">
            <h2 className="mb-6 text-headline-md">Category</h2>
          {filterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
            {/*
              aria-live so filtering announces the new result count. Without it a
              screen-reader user ticks a checkbox and hears nothing at all.
            */}
            <p aria-live="polite" className="text-body-md text-on-surface-variant">
              {filtered.length === 0
                ? "No products found"
                : `Showing ${(safePage - 1) * PER_PAGE + 1}–${Math.min(safePage * PER_PAGE, filtered.length)} of ${filtered.length} products`}
            </p>

            <div className="flex items-center gap-3">
              <button
                ref={filterButtonRef}
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded bg-primary px-4 text-label-md font-semibold text-white shadow-none hover:bg-primary-hover md:hidden"
              >
                <SlidersHorizontal aria-hidden="true" className="size-4" />
                Filters
                {activeCount > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-label-sm text-on-primary">
                    {activeCount}
                  </span>
                )}
              </button>

              <label className="flex items-center gap-2">
                <span className="text-body-md text-on-surface-variant">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => update((n) => n.set("sort", e.target.value))}
                  className="h-11 cursor-pointer rounded border border-outline-variant bg-surface-lowest px-3 text-body-md focus:border-primary focus:outline-none"
                >
                  {SORT_OPTIONS.map(({ key, label }) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <h2 className="text-headline-md">Nothing matches those filters</h2>
              <p className="max-w-prose text-body-md text-on-surface-variant">
                Try removing a filter, or widening the price range.
              </p>
              <Button variant="secondary" onClick={() => setParams(new URLSearchParams())}>
                Clear filters
              </Button>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-14 flex flex-col items-center gap-4 border-t border-outline-variant pt-6 sm:flex-row sm:justify-between">
              <p className="text-label-sm text-on-surface-variant">
                Page <strong className="font-bold text-on-surface">{safePage}</strong> of {totalPages}
              </p>

              <div className="flex items-center gap-1 rounded-xl border border-outline-variant bg-surface-lowest p-1">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={safePage === 1}
                  onClick={() => update((next) => next.set("page", String(safePage - 1)), false)}
                  className="grid size-10 cursor-pointer place-items-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-outline"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`Go to page ${n}`}
                      aria-current={n === safePage ? "page" : undefined}
                      onClick={() => update((next) => next.set("page", String(n)), false)}
                      className={
                        n === safePage
                          ? "grid size-10 cursor-pointer place-items-center rounded-lg bg-primary text-label-md font-semibold !text-white"
                          : "grid size-10 cursor-pointer place-items-center rounded-lg bg-primary text-label-md font-semibold text-white transition-colors hover:bg-primary-hover"
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={safePage === totalPages}
                  onClick={() => update((next) => next.set("page", String(safePage + 1)), false)}
                  className="grid size-10 cursor-pointer place-items-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-outline"
                >
                  <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>

      {/* ---------- Mobile filter drawer ---------- */}
      {filtersOpen && (
        <div className="md:hidden">
          <div
            aria-hidden="true"
            onClick={() => setFiltersOpen(false)}
            className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-surface-lowest"
          >
            <div className="flex h-16 items-center justify-between border-b border-outline-variant px-4">
              <h2 className="text-headline-md">Filters</h2>
              <button
                type="button"
                autoFocus
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="grid size-11 place-items-center rounded-full hover:bg-surface-container"
              >
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterPanel}</div>
            <div className="border-t border-outline-variant p-4">
              <Button fullWidth onClick={() => setFiltersOpen(false)}>
                Show {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
