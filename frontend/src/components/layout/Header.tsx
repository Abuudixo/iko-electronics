import { useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { MessageCircle, Menu, ShoppingCart, User, Zap } from "lucide-react";
import { PRIMARY_NAV } from "@/lib/nav";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import MobileNav from "./MobileNav";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { itemCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/80 backdrop-blur-md">
        <div className="flex min-h-12 items-center justify-center gap-3 bg-inverse-surface px-4 py-2 text-center text-label-md text-inverse-on-surface">
          <span className="inline-flex items-center gap-2">
            <Zap aria-hidden="true" className="size-4 fill-[#ff9f43] text-[#ff9f43]" />
            <span>Fast Delivery Across Mogadishu</span>
          </span>
          <span aria-hidden="true" className="text-inverse-primary">|</span>
          <Link to="/contact" className="inline-flex items-center gap-2 transition-colors hover:text-inverse-primary">
            <MessageCircle aria-hidden="true" className="size-5 text-[#00c875]" />
            <span>Contact Us on WhatsApp</span>
          </Link>
        </div>

        <div className="mx-auto flex h-20 max-w-(--container-page) items-center gap-4 px-4 md:px-8">
          <Logo />

          <nav aria-label="Main" className="ml-[88px] hidden items-center gap-4 lg:flex">
            {PRIMARY_NAV.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  [
                    "rounded-md px-3 py-2 text-body-md font-bold transition-colors",
                    isActive
                      ? "bg-primary-container text-on-primary-container"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-primary",
                  ].join(" ")
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <SearchForm className="hidden w-64 lg:block" />

            <Link
              to="/account"
              aria-label="Your account"
              className="grid size-11 place-items-center rounded-full text-on-surface transition-colors hover:bg-surface-container hover:text-primary"
            >
              <User aria-hidden="true" className="size-6" />
            </Link>

            {/*
              Stitch renders a bare coloured dot here, which tells a screen
              reader nothing. The count goes in the accessible name instead.
            */}
            <Link
              to="/checkout"
              aria-label={
                itemCount > 0
                  ? `Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
                  : "Cart, empty"
              }
              className="relative grid size-11 place-items-center rounded-full text-on-surface transition-colors hover:bg-surface-container hover:text-primary"
            >
              <ShoppingCart aria-hidden="true" className="size-6" />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-label-sm leading-none text-on-primary"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid size-11 cursor-pointer place-items-center rounded-full text-on-surface hover:bg-surface-container lg:hidden"
            >
              <Menu aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        returnFocusTo={menuButtonRef}
      />
    </>
  );
}
