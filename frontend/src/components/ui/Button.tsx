import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed disabled:bg-outline",
  secondary:
    "border border-on-surface text-on-surface hover:bg-surface-container active:bg-surface-high disabled:border-outline-variant disabled:text-outline",
  ghost:
    "text-on-surface hover:bg-surface-container active:bg-surface-high disabled:text-outline",
  danger: "bg-error text-on-error hover:bg-on-error-container disabled:bg-outline",
};

const SIZES: Record<Size, string> = {
  // 48px minimum per DESIGN.md — also the floor for a comfortable touch target.
  md: "h-12 px-6 text-label-md",
  lg: "h-14 px-8 text-label-md",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded font-semibold transition-colors disabled:cursor-not-allowed";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  /** Renders a router Link styled as a button. */
  to?: string;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  to,
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
