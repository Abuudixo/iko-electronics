import { cn } from "@/lib/utils";

/**
 * Loading placeholder. The pulse is disabled under prefers-reduced-motion by
 * the global rule in index.css, so this stays a static block for those users.
 */
export default function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded bg-surface-container", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-surface-lowest">
      <Skeleton className="aspect-square rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-6 w-24" />
      </div>
    </div>
  );
}

/**
 * A grid of card skeletons. `label` is announced so screen-reader users learn
 * something is loading rather than hearing silence.
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
