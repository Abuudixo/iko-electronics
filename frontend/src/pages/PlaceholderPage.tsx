export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-20 md:px-8">
      <h1 className="text-headline-lg-responsive">{title}</h1>
      <p className="mt-3 text-body-lg text-on-surface-variant">
        This page isn&rsquo;t built yet.
      </p>
    </div>
  );
}
