import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-(--container-page) flex-col items-center px-4 py-20 text-center md:px-8">
      <p className="text-label-md uppercase text-on-surface-variant">Error 404</p>
      <h1 className="mt-2 text-headline-lg-responsive">We couldn&rsquo;t find that page</h1>
      <p className="mt-3 max-w-prose text-on-surface-variant">
        The link may be broken, or the product may no longer be available.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-12 items-center rounded bg-primary px-6 text-label-md text-on-primary transition-colors hover:bg-on-primary-fixed-variant"
      >
        Back to home
      </Link>
    </div>
  );
}
