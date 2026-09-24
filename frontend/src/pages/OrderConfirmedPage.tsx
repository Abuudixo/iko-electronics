import { useLocation } from "react-router-dom";
import { Check, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

type OrderState = {
  reference: string;
  total: number;
  method: string;
  delivery?: string;
  phone: string;
  itemCount: number;
};

export default function OrderConfirmedPage() {
  const { state } = useLocation() as { state: OrderState | null };

  // Reached directly, or after a refresh — there is no order to show.
  if (!state?.reference) {
    return (
      <div className="container flex flex-col items-center gap-5 px-4 py-24 text-center md:px-8">
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

  return (
    <div className="bg-[#f8f7fc] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-[#e5e0ef] bg-surface-lowest p-6 text-center md:p-8">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-primary-container text-primary">
          <Check aria-hidden="true" className="size-10" strokeWidth={3} />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-on-surface">Thank You for Your Order!</h1>
        <p className="mt-2 text-body-lg text-on-surface-variant">Your order has been received successfully.</p>

      <dl className="mt-6 rounded-xl bg-[#f8f7fc] p-4 text-left">
        {[
          { label: "Order Number", value: state.reference },
          { label: "Name", value: "Guest Customer" },
          { label: "WhatsApp", value: state.phone },
          { label: "Payment", value: state.method },
          { label: "Delivery", value: state.delivery ?? "Home Delivery" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-wrap justify-between gap-2 py-1.5"
          >
            <dt className="text-body-md text-on-surface-variant">{label}</dt>
            <dd className="text-body-md font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
        <div className="mt-2 flex justify-between gap-2 border-t border-outline-variant pt-3">
          <dt className="text-body-md font-bold text-on-surface">Total Paid</dt>
          <dd className="text-body-md font-bold tabular-nums text-on-surface">{formatPrice(state.total)}</dd>
        </div>
      </dl>

      <a
        href="https://wa.me/252600000000"
        className="mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded bg-primary px-5 text-label-md font-semibold text-white shadow-none transition-colors hover:bg-primary-hover"
      >
        <MessageCircle aria-hidden="true" className="size-5" />
        Contact Us on WhatsApp
      </a>
      <Button to="/shop" size="md" variant="secondary" fullWidth className="mt-3">
        Continue Shopping
      </Button>
      </div>
    </div>
  );
}
