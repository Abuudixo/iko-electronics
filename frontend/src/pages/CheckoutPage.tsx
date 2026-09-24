import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Banknote, Building2, Clock3, CreditCard, Home, MessageCircle, Smartphone, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";

const FIELD_INTERACTION =
  "transition-colors hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20";

const PAYMENT_METHODS = [
  { id: "mobile-money", icon: Smartphone, label: "Mobile Money", description: "Pay with EVC Plus, Zaad, or SAHAL" },
  { id: "cash", icon: Banknote, label: "Cash on Delivery", description: "Pay when your order arrives" },
  { id: "store", icon: Building2, label: "Pay at Store", description: "Visit our store and pay in person" },
  { id: "bank", icon: CreditCard, label: "Bank Transfer", description: "Transfer to our bank account" },
] as const;

const DELIVERY_METHODS = [
  { id: "home", icon: Home, label: "Home Delivery", description: "Delivered to your door. Free", timing: "1-2 business days" },
  { id: "pickup", icon: Building2, label: "Store Pickup", description: "Pick up from our store. Free", timing: "Ready in 2 hours" },
] as const;

const BANAADIR_DISTRICTS = [
  "Abdiaziz",
  "Bondhere",
  "Daynile",
  "Dharkenley",
  "Hamar Jajab",
  "Hamar Weyne",
  "Hodan",
  "Howlwadaag",
  "Huriwaa",
  "Kahda",
  "Karaan",
  "Shangani",
  "Shibis",
  "Waberi",
  "Wadajir",
  "Wardhigley",
  "Yaqshid",
] as const;

type Errors = Partial<Record<"fullName" | "phone" | "city" | "address", string>>;

type CustomerProfile = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  landmark: string;
  loyaltyPoints: number;
};

const PROFILE_STORAGE_KEY = "iko.customer.profile.v1";
const LOYALTY_THRESHOLD = 250;
const LOYALTY_RATE = 0.1;
const FREE_DELIVERY_THRESHOLD = 50;

function readCustomerProfile(): CustomerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return {
        fullName: "",
        phone: "",
        email: "",
        city: "",
        district: "",
        address: "",
        landmark: "",
        loyaltyPoints: 0,
      };
    }

    const parsed = JSON.parse(raw) as Partial<CustomerProfile>;
    return {
      fullName: parsed.fullName ?? "",
      phone: parsed.phone ?? "",
      email: parsed.email ?? "",
      city: parsed.city ?? "",
      district: parsed.district ?? "",
      address: parsed.address ?? "",
      landmark: parsed.landmark ?? "",
      loyaltyPoints: Number(parsed.loyaltyPoints ?? 0),
    };
  } catch {
    return {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      district: "",
      address: "",
      landmark: "",
      loyaltyPoints: 0,
    };
  }
}

export default function CheckoutPage() {
  const { lines, subtotal, itemCount, clear } = useCart();
  const navigate = useNavigate();

  const savedProfile = readCustomerProfile();

  const [fullName, setFullName] = useState(savedProfile.fullName);
  const [phone, setPhone] = useState(savedProfile.phone);
  const [email, setEmail] = useState(savedProfile.email);
  const [city, setCity] = useState(savedProfile.city);
  const [district, setDistrict] = useState(savedProfile.district);
  const [address, setAddress] = useState(savedProfile.address);
  const [landmark, setLandmark] = useState(savedProfile.landmark);
  const [loyaltyPoints, setLoyaltyPoints] = useState(savedProfile.loyaltyPoints);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [currentStep, setCurrentStep] = useState(1);
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

  useEffect(() => {
    const profile: CustomerProfile = {
      fullName,
      phone,
      email,
      city,
      district,
      address,
      landmark,
      loyaltyPoints,
    };

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage failures; checkout still works without persistence.
    }
  }, [address, city, district, email, fullName, landmark, loyaltyPoints, phone]);

  const delivery = 0;
  const loyaltyDiscount = loyaltyPoints >= LOYALTY_THRESHOLD ? subtotal * LOYALTY_RATE : 0;
  const total = subtotal + delivery - loyaltyDiscount;
  const pointsEarned = Math.max(0, Math.floor(subtotal));

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
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (currentStep === 1) {
      const found = validate();
      setErrors(found);
      // Focus moves in the effect below, not here — at this point React has not
      // committed the re-render, so no field carries aria-invalid yet.
      if (Object.keys(found).length > 0) return;
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }

    setSubmitting(true);
    // TODO(step 10): POST to the Express BFF, which creates the sale.order in
    // Odoo and initiates the mobile-money charge. Simulated for now.
    const reference = `IKO-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const nextLoyaltyPoints = loyaltyPoints + pointsEarned - (loyaltyPoints >= LOYALTY_THRESHOLD ? LOYALTY_THRESHOLD : 0);

    window.setTimeout(() => {
      setLoyaltyPoints(nextLoyaltyPoints);
      clear();
      navigate("/order-confirmed", {
        state: {
          reference,
          total,
          method: PAYMENT_METHODS.find((payment) => payment.id === paymentMethod)?.label ?? "Cash on Delivery",
          delivery: DELIVERY_METHODS.find((deliveryOption) => deliveryOption.id === deliveryMethod)?.label ?? "Home Delivery",
          phone: phone.trim(),
          itemCount,
          loyaltyPoints: nextLoyaltyPoints,
          loyaltyDiscount,
        },
      });
    }, 700);
  }

  return (
    <div className="bg-[#f8f7fc]">
      <div className="mx-auto max-w-3xl px-2 py-4 sm:px-4 md:py-6">
        <h1 className="sr-only">Checkout</h1>

        <ol aria-label="Checkout progress" className="mx-auto flex max-w-[21rem] items-start justify-between">
          {["Customer", "Payment", "Delivery", "Complete"].map((step, index) => (
            <li key={step} className="relative flex flex-1 flex-col items-center gap-1.5 text-center">
              {index < 3 && (
                <span aria-hidden="true" className="absolute left-1/2 top-3 h-px w-full bg-outline-variant" />
              )}
              <button
                type="button"
                onClick={() => index < currentStep - 1 && setCurrentStep(index + 1)}
                disabled={index >= currentStep}
                className={[
                  "relative z-10 grid size-6 place-items-center rounded-full text-label-sm",
                  currentStep === index + 1
                    ? "bg-inverse-surface text-white"
                    : currentStep > index + 1
                      ? "bg-primary text-white"
                      : "bg-surface-container text-white",
                  index > 1 ? "cursor-default" : "cursor-pointer",
                ].join(" ")}
              >
                {currentStep > index + 1 ? "✓" : index + 1}
              </button>
              <span className="text-[0.65rem] text-on-surface-variant">{step}</span>
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start lg:gap-3">
          <div className="order-1 flex flex-col gap-2 lg:order-1">
          {currentStep === 1 && (
          <section className="order-1 rounded-xl border border-[#e5e0ef] bg-surface-lowest p-3 sm:p-4 lg:order-1">
            <h2 className="text-xl font-bold tracking-tight text-on-surface sm:text-2xl">Customer Information</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <TextField
                label="Full Name *"
                autoComplete="name"
                value={fullName}
                placeholder="Abdulahi Abdirashiid Mohamud"
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                className={`${FIELD_INTERACTION} sm:col-span-2`}
              />
              <div className="flex flex-col gap-2 rounded-2xl border-2 border-primary bg-primary-container/50 p-3 sm:col-span-2 sm:p-4">
                <label htmlFor="checkout-whatsapp" className="flex items-center gap-1.5 text-label-sm font-semibold text-primary">
                  <MessageCircle aria-hidden="true" className="size-3.5" />
                  WhatsApp Number <span aria-hidden="true">*</span>
                </label>
                <input
                  id="checkout-whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+252 61 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? "checkout-whatsapp-error" : "checkout-whatsapp-hint"}
                  className="h-14 w-full rounded-xl border-2 border-primary bg-surface-lowest px-5 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {errors.phone ? (
                  <p id="checkout-whatsapp-error" role="alert" className="text-label-sm text-error">
                    {errors.phone}
                  </p>
                ) : (
                  <p id="checkout-whatsapp-hint" className="text-label-sm text-primary">
                    We will send your order updates to this number.
                  </p>
                )}
              </div>
              <TextField
                label="Email (optional)"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={`${FIELD_INTERACTION} sm:col-span-2`}
              />
              <SelectField
                label="City"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={errors.city}
                className={FIELD_INTERACTION}
              >
                <option value="">Select city</option>
                <option value="Mogadishu">Mogadishu</option>
                <option value="Hargeisa">Hargeisa</option>
                <option value="Kismayo">Kismayo</option>
                <option value="Garowe">Garowe</option>
              </SelectField>
              <SelectField
                label="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={FIELD_INTERACTION}
              >
                <option value="">Select district</option>
                {BANAADIR_DISTRICTS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </SelectField>
              <TextField
                label="Delivery Address"
                autoComplete="street-address"
                placeholder="Street name, building..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={errors.address}
                className={`${FIELD_INTERACTION} sm:col-span-2`}
              />
              <TextField
                label="Landmark (optional)"
                placeholder="Near KM4, opposite XYZ building"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className={`${FIELD_INTERACTION} sm:col-span-2`}
              />
              <label className="flex items-center gap-2 text-label-sm text-on-surface-variant sm:col-span-2">
                <input type="checkbox" className="size-4 accent-[var(--color-primary)]" />
                Save my information for next time
              </label>
            </div>
          </section>
          )}

          {currentStep === 2 && (
          <section className="order-3 rounded-xl border border-[#e5e0ef] bg-surface-lowest p-3 sm:p-4 lg:order-2">
            <h2 className="text-xl font-bold tracking-tight text-on-surface sm:text-2xl">Payment Method</h2>
            <fieldset className="mt-5 grid gap-3">
              <legend className="sr-only">Choose a payment method</legend>
              {PAYMENT_METHODS.map((payment) => {
                const selected = paymentMethod === payment.id;
                return (
                  <label
                    key={payment.id}
                    className={[
                      "flex cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-colors",
                      selected
                        ? "border-primary bg-primary-container/70"
                        : "border-[#e5e0ef] bg-surface-lowest hover:border-primary",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={payment.id}
                      checked={selected}
                      onChange={() => setPaymentMethod(payment.id)}
                      className="sr-only"
                    />
                    <payment.icon aria-hidden="true" className="size-7 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-body-lg font-bold text-on-surface">{payment.label}</span>
                      <span className="block text-body-md text-on-surface-variant">{payment.description}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={[
                        "grid size-7 shrink-0 place-items-center rounded-full border-2",
                        selected ? "border-primary bg-primary" : "border-outline-variant",
                      ].join(" ")}
                    >
                      {selected && <span className="size-2.5 rounded-full bg-white" />}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </section>
          )}

          {currentStep === 3 && (
          <section className="order-3 rounded-xl border border-[#e5e0ef] bg-surface-lowest p-3 sm:p-4 lg:order-3">
            <h2 className="text-xl font-bold tracking-tight text-on-surface sm:text-2xl">Delivery Method</h2>
            <fieldset className="mt-5 grid gap-3">
              <legend className="sr-only">Choose a delivery method</legend>
              {DELIVERY_METHODS.map((deliveryOption) => {
                const selected = deliveryMethod === deliveryOption.id;
                return (
                  <label
                    key={deliveryOption.id}
                    className={[
                      "flex cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-colors",
                      selected
                        ? "border-primary bg-primary-container/70"
                        : "border-[#e5e0ef] bg-surface-lowest hover:border-primary",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="delivery-method"
                      value={deliveryOption.id}
                      checked={selected}
                      onChange={() => setDeliveryMethod(deliveryOption.id)}
                      className="sr-only"
                    />
                    <deliveryOption.icon aria-hidden="true" className="size-7 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-body-lg font-bold text-on-surface">{deliveryOption.label}</span>
                      <span className="block text-body-md text-on-surface-variant">{deliveryOption.description}</span>
                      <span className="mt-1 flex items-center gap-1 text-body-md font-semibold text-primary">
                        <Clock3 aria-hidden="true" className="size-4" />
                        {deliveryOption.timing}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={[
                        "grid size-7 shrink-0 place-items-center rounded-full border-2",
                        selected ? "border-primary bg-primary" : "border-outline-variant",
                      ].join(" ")}
                    >
                      {selected && <span className="size-2.5 rounded-full bg-white" />}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </section>
          )}

          </div>

        {/* ---------- Summary ---------- */}
        <aside className="order-2 lg:sticky lg:top-6 lg:order-2 lg:self-start">
          <div className="mx-auto w-full rounded-xl border border-outline-variant bg-surface-lowest p-3 lg:max-w-none">
            <h2 className="text-body-lg font-bold">Order ({itemCount} items)</h2>

            <ul className="mt-4 divide-y divide-outline-variant">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.optionName ?? "default"}`} className="flex gap-3 py-3 first:pt-0">
                  <div className="grid size-10 shrink-0 place-items-center rounded bg-surface-container text-label-sm text-on-surface-variant">
                    {line.brand.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-label-sm text-on-surface">{line.name}</p>
                    <p className="text-label-sm text-on-surface-variant">x{line.quantity}</p>
                  </div>
                  <p className="text-label-sm font-semibold tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</p>
                </li>
              ))}
            </ul>

            {loyaltyPoints >= LOYALTY_THRESHOLD && (
              <div className="mt-3 rounded-xl border border-primary/20 bg-primary-container/30 p-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-primary">Loyalty Points</p>
                <p className="mt-1 text-body-lg font-bold text-on-surface">{loyaltyPoints} pts</p>
                <p className="mt-1 text-label-sm text-primary">10% discount is active.</p>
              </div>
            )}

            <dl className="mt-3 flex flex-col gap-2 border-t border-outline-variant pt-3">
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

              {loyaltyDiscount > 0 && (
                <div className="flex justify-between gap-4 text-body-md">
                  <dt className="text-on-surface-variant">Loyalty Discount</dt>
                  <dd className="tabular-nums text-success">-{formatPrice(loyaltyDiscount)}</dd>
                </div>
              )}

              <div className="mt-2 flex justify-between gap-4 border-t border-outline-variant pt-4">
                <dt className="text-headline-md">Total</dt>
                <dd className="text-headline-md tabular-nums text-primary">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Button type="submit" size="md" fullWidth className="mt-5" disabled={submitting}>
              {currentStep < 3 ? "Continue" : submitting ? "Processing…" : "Place Order"}
            </Button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mx-auto mt-3 flex h-11 cursor-pointer items-center gap-1 rounded bg-inverse-surface px-5 text-label-md font-semibold text-white shadow-none hover:bg-primary-hover"
            >
              <ArrowLeft aria-hidden="true" className="size-3" />
              Back to Cart
            </button>
          </div>
        </aside>
        </form>
      </div>
    </div>
  );
}
