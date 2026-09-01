import { PRODUCTS } from "@/data/products";
import { discountPercent, isOnSale } from "@/types/catalog";
import ProductCard from "@/components/shop/ProductCard";
import Button from "@/components/ui/Button";

/** Biggest discount first — on a deals page that is the only sensible order. */
const deals = PRODUCTS.filter(isOnSale).sort(
  (a, b) => (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0),
);

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-10 md:px-8">
      <h1 className="text-headline-lg-responsive">Deals</h1>
      <p className="mt-2 max-w-prose text-body-lg text-on-surface-variant">
        Everything currently reduced, biggest saving first.
      </p>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <h2 className="text-headline-md">No deals running right now</h2>
          <p className="max-w-prose text-body-md text-on-surface-variant">
            Check back soon, or browse the full range.
          </p>
          <Button to="/shop">Shop all products</Button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {deals.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
