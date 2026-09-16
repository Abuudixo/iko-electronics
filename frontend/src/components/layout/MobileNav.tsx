import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { PRIMARY_NAV } from "@/lib/nav";
import SearchForm from "./SearchForm";

/**
 * Slide-in navigation drawer for small screens.
 *
 * The mockups have no mobile design at all, so this is designed here. The
 * accessibility work is the point: without it a drawer is a trap — sighted
 * mouse users can close it, keyboard and screen-reader users cannot.
 *  - Escape closes it
 *  - focus moves into the panel on open and back to the trigger on close
 *  - background scroll is locked so the page behind doesn't move
 *  - aria-modal marks the rest of the page inert to screen readers
 */
export default function MobileNav({
  open,
  onClose,
  returnFocusTo,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusTo: React.RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    // Move focus into the drawer so the next Tab stays inside it.
    panelRef.current?.querySelector<HTMLElement>("a, button, input")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      returnFocusTo.current?.focus();
    };
  }, [open, onClose, returnFocusTo]);

  if (!open) return null;

  return (
    <div className="lg:hidden">
      {/* Scrim. Not focusable — keyboard users close with Escape or the X button,
          so a full-screen button would just be a duplicate tab stop. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed right-0 top-0 z-50 flex h-dvh w-[85%] max-w-sm flex-col bg-surface-lowest shadow-card-hover"
      >
        <div className="flex h-20 items-center justify-between border-b border-outline-variant px-4">
          <span className="text-label-md uppercase text-on-surface-variant">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full text-on-surface hover:bg-surface-container"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>

        <div className="border-b border-outline-variant p-4">
          <SearchForm onSubmitted={onClose} />
        </div>

        <nav aria-label="Main" className="flex flex-col p-2">
          {PRIMARY_NAV.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "rounded px-4 py-3 text-body-lg transition-colors",
                  isActive
                    ? "bg-primary-container font-semibold text-on-primary-container"
                    : "text-on-surface hover:bg-surface-container",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
