import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type Props = {
  /** "onDark" swaps to the light wordmark for the navy footer. */
  variant?: "default" | "onDark";
  className?: string;
};

/**
 * The logo is a link home on every page except the homepage itself, where a
 * self-link is noise for screen-reader users. Kept simple: one <img>, explicit
 * width/height so it reserves space and doesn't shift layout while loading.
 */
export default function Logo({ variant = "default", className }: Props) {
  const src = variant === "onDark" ? "/brand/iko-logo-onDark.png" : "/brand/iko-logo-compact.png";

  return (
    <Link to="/" className={cn("inline-flex shrink-0 items-center", className)}>
      <img
        src={src}
        alt="IKO Electronics — home"
        width={600}
        height={262}
        className="h-8 w-auto md:h-9"
        // The logo is above the fold on every page; never lazy-load it.
        fetchPriority="high"
      />
    </Link>
  );
}
