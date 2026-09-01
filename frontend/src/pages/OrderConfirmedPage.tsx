import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Package, Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

type OrderState = {
  reference: string;
  total: number;
  method: string;
  phone: string;
  itemCount: number;
};

export default function OrderConfirmedPage() {
  const { state } = useLocation() as { state: OrderState | null };

  // Reached directly, or after a refresh — there is no order to show.
  if (!state?.reference) {
    return (
      <div className="mx-auto flex max-w-(--container-page) flex-col items-center gap-5 px-4 py-24 text-center md:px-8">
        <h1 className="text-headline-lg-responsive">No recent order</h1>
        <p className="max-w-prose text-body-lg text-on-surface-variant">
          If you have just placed one, the confirmation was sent to your phone by SMS.
        </p>
        <Button to="/shop" size="lg">
          Continue shopping
        </Button>
      </div>
    );
  }

  const isCash = state.method.toLowerCase().includes("cash");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8 md:py-24">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 aria-hidden="true" strokeWidth={1.5} className="size-16 text-success" />
        <h1 className="mt-5 text-headline-lg-responsive">Order placed</h1>
        <p className="mt-3 max-w-prose text-body-lg text-on-surface-variant">
          {isCash
            ? "We will call you shortly to confirm delivery. Pay the driver on arrival."
            : `Approve the payment prompt sent to ${state.phone} to complete your order.`}
        </p>
      </div>

      <dl className="mt-10 overflow-hidden rounded-lg border border-outline-variant">
        {[
          { label: "Order reference", value: state.reference },
          { label: "Items", value: `${state.itemCount} ${state.itemCount === 1 ? "item" : "items"}` },
          { label: "Payment method", value: state.method },
          { label: "Total", value: formatPrice(state.total) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-wrap justify-between gap-2 border-b border-outline-variant px-5 py-4 last:border-b-0"
          >
            <dt className="text-body-md text-on-surface-variant">{label}</dt>
            <dd className="text-body-md font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="flex gap-3 rounded-lg bg-surface-lowest p-5 shadow-card">
          <Package aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-label-md">What happens next</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">
              We pack your order and dispatch it. Same-day if you ordered before 3pm.
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg bg-surface-lowest p-5 shadow-card">
          <Phone aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-label-md">Need to change something?</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Quote <strong className="text-on-surface">{state.reference}</strong> and{" "}
              <Link to="/contact" className="text-primary hover:underline">
                contact us
              </Link>{" "}
              as soon as you can.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button to="/shop" size="lg" variant="secondary">
          Continue shopping
        </Button>
      </div>
    </div>
  );
}
