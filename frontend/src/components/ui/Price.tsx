import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Money } from "@/types/catalog";

/**
 * A strikethrough is a purely visual convention — a screen reader reads
 * "$249.99 $199.99" with no indication which one you pay. The sr-only labels
 * disambiguate, and the visible <s> is hidden from the accessibility tree.
 */
export default function Price({
  price,
  compareAtPrice,
  size = "md",
  className,
}: {
  price: Money;
  compareAtPrice?: Money | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discounted = compareAtPrice != null && compareAtPrice > price;

  const sizes = {
    sm: { now: "text-body-md font-semibold", was: "text-label-sm" },
    md: { now: "text-headline-md", was: "text-body-md" },
    lg: { now: "text-display-lg", was: "text-headline-md" },
  }[size];

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2.5 gap-y-1", className)}>
      {discounted && <span className="sr-only">Now</span>}
      <span className={cn(sizes.now, "tabular-nums text-on-surface")}>{formatPrice(price)}</span>

      {discounted && (
        <>
          <span className="sr-only">, was {formatPrice(compareAtPrice)}</span>
          <s aria-hidden="true" className={cn(sizes.was, "tabular-nums text-on-surface-variant")}>
            {formatPrice(compareAtPrice)}
          </s>
        </>
      )}
    </p>
  );
}
