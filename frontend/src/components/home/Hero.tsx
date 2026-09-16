import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[25rem] overflow-hidden bg-inverse-surface text-white sm:min-h-[30rem] lg:min-h-[34rem]">
      <div className="absolute inset-0">
        <img
          src="/hero/computadoras.jpg"
          alt="IKO laptop and desktop computer collection"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0e2043]/85 via-[#0e2043]/35 to-transparent" />

      <div className="relative mx-auto flex min-h-[25rem] max-w-(--container-page) items-center justify-center px-4 pb-8 pt-20 text-center sm:min-h-[30rem] sm:px-8 sm:pb-12 lg:min-h-[34rem] lg:justify-start lg:pb-16 lg:text-left">
        <div className="max-w-xl">
          <p className="text-label-md font-extrabold uppercase tracking-[0.16em] text-inverse-primary">IKO Electronics</p>
          <h1 className="mt-3 mx-auto max-w-[11ch] text-balance text-[2.35rem] font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:mt-4 sm:text-5xl lg:mx-0 lg:text-[4.5rem]">
            Technology,
            <br />
            honestly priced.
          </h1>
          <p className="mt-4 mx-auto max-w-lg text-label-md text-white/85 sm:mt-5 sm:text-body-lg lg:mx-0">
            Phones, laptops and audio chosen because they last — not because they carry the biggest margin.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:gap-4 lg:flex-row lg:items-center lg:justify-start">
            <Link to="/shop" className="inline-flex h-12 w-full max-w-[260px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 text-label-md text-on-primary transition-colors hover:bg-primary-hover sm:px-7">
              Shop all products
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link to="/deals" className="text-body-md font-semibold text-white underline-offset-4 hover:text-inverse-primary hover:underline">
              See this week&apos;s deals
            </Link>
          </div>
        </div>
      </div>
      </section>
  );
}
