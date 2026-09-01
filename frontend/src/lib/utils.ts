import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes so later ones win instead of colliding.
 * cn("px-4", cond && "px-6") -> "px-6"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Prices are handled in whole cents everywhere to avoid float drift
 * (0.1 + 0.2 !== 0.3). Only format at the render boundary.
 */
export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}
