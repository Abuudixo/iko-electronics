import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import QuantityStepper from "@/components/ui/QuantityStepper";

const FREE_DELIVERY_THRESHOLD = 5000; // $50.00
const DELIVERY_FEE = 499; // $4.99

/**
 * Mobile-money providers. The mockup's card form was discarded: raw PAN,
 * expiry and CVC inputs put the site inside PCI-DSS scope, and card details
 * belong in a processor-hosted field, never in our own DOM.
 */
const PAYMENT_METHODS = [
  { id: "evc", label: "EVC Plus" },
  { id: "zaad", label: "Zaad" },
  { id: "sahal", label: "Sahal" },
  { id: "edahab", label: "eDahab" },
  { id: "cod", label: "Cash on delivery" },
] as const;

type Errors = Partial<Record<"fullName" | "phone" | "city" | "address" | "payPhone", string>>;

export default function CheckoutPage() {
  const { lines, subtotal, itemCount, setQuantity, remove, clear } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<string>("evc");
  const [payPhone, setPayPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  /**
   * Send focus to the first problem after a failed submit, so the user is not
   * left hunting for what went wrong. Runs post-commit, once the fields
   * actually carry aria-invalid.
   */
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const isMobileMoney = method !== "cod";

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-(--container-page) flex-col items-center gap-5 px-4 py-24 text-center md:px-8">
        <ShoppingBag aria-hidden="true" strokeWidth={1.25} className="size-14 text-outline-variant" />
        <h1 className="text-headline-lg-responsive">Your cart is empty</h1>
        <p className="max-w-prose text-body-lg text-on-surface-variant">
          Once you add something, it will show up here ready to check out.
        </p>
        <Button to="/shop" size="lg">
          Browse products
        </Button>
      </div>
    );
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!fullName.trim()) next.fullName = "We need a name for the delivery.";
    // Phone is the primary identifier here — it is how the driver reaches the
    // customer and how mobile money is confirmed. Email is optional; this isn't.
    if (!/^[0-9+\s-]{7,}$/.test(phone.trim())) next.phone = "Enter a phone number we can reach you on.";
    if (!city.trim()) next.city = "Which city should we deliver to?";
    if (!address.trim()) next.address = "Add a street, area or landmark.";
    if (isMobileMoney && !/^[0-9+\s-]{7,}$/.test(payPhone.trim())) {
      next.payPhone = "Enter the number registered for this wallet.";
    }
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    // Focus moves in the effect below, not here — at this point React has not
    // committed the re-render, so no field carries aria-invalid yet.
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    // TODO(step 10): POST to the Express BFF, which creates the sale.order in
    // Odoo and initiates the mobile-money charge. Simulated for now.
    const reference = `IKO-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    window.setTimeout(() => {
      const method_ = PAYMENT_METHODS.find((m) => m.id === method)?.label ?? "";
      clear();
      navigate("/order-confirmed", {
        state: { reference, total, method: method_, phone: phone.trim(), itemCount },
      });
    }, 700);
  }

  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-10 md:px-8">
      <h1 className="text-headline-lg-responsive">Checkout</h1>
      <p className="mt-2 text-body-lg text-on-surface-variant">
        Review your items and confirm your order.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-8">
          {/* ---------- Cart ---------- */}
          <section className="rounded-lg bg-surface-lowest p-5 shadow-card md:p-6">
            <h2 className="text-headline-md">Your items</h2>
            <ul className="mt-5 divide-y divide-outline-variant">
              {lines.map((l) => (
                <li key={`${l.productId}-${l.optionName ?? "default"}`} className="flex flex-wrap gap-4 py-5 first:pt-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-label-sm uppercase text-on-surface-variant">{l.brand}</p>
                    <h3 className="text-body-md font-semibold">{l.name}</h3>
                    {l.optionName && (
                      <p className="text-label-sm text-on-surface-variant">
                        {l.optionLabel}: {l.optionName}
                      </p>
                    )}
                    <p className="mt-1 text-body-md tabular-nums">{formatPrice(l.unitPrice)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <QuantityStepper
                      value={l.quantity}
                      max={l.stock}
                      label={`Quantity for ${l.name}`}
                      onChange={(q) => setQuantity(l.productId, l.optionName, q)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(l.productId, l.optionName)}
                      aria-label={`Remove ${l.name} from cart`}
                      className="grid size-11 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
                    >
                      <Trash2 aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- Delivery ---------- */}
          <section className="rounded-lg bg-surface-lowest p-5 shadow-card md:p-6">
            <h2 className="text-headline-md">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField
                label="Full name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                className="sm:col-span-2"
              />
              <TextField
                label="Phone number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="e.g. 61 234 5678"
                hint="Used to confirm the order and reach you on delivery."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
              />
              <TextField
                label="City"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={errors.city}
              />
              <TextField
                label="Street, area or landmark"
                autoComplete="street-address"
                hint="A nearby landmark helps more than a street name."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={errors.address}
                className="sm:col-span-2"
              />
              <TextField
                label="Delivery notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          </section>

          {/* ---------- Payment ---------- */}
          <section className="rounded-lg bg-surface-lowest p-5 shadow-card md:p-6">
            <h2 className="text-headline-md">Payment</h2>
            <fieldset className="mt-5">
              <legend className="sr-only">Payment method</legend>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={[
                      "flex cursor-pointer items-center gap-3 rounded border px-4 py-3.5 transition-colors",
                      method === m.id
                        ? "border-primary bg-primary-container text-on-primary-container"
                        : "border-outline-variant hover:border-outline",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="size-4 accent-[var(--color-primary)]"
                    />
                    <span className="text-body-md font-medium">{m.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {isMobileMoney ? (
              <div className="mt-5">
                <TextField
                  label="Mobile money number"
                  type="tel"
                  inputMode="tel"
                  placeholder="e.g. 61 234 5678"
                  hint="You will get a prompt on this number to approve the payment."
                  value={payPhone}
                  onChange={(e) => setPayPhone(e.target.value)}
                  error={errors.payPhone}
                />
              </div>
            ) : (
              <p className="mt-5 rounded bg-surface-low p-4 text-body-md text-on-surface-variant">
                Pay the driver in cash when your order arrives. Please have the exact amount ready
                where possible.
              </p>
            )}
          </section>
        </div>

        {/* ---------- Summary ---------- */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg bg-surface-lowest p-5 shadow-card md:p-6">
            <h2 className="text-headline-md">Order summary</h2>

            <dl className="mt-5 flex flex-col gap-3">
              <div className="flex justify-between gap-4 text-body-md">
                <dt className="text-on-surface-variant">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 text-body-md">
                <dt className="text-on-surface-variant">Delivery</dt>
                <dd className="tabular-nums">
                  {delivery === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    formatPrice(delivery)
                  )}
                </dd>
              </div>

              {delivery > 0 && (
                <p className="text-label-sm text-on-surface-variant">
                  Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery.
                </p>
              )}

              <div className="mt-2 flex justify-between gap-4 border-t border-outline-variant pt-4">
                <dt className="text-headline-md">Total</dt>
                <dd className="text-headline-md tabular-nums text-primary">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Button type="submit" size="lg" fullWidth className="mt-6" disabled={submitting}>
              {submitting ? "Placing order…" : "Place order"}
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-label-sm text-on-surface-variant">
              <Lock aria-hidden="true" className="size-3.5" />
              We never ask for card details or PINs.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
