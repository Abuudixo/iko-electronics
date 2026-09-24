import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Cpu,
  Gamepad2,
  Hand,
  Headphones,
  House,
  Laptop,
  MessageCircle,
  Mic2,
  Plug,
  Scissors,
  Smartphone,
  Star,
  Truck,
  Tv,
  Watch,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/types/catalog";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/shop/ProductCard";

const featured = PRODUCTS.filter((p) => p.compareAtPrice !== null || p.isNew);

const CATEGORY_ICONS: Record<(typeof CATEGORIES)[number]["slug"], LucideIcon> = {
  smartphones: Smartphone,
  laptops: Laptop,
  tvs: Tv,
  audio: Headphones,
  wearables: Watch,
  accessories: Plug,
  "home-appliances": House,
  gaming: Gamepad2,
  "power-charging": BatteryCharging,
  "hair-stylers": Scissors,
};

const CATEGORY_STYLES = [
  "bg-[#eee8f8]",
  "bg-[#e6eef7]",
  "bg-[#e5f4ed]",
  "bg-[#f5ece5]",
  "bg-[#f5e7ef]",
  "bg-[#edf4e6]",
  "bg-[#e5f2f5]",
  "bg-[#f4ece5]",
  "bg-[#f5f0e5]",
  "bg-[#eee7f5]",
];

const DEAL_CARDS = [
  {
    title: "Portable Bluetooth Speaker",
    description: "Powerful sound in a compact, wireless speaker.",
    image: "/hero/audio.jpg",
  },
  {
    title: "Latest iPhone Deals",
    description: "Powerful performance, incredible camera.",
    image: "/hero/phones.jpg",
  },
  {
    title: "Smart Watch Collection",
    description: "Track fitness, health, and notifications effortlessly.",
    image: "/hero/laptops.jpg",
  },
];

const STORE_STATS = [
  { value: "500+", label: "Products" },
  { value: "50+", label: "Brands" },
  { value: "21K+", label: "Happy Customers" },
];

const PROMO_CARDS = [
  {
    eyebrow: "Limited time",
    title: "Upgrade Your Home",
    description: "Smart TVs & Home Appliances",
    action: "Shop Appliances",
    to: "/shop?category=home-appliances",
    icon: Tv,
    className: "bg-primary",
  },
  {
    eyebrow: "New collection",
    title: "Power Up Your Day",
    description: "Chargers, Power Banks & Accessories",
    action: "Shop Accessories",
    to: "/shop?category=accessories",
    icon: Zap,
    className: "bg-primary-hover",
  },
];

const BRAND_SHOWCASE = [
  { label: "Samsung", filter: "Aurora", icon: Star },
  { label: "Apple", filter: "Meridian", icon: CircleDollarSign },
  { label: "Havit", filter: "NovaSound", icon: Headphones },
  { label: "Haier", filter: "ClearView", icon: Cpu },
  { label: "Xiaomi", filter: "Aurora", icon: Smartphone },
  { label: "JBL", filter: "NovaSound", icon: Mic2 },
  { label: "Oraimo", filter: "PulseFit", icon: Zap },
  { label: "HP", filter: "Meridian", icon: Laptop },
  { label: "Dell", filter: "Keystone", icon: Laptop },
  { label: "Lenovo", filter: "VoltCore", icon: Laptop },
];

const WHY_SHOP_POINTS = [
  { icon: Truck, title: "Fast Delivery", description: "Quick delivery within Mogadishu and supported locations." },
  { icon: Star, title: "Quality Products", description: "Carefully selected electronics from trusted brands." },
  { icon: CircleDollarSign, title: "Easy Payment", description: "Mobile money, cash on delivery, and more options." },
  { icon: Hand, title: "Customer Support", description: "Easy assistance through WhatsApp anytime." },
];

export default function HomePage() {
  const productsRef = useRef<HTMLUListElement>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const isDragging = useRef(false);
  const didDrag = useRef(false);

  function scrollProducts(direction: number) {
    productsRef.current?.scrollBy({
      left: direction * (productsRef.current.clientWidth + 24),
      behavior: "smooth",
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLUListElement>) {
    if (!productsRef.current) return;
    dragStartX.current = event.clientX;
    dragStartScroll.current = productsRef.current.scrollLeft;
    isDragging.current = true;
    didDrag.current = false;
    productsRef.current.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLUListElement>) {
    if (!isDragging.current || !productsRef.current) return;
    const distance = event.clientX - dragStartX.current;
    if (Math.abs(distance) > 5) didDrag.current = true;
    productsRef.current.scrollLeft = dragStartScroll.current - distance;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLUListElement>) {
    isDragging.current = false;
    productsRef.current?.releasePointerCapture(event.pointerId);
  }

  return (
    <>
      <Hero />

      <section className="border-y border-white/10 bg-inverse-surface text-center" aria-label="IKO store statistics">
        <ul className="mx-auto flex max-w-(--container-page) items-center justify-between gap-2 divide-x divide-white/15 px-4 py-2 sm:gap-4 sm:px-8 sm:py-3">
          {STORE_STATS.map(({ value, label }) => (
            <li key={label} className="flex-1 px-1 sm:px-4">
              <strong className="block font-display text-base font-bold leading-none text-white sm:text-2xl">{value}</strong>
              <span className="mt-1 block text-[10px] text-inverse-primary sm:text-label-sm">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative border-b border-outline-variant bg-surface-lowest" aria-labelledby="category-heading">
        <div className="mx-auto max-w-(--container-page) px-4 py-8 sm:py-10 md:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="category-heading" className="text-headline-md font-bold text-on-surface">
              Shop by Category
            </h2>
            <Link to="/shop" className="flex shrink-0 items-center gap-1 text-body-md font-semibold text-primary hover:underline">
              All Categories
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-3 sm:px-0 lg:mx-0 lg:grid lg:grid-cols-10 lg:gap-2 lg:overflow-visible lg:px-0">
            {CATEGORIES.map(({ slug, label }, index) => {
              return (
                <li key={slug} className="w-[32vw] shrink-0 sm:w-[180px] lg:w-auto">
                  <Link
                    to={`/shop?category=${slug}`}
                    className={`group flex h-full min-h-[78px] flex-col items-center justify-center rounded-[0.9rem] px-2 py-2 text-center transition-transform hover:-translate-y-0.5 hover:shadow-card sm:min-h-[88px] sm:rounded-2xl sm:px-3 sm:py-2 lg:min-h-[76px] lg:rounded-xl lg:px-1 lg:py-1 ${CATEGORY_STYLES[index]}`}
                  >
                    {(() => { const Icon = CATEGORY_ICONS[slug]; return <Icon aria-hidden="true" className="size-6 sm:size-7 lg:size-5" />; })()}
                    <span className="mt-1.5 text-[11px] font-bold leading-tight text-on-surface sm:mt-2 sm:text-label-sm lg:mt-1 lg:text-[10px]">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-(--container-page) px-4 py-10 md:px-8 md:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {DEAL_CARDS.map(({ title, description, image }) => (
            <article key={title} className="group overflow-hidden rounded-xl border border-outline-variant bg-surface-lowest shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
              <div className="overflow-hidden bg-[#edf3ff]">
                <img src={image} alt={title} className="aspect-[16/9] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
              <p className="text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
                {title.startsWith("Portable") ? "Hot pick" : title.startsWith("Latest") ? "Deal of the day" : "Fitness deal"}
              </p>
              <h2 className="mt-2 text-[1.25rem] font-semibold leading-tight text-on-surface sm:text-[1.4rem]">
                {title}
              </h2>
              <p className="mt-1.5 text-label-md text-on-surface-variant">{description}</p>
              <Link
                to="/shop"
                className="mt-4 inline-flex h-11 cursor-pointer items-center gap-2 rounded bg-primary px-5 text-label-md font-semibold text-white shadow-none transition-colors hover:bg-primary-hover"
              >
                Buy now
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-(--container-page) px-4 pb-10 md:px-8 md:pb-14" aria-labelledby="featured-heading">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="featured-heading" className="text-[1.85rem] font-bold tracking-[-0.03em] text-on-surface sm:text-[2.2rem]">
            Featured Products
          </h2>
          <Link to="/shop" className="flex items-center gap-1 text-body-md font-semibold text-primary hover:underline">
            View All
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {featured.slice(0, 4).map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      <section className="relative mx-auto max-w-(--container-page) px-4 pb-20 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[1.85rem] font-bold tracking-[-0.03em] text-on-surface sm:text-[2.2rem]">Best Sellers</h2>
          <Link to="/shop" className="hidden items-center gap-1 text-body-md font-semibold text-primary hover:underline sm:inline-flex">
            View all
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Previous products"
          onClick={() => scrollProducts(-1)}
          className="absolute left-1 top-[58%] z-10 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-outline-variant bg-surface-lowest text-on-surface shadow-none transition-colors hover:border-primary hover:text-primary sm:left-2 sm:size-10 lg:left-0"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next products"
          onClick={() => scrollProducts(1)}
          className="absolute right-1 top-[58%] z-10 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-outline-variant bg-surface-lowest text-on-surface shadow-none transition-colors hover:border-primary hover:text-primary sm:right-2 sm:size-10 lg:right-0"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>

        <ul
          ref={productsRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClickCapture={(event) => {
            if (didDrag.current) {
              event.preventDefault();
              event.stopPropagation();
              didDrag.current = false;
            }
          }}
          className="grid grid-cols-2 gap-3 sm:-mx-4 sm:flex sm:cursor-grab sm:snap-x sm:gap-4 sm:overflow-x-auto sm:px-12 sm:pb-3 sm:select-none sm:active:cursor-grabbing lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0"
        >
          {featured.map((product) => (
            <li key={product.id} className="sm:w-[calc(100vw-6rem)] sm:shrink-0 sm:snap-start lg:w-auto">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-(--container-page) px-4 pb-20 md:px-8" aria-label="Shop promotions">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {PROMO_CARDS.map(({ eyebrow, title, description, action, to, icon: Icon, className }) => (
            <article key={title} className={`relative min-h-48 overflow-hidden rounded-2xl px-5 py-6 text-white sm:px-7 sm:py-7 ${className}`}>
              <div className="relative z-10 max-w-sm">
                <p className="text-label-md uppercase tracking-[0.08em] text-[#c6bce6]">{eyebrow}</p>
                <h2 className="mt-2 max-w-[10ch] text-2xl font-bold leading-[1.08] tracking-[-0.03em] text-white">{title}</h2>
                <p className="mt-3 text-body-md text-[#d5c9e9]">{description}</p>
                <Link
                  to={to}
                  className="mt-4 inline-flex h-11 cursor-pointer items-center gap-2 rounded bg-primary px-5 text-label-md font-semibold text-white shadow-none ring-1 ring-white/30 transition-colors hover:bg-primary-hover"
                >
                  {action}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
              <Icon aria-hidden="true" className="absolute right-7 top-1/2 size-14 -translate-y-1/2 text-white/20" strokeWidth={1.5} />
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-(--container-page) px-4 pb-20 md:px-8" aria-labelledby="brands-heading">
        <h2 id="brands-heading" className="mb-6 text-[1.85rem] font-bold tracking-[-0.03em] text-on-surface sm:text-[2.2rem]">
          Shop Your Favorite Brands
        </h2>

        <ul className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-3 sm:px-0 lg:mx-0 lg:grid lg:grid-cols-10 lg:gap-2 lg:overflow-visible lg:px-0">
          {BRAND_SHOWCASE.map(({ label, filter, icon: Icon }) => (
            <li key={label} className="w-[30vw] shrink-0 sm:w-[150px] lg:w-auto">
              <Link
                to={`/shop?brand=${encodeURIComponent(filter)}`}
                className="group flex aspect-[1.08] flex-col items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-lowest px-2 py-1.5 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card sm:rounded-lg sm:px-2 sm:py-2 lg:aspect-auto lg:min-h-[76px] lg:gap-1 lg:rounded-xl lg:px-1 lg:py-1"
              >
                <Icon aria-hidden="true" className="size-6 sm:size-7 lg:size-5" />
                <span className="text-[10px] font-bold text-on-surface sm:text-[11px] lg:text-[10px]">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-(--container-page) px-4 pb-20 md:px-8" aria-labelledby="why-shop-heading">
        <h2 id="why-shop-heading" className="mb-6 text-[1.85rem] font-bold tracking-[-0.03em] text-on-surface sm:text-[2.2rem]">
          Why Shop With IKO
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {WHY_SHOP_POINTS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="rounded-xl border border-outline-variant bg-surface-lowest px-3 py-4 text-center sm:px-4">
              <Icon aria-hidden="true" className="mx-auto size-8 sm:size-9" />
              <h3 className="mt-2 text-sm font-bold text-on-surface sm:mt-3 sm:text-body-lg">{title}</h3>
              <p className="mt-1.5 text-[10px] text-on-surface-variant sm:mt-2 sm:text-label-md">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-inverse-surface px-4 py-8 text-center text-white sm:py-10" aria-labelledby="help-heading">
        <MessageCircle aria-hidden="true" className="mx-auto size-8 text-inverse-primary" strokeWidth={1.5} />
        <h2 id="help-heading" className="mt-3 text-headline-md font-bold text-white">Need Help Choosing?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-label-md text-inverse-primary sm:text-body-md">
          Our team is ready to help you find the perfect product. Chat with us on WhatsApp.
        </p>
        <Link
          to="/contact"
          className="mx-auto mt-5 inline-flex h-11 cursor-pointer items-center gap-2 rounded bg-primary px-5 text-label-md font-semibold text-white shadow-none transition-colors hover:bg-primary-hover"
        >
          <MessageCircle aria-hidden="true" className="size-5" />
          Chat on WhatsApp
        </Link>
      </section>
    </>
  );
}
