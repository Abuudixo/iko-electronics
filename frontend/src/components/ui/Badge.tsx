import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "sale" | "new" | "success" | "error" | "neutral";

const TONES: Record<Tone, string> = {
  sale: "bg-sale text-on-sale",
  new: "bg-primary text-on-primary",
  success: "bg-success-container text-on-success-container",
  error: "bg-error-container text-on-error-container",
  neutral: "bg-surface-container text-on-surface-variant",
};

export default function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-label-sm font-semibold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Stock state as text, not just colour.
 *
 * Colour alone fails for colour-blind users and is invisible to screen readers,
 * so each state carries a word. Low stock is deliberately specific ("Only 3
 * left") because vagueness here reads as a pressure tactic.
 */
export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge tone="error">Out of stock</Badge>;
  if (stock <= 5) return <Badge tone="sale">Only {stock} left</Badge>;
  return <Badge tone="success">In stock</Badge>;
}
