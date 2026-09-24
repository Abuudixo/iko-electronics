import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed disabled:bg-outline disabled:text-white",
  secondary:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed disabled:bg-outline disabled:text-white",
  ghost:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed disabled:bg-outline disabled:text-white",
  danger: "bg-error text-white hover:bg-on-error-container disabled:bg-outline disabled:text-white",
};

const SIZES: Record<Size, string> = {
  // 48px minimum per DESIGN.md — also the floor for a comfortable touch target.
  md: "h-11 px-5 text-label-md",
  lg: "h-11 px-5 text-label-md",
};

const BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded font-semibold !text-white shadow-none transition-colors disabled:cursor-not-allowed";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconOnly?: boolean;
  /** Renders a router Link styled as a button. */
  to?: string;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  iconOnly,
  to,
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(
    BASE,
    VARIANTS[variant],
    SIZES[size],
    iconOnly && "size-11 !p-0",
    fullWidth && "w-full",
    className,
  );

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
