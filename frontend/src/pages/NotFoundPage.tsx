import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container flex flex-col items-center px-4 py-20 text-center md:px-8">
      <p className="text-label-md uppercase text-on-surface-variant">Error 404</p>
      <h1 className="mt-2 text-headline-lg-responsive">We couldn&rsquo;t find that page</h1>
      <p className="mt-3 max-w-prose text-on-surface-variant">
        The link may be broken, or the product may no longer be available.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-11 cursor-pointer items-center rounded bg-primary px-5 text-label-md font-semibold text-white shadow-none transition-colors hover:bg-primary-hover"
      >
        Back to home
      </Link>
    </div>
  );
}
