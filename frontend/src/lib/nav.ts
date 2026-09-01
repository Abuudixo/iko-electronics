/**
 * Single source of truth for site navigation.
 *
 * Stitch generated each screen independently, so the four mockups have four
 * different navbars and four different footers. Everything derives from here
 * instead, so a link can never drift between header and footer again.
 */

export type NavLink = { label: string; to: string };

export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Deals", to: "/deals" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const FOOTER_NAV: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Shop",
    links: [
      { label: "All Products", to: "/shop" },
      { label: "New Arrivals", to: "/shop?sort=newest" },
      { label: "Deals", to: "/deals" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Shipping Info", to: "/shipping" },
      { label: "Returns", to: "/returns" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About IKO", to: "/about" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

export const COMPANY = {
  name: "IKO Electronics",
  tagline: "Quality consumer electronics at honest prices.",
} as const;
