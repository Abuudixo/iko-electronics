import { Link } from "react-router-dom";
import { Handshake, MessageCircle, Package, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-inverse-surface text-white">
        <div className="absolute inset-0">
          <img
            src="/hero/computadoras.jpg"
            alt=""
            className="h-full w-full object-cover object-center opacity-70"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[#0e2043]/85" />

        <div className="container relative flex min-h-[23rem] items-end justify-center px-4 pb-12 pt-20 text-center sm:min-h-[29rem] sm:pb-14 md:px-8 lg:min-h-[29.25rem]">
          <div className="max-w-5xl">
            <p className="text-label-md uppercase tracking-[0.16em] text-inverse-primary">
              About us
            </p>
            <h1 className="mt-3 text-balance text-[2.7rem] font-bold leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-[4.5rem]">
              Technology You <span className="text-brand-purple">Can Trust</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-surface-lowest">
        <div className="container px-6 py-16 md:px-12 md:py-20">
          <p className="max-w-4xl text-body-lg leading-relaxed text-on-surface-variant sm:text-[1.5rem] sm:leading-[1.8]">
            IKO Electronics is a customer-focused electronics retailer bringing
            quality technology products and excellent service to customers
            across Somalia. We believe everyone deserves access to reliable,
            modern technology at fair prices.
          </p>
        </div>
      </section>

      <section className="bg-surface-lowest pb-16 md:pb-20">
        <div className="container grid gap-4 px-6 md:grid-cols-3 md:px-12">
          <article className="rounded-xl border border-primary-container bg-primary-container/25 p-5">
            <Target aria-hidden="true" className="size-8 text-primary" />
            <h2 className="mt-4 text-lg font-bold text-on-surface">Our Mission</h2>
            <p className="mt-2 text-body-md leading-relaxed text-on-surface-variant">
              To make quality technology accessible to every Somali household,
              providing trusted products with outstanding customer service and
              convenient delivery.
            </p>
          </article>

          <article className="rounded-xl border border-primary-container bg-primary-container/25 p-5">
            <Package aria-hidden="true" className="size-8 text-primary" />
            <h2 className="mt-4 text-lg font-bold text-on-surface">Our Products</h2>
            <p className="mt-2 text-body-md leading-relaxed text-on-surface-variant">
              We carry a carefully curated selection of smartphones, laptops,
              TVs, audio equipment, accessories, and home appliances from the
              most trusted global brands.
            </p>
          </article>

          <article className="rounded-xl border border-primary-container bg-primary-container/25 p-5">
            <Handshake aria-hidden="true" className="size-8 text-primary" />
            <h2 className="mt-4 text-lg font-bold text-on-surface">Our Commitment</h2>
            <p className="mt-2 text-body-md leading-relaxed text-on-surface-variant">
              We stand behind every product we sell. Our team is always
              available on WhatsApp to help you find the right product, answer
              questions, and resolve any issues.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-surface-lowest pb-16 md:pb-20">
        <div className="container px-6 md:px-12">
          <div className="grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 lg:gap-4">
            {[
              ["500+", "Products Available"],
              ["50+", "Trusted Brands"],
              ["26K+", "Happy Customers"],
              ["4", "Cities Served"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl bg-inverse-surface px-3 py-4 text-center sm:px-5 sm:py-5"
              >
                <p className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{value}</p>
                <p className="mt-1 text-xs text-inverse-primary sm:text-body-md">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 lg:flex-row lg:justify-start">
            <Link
              to="/shop"
              className="inline-flex h-11 w-full max-w-[220px] cursor-pointer items-center justify-center rounded bg-primary px-5 text-label-md font-semibold text-white shadow-none transition-colors hover:bg-primary-hover"
            >
              Browse Products
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-11 w-full max-w-[220px] cursor-pointer items-center justify-center rounded bg-primary px-5 text-label-md font-semibold text-white shadow-none transition-colors hover:bg-primary-hover"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Link
        to="/contact"
        aria-label="Contact IKO Electronics on WhatsApp"
        className="fixed bottom-6 right-6 z-20 grid size-16 place-items-center rounded-full bg-primary text-white shadow-none transition-colors hover:bg-primary-hover"
      >
        <MessageCircle aria-hidden="true" className="size-8" strokeWidth={2.2} />
      </Link>
    </>
  );
}
