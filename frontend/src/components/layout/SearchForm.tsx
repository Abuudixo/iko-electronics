import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A real <form>, not a bare input — so Enter submits and mobile keyboards show
 * a "search" key. role="search" gives it a landmark screen readers can jump to.
 */
export default function SearchForm({
  className,
  onSubmitted,
}: {
  className?: string;
  onSubmitted?: () => void;
}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/shop?q=${encodeURIComponent(q)}`);
    onSubmitted?.();
  }

  const [isFocused, setIsFocused] = useState(false);

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn("relative transition-[width] duration-200 ease-out", className, isFocused && "lg:w-80")}
    >
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-on-surface-variant"
      />
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="h-11 w-full rounded-full border border-outline-variant bg-surface-lowest pl-10 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
      />
    </form>
  );
}
