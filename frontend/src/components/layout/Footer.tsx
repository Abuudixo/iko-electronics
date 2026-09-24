import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail, Phone, Truck } from "lucide-react";
import { COMPANY, FOOTER_NAV } from "@/lib/nav";
import Logo from "./Logo";

/**
 * One footer for the whole site.
 *
 * The four mockups each invented their own column set
 * (LEGAL/CUSTOMER CARE/STAY CONNECTED, SUPPORT/SHOP/NEWSLETTER,
 * COMPANY/SUPPORT/LEGAL, SUPPORT/LEGAL). Consolidated into Shop / Support /
 * Company, driven by lib/nav.ts.
 *
 * Set on IKO navy so the footer matches the wordmark color.
import Button from "@/components/ui/Button";
 */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    // TODO(step 10): POST to the Express BFF. Optimistic for now.
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="mt-auto bg-brand-navy text-inverse-on-surface">
      <div className="mx-auto max-w-(--container-page) px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo variant="onDark" />
            <p className="max-w-xs text-body-md text-inverse-on-surface/80">{COMPANY.tagline}</p>
            <div className="mt-2 flex gap-3">
              <a
                href="mailto:info@ikoelectronics.com"
                aria-label="Email us"
                className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Mail aria-hidden="true" className="size-5" />
              </a>
              <a
                href="tel:+000000000"
                aria-label="Call us"
                className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Phone aria-hidden="true" className="size-5" />
              </a>
            </div>
          </div>

          {FOOTER_NAV.map(({ heading, links }) => (
            <nav key={heading} aria-label={heading} className="flex flex-col gap-3">
              <h2 className="mb-1 text-label-md uppercase text-inverse-on-surface">{heading}</h2>
              {links.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-body-md text-inverse-on-surface/75 transition-colors hover:text-inverse-on-surface hover:underline"
                >
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-white/15 pt-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={handleSubscribe} className="max-w-md">
              <h2 className="text-label-md uppercase text-inverse-on-surface">Stay in the loop</h2>
              <p className="mt-2 text-body-md text-inverse-on-surface/75">
                New arrivals and deals. No spam.
              </p>
              {subscribed ? (
                <p role="status" className="mt-4 text-body-md text-inverse-primary">
                  Thanks — you&rsquo;re subscribed.
                </p>
              ) : (
                <div className="mt-4 flex gap-2">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 min-w-0 flex-1 rounded border border-white/25 bg-white/10 px-4 text-body-md text-inverse-on-surface placeholder:text-inverse-on-surface/50 focus:border-inverse-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-11 shrink-0 bg-primary px-5 text-label-md text-white hover:bg-primary-hover"
                  >
                    Join
                  </button>
                </div>
              )}
            </form>

            <ul className="flex flex-wrap items-start gap-x-8 gap-y-3 text-inverse-on-surface/75 lg:justify-end">
              <li className="flex items-center gap-2">
                <Lock aria-hidden="true" className="size-5" />
                <span className="text-label-md">Secure Checkout</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck aria-hidden="true" className="size-5" />
                <span className="text-label-md">Fast Delivery</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-label-sm text-inverse-on-surface/60">
          &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
