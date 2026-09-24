import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Hand, Heart, LogOut, MapPin, MessageCircle, Package, ShieldCheck, Star, User } from "lucide-react";
import Button from "@/components/ui/Button";

const PROFILE_STORAGE_KEY = "iko.customer.profile.v1";
const LOYALTY_THRESHOLD = 250;

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

function readProfile(): CustomerProfile {
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

export default function AccountPage() {
  const savedProfile = useMemo(() => readProfile(), []);
  const [identifier, setIdentifier] = useState(savedProfile.phone || savedProfile.email || "");
  const [profile, setProfile] = useState<CustomerProfile>(savedProfile);
  const [signedIn, setSignedIn] = useState(Boolean(savedProfile.phone || savedProfile.email));
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [orderNotice, setOrderNotice] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressNotice, setAddressNotice] = useState("");
  const [message, setMessage] = useState("Sign in with your WhatsApp number or email to view your profile and loyalty rewards.");

  useEffect(() => {
    if (!signedIn) return;
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // storage can fail; UI still works without persistence.
    }
  }, [profile, signedIn]);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const value = identifier.trim();
    if (!value) {
      setMessage("Please enter your WhatsApp number or email.");
      return;
    }

    const asEmail = value.includes("@");
    const normalized = asEmail ? value.toLowerCase() : value;

    const matched =
      (savedProfile.email && savedProfile.email.toLowerCase() === normalized) ||
      (savedProfile.phone && savedProfile.phone.replace(/\s+/g, "") === normalized.replace(/\s+/g, ""));

    if (matched) {
      setProfile(savedProfile);
      setSignedIn(true);
      setMessage("Welcome back. Your loyalty profile is ready.");
      return;
    }

    const nextProfile: CustomerProfile = {
      ...savedProfile,
      fullName: savedProfile.fullName || "Customer",
      phone: asEmail ? savedProfile.phone : normalized,
      email: asEmail ? normalized : savedProfile.email,
      loyaltyPoints: savedProfile.loyaltyPoints,
    };

    setProfile(nextProfile);
    setSignedIn(true);
    setMessage("Your profile has been created. You can continue shopping and earn loyalty points.");
  }

  const pointsLeft = Math.max(0, LOYALTY_THRESHOLD - profile.loyaltyPoints);

  const userName = profile.fullName || "Mohamed Ali";

  const stats = [
    { label: "Total Orders", value: 8, icon: <Package aria-hidden="true" className="size-5 text-[#1a2333]" />, bg: "bg-[#f0f0f2]" },
    { label: "IKO Points", value: 420, icon: <Star aria-hidden="true" className="size-5 text-[#f2b500]" />, bg: "bg-[#f5f0d9]" },
    { label: "Wishlist Items", value: 5, icon: <Heart aria-hidden="true" className="size-5 text-[#ff5b74]" />, bg: "bg-[#fbe5eb]" },
  ];

  const recentOrders = [
    { id: "IKO-483921", date: "Aug 12, 2026", items: 2, total: "$388", status: "Delivered" },
    { id: "IKO-476203", date: "Jul 28, 2026", items: 1, total: "$35", status: "Delivered" },
    { id: "IKO-461095", date: "Jul 03, 2026", items: 3, total: "$527", status: "Delivered" },
  ];

  const pointsHistory = [
    { label: "Order #IKO-483921", date: "Aug 12, 2026", points: "+150 pts", positive: true },
    { label: "Order #IKO-476203", date: "Jul 28, 2026", points: "+20 pts", positive: true },
    { label: "Points Redeemed", date: "Jul 15, 2026", points: "-50 pts", positive: false },
    { label: "Order #IKO-461095", date: "Jul 03, 2026", points: "+300 pts", positive: true },
  ];

  function handleLogout() {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    setProfile({ fullName: "", phone: "", email: "", city: "", district: "", address: "", landmark: "", loyaltyPoints: 0 });
    setIdentifier("");
    setSignedIn(false);
    setActiveSection("Dashboard");
    setMessage("Sign in with your WhatsApp number or email to view your profile and loyalty rewards.");
  }

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-[420px] px-4 py-8">
        <form onSubmit={handleSignIn} className="rounded-[1.1rem] border border-[#e4e3eb] bg-white p-5 shadow-[0_6px_18px_rgba(17,24,39,0.04)]">
          <h1 className="text-xl font-bold text-[#253052]">Sign in to your account</h1>
          <p className="mt-2 text-sm text-[#78809a]">{message}</p>
          <label htmlFor="account-identifier" className="mt-5 block text-sm font-bold text-[#253052]">WhatsApp number or email</label>
          <input
            id="account-identifier"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-[#c8ccda] px-3 text-sm outline-none focus:border-[#6f4a9b]"
            placeholder="Enter your WhatsApp number or email"
          />
          <Button type="submit" fullWidth className="mt-4">Sign In</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[420px] px-4 py-5 lg:grid lg:max-w-(--container-page) lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-8">
      <div className="rounded-[1.1rem] border border-[#e4e3eb] bg-white p-3 shadow-[0_6px_18px_rgba(17,24,39,0.04)] lg:col-start-1 lg:row-span-4">
        <div className="flex items-center gap-3 border-b border-[#eceaf0] px-1 pb-4">
          <div className="grid size-10 place-items-center rounded-full bg-[#eee7f8] text-[#4c2b77]">
            <User aria-hidden="true" className="size-5" />
          </div>
          <div>
            <div className="text-[0.9rem] font-bold text-[#253052]">{userName}</div>
            <div className="mt-1 text-[0.68rem] text-[#78809a]">{profile.phone || "+252 61 234 5678"}</div>
          </div>
        </div>

        <nav className="mt-3 space-y-1">
          {[
            { label: "Dashboard", icon: <ShieldCheck aria-hidden="true" className="size-3.5" /> },
            { label: "My Orders", icon: <Package aria-hidden="true" className="size-3.5" />, active: false },
            { label: "IKO Points", icon: <Star aria-hidden="true" className="size-3.5 text-[#f2b500]" />, active: false },
            { label: "Profile", icon: <User aria-hidden="true" className="size-3.5" />, active: false },
            { label: "Addresses", icon: <MapPin aria-hidden="true" className="size-3.5 text-[#e84586]" />, active: false },
          ].map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveSection(label)}
              className={`flex h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-[0.76rem] font-medium text-white ${activeSection === label ? "bg-primary" : "bg-inverse-surface/80 hover:bg-primary-hover"}`}
            >
              {icon}
              {label}
            </button>
          ))}
          <div className="my-2 border-t border-[#eceaf0]" />
          <Button type="button" variant="danger" fullWidth onClick={handleLogout} className="justify-start px-3 text-left text-[0.76rem]">
            <LogOut aria-hidden="true" className="size-3.5" />
            Logout
          </Button>
        </nav>
      </div>

      <div className="mt-5 rounded-[1.1rem] bg-[#25386f] px-4 py-5 text-white shadow-[0_8px_18px_rgba(37,56,111,0.18)] lg:col-start-2 lg:row-start-1 lg:mt-0 lg:px-8 lg:py-8">
        <div className="text-[0.72rem] text-white/75">Welcome back</div>
        <div className="mt-1 flex items-center gap-2 text-[1.25rem] font-black">{userName} <Hand aria-hidden="true" className="size-5 text-white/80" /></div>
        <div className="mt-1 text-[0.68rem] font-medium text-white/80">Member since July 2026</div>
      </div>

      {activeSection !== "Dashboard" && (
        <section className="mt-5 rounded-[1.1rem] border border-[#e4e3eb] bg-white p-4 shadow-[0_6px_18px_rgba(17,24,39,0.04)] lg:col-start-2 lg:row-start-2 lg:p-7">
          <h2 className="text-base font-bold text-[#253052]">{activeSection}</h2>
          {activeSection === "My Orders" && (
            <div className="mt-4 space-y-2">
              {recentOrders.map((order) => (
                <article key={order.id} className="rounded-xl border border-[#e8e0ef] bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[0.82rem] font-bold text-[#253052]">{order.id}</div>
                      <div className="mt-1 text-[0.68rem] text-[#6f7690]">{order.date}</div>
                    </div>
                    <span className="rounded-full bg-[#e8fff1] px-2 py-1 text-[0.62rem] font-semibold text-[#1ea76b]">{order.status}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[0.72rem] text-[#4d5874]">
                    <span>{order.items} items</span>
                    <strong className="text-[0.82rem] text-[#253052]">{order.total}</strong>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button type="button" size="md" onClick={() => setOrderNotice(`${order.id} has been delivered.`)} className="h-9 px-3 text-[0.64rem]">Track Order</Button>
                    <Button type="button" size="md" variant="secondary" onClick={() => setOrderNotice(`${order.id}: ${order.items} items, total ${order.total}.`)} className="h-9 px-3 text-[0.64rem]">View Details</Button>
                  </div>
                </article>
              ))}
              {orderNotice && <p className="rounded-lg bg-[#f3eff9] px-3 py-2 text-[0.68rem] text-[#5e3b77]">{orderNotice}</p>}
            </div>
          )}
          {activeSection === "IKO Points" && (
            <div className="mt-4">
              <div className="rounded-xl bg-[#713892] px-4 py-4 text-white">
                <div className="text-[0.68rem] font-medium text-white/85">Your Balance</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <strong className="text-3xl leading-none">{profile.loyaltyPoints || 420}</strong>
                  <span className="text-base text-white/85">IKO Points</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/30"><div className="h-full w-[68%] rounded-full bg-white" /></div>
                <div className="mt-2 text-[0.67rem] text-white/90">Earn {Math.max(pointsLeft, 80)} more points to unlock your next reward!</div>
              </div>

              <div className="mt-4 rounded-xl border border-[#e8e0ef] px-3 py-3">
                <h3 className="text-[0.9rem] font-bold text-[#253052]">Points History</h3>
                <div className="mt-3 divide-y divide-[#f0edf3]">
                  {pointsHistory.map((entry) => (
                    <div key={`${entry.label}-${entry.date}`} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <div className="text-[0.72rem] font-semibold text-[#253052]">{entry.label}</div>
                        <div className="mt-0.5 text-[0.64rem] text-[#78809a]">{entry.date}</div>
                      </div>
                      <strong className={`text-[0.7rem] ${entry.positive ? "text-[#12a85c]" : "text-[#e23d4d]"}`}>{entry.points}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeSection === "Profile" && (
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setProfileNotice("Your profile has been saved.");
              }}
            >
              {[
                { key: "fullName", label: "Full Name", placeholder: "Enter your full name" },
                { key: "phone", label: "WhatsApp Number", placeholder: "Enter your WhatsApp number" },
                { key: "email", label: "Email", placeholder: "Enter your email" },
                { key: "city", label: "City", placeholder: "Enter your city" },
              ].map(({ key, label, placeholder }) => (
                <label key={key} className="block text-[0.7rem] font-bold text-[#253052]">
                  {label}
                  <input
                    value={profile[key as keyof CustomerProfile] as string}
                    onChange={(event) => setProfile((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder={placeholder}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#ded6e7] bg-white px-3 text-[0.72rem] font-medium text-[#253052] outline-none focus:border-[#713892]"
                  />
                </label>
              ))}
              <Button type="submit">Save Changes</Button>
              {profileNotice && <p className="text-[0.68rem] font-medium text-[#1ea76b]">{profileNotice}</p>}
            </form>
          )}
          {activeSection === "Addresses" && (
            <div className="mt-4">
              <div className="rounded-xl border-2 border-[#a96ecb] px-3 py-3 text-[0.7rem] text-[#4d5874]">
                <div className="flex items-start justify-between gap-2">
                  <strong className="font-bold text-[#253052]">{profile.fullName || "Mohamed Ali Hassan"}</strong>
                  <span className="rounded-full bg-[#8142a6] px-2 py-0.5 text-[0.58rem] font-semibold text-white">Default</span>
                </div>
                <div className="mt-1 leading-4">{profile.district || "Hodan District"}, {profile.city || "Mogadishu"}<br />{profile.address || "Near KM4 roundabout"}<br />{profile.phone || "+252 61 234 5678"}</div>
              </div>

              {!showAddressForm && (
                <Button
                  type="button"
                  fullWidth
                  onClick={() => { setShowAddressForm(true); setAddressNotice(""); }}
                  className="mt-2"
                >
                  + Add New Address
                </Button>
              )}

              {showAddressForm && (
                <form
                  className="mt-3 space-y-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setShowAddressForm(false);
                    setAddressNotice("Address saved as your default address.");
                  }}
                >
                  <input value={profile.district} onChange={(event) => setProfile((current) => ({ ...current, district: event.target.value }))} placeholder="District" className="h-9 w-full rounded-lg border border-[#ded6e7] px-3 text-xs outline-none focus:border-[#713892]" />
                  <input value={profile.city} onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))} placeholder="City" className="h-9 w-full rounded-lg border border-[#ded6e7] px-3 text-xs outline-none focus:border-[#713892]" />
                  <input value={profile.address} onChange={(event) => setProfile((current) => ({ ...current, address: event.target.value }))} placeholder="Street or landmark" className="h-9 w-full rounded-lg border border-[#ded6e7] px-3 text-xs outline-none focus:border-[#713892]" />
                  <div className="flex gap-2 pt-1">
                    <Button type="submit" size="md" className="h-9 px-3 text-xs">Save Address</Button>
                    <Button type="button" size="md" variant="secondary" onClick={() => setShowAddressForm(false)} className="h-9 px-3 text-xs">Cancel</Button>
                  </div>
                </form>
              )}
              {addressNotice && <p className="mt-2 text-[0.68rem] font-medium text-[#1ea76b]">{addressNotice}</p>}
            </div>
          )}
        </section>
      )}

      {activeSection === "Dashboard" && <div className="mt-5 rounded-[1.1rem] bg-[#f2f2f4] p-3 shadow-[0_6px_18px_rgba(17,24,39,0.04)] lg:col-start-2 lg:row-start-2 lg:bg-transparent lg:p-0 lg:shadow-none">
        <div className="grid grid-cols-3 gap-2 lg:gap-4">
          {stats.map(({ label, value, icon, bg }) => (
            <div key={label} className={`${bg} rounded-[0.9rem] border border-[#ececef] p-3 lg:bg-white lg:p-6`}>
              <div className="flex items-center justify-center rounded-full bg-white/80 p-2 shadow-sm shadow-black/5">
                {icon}
              </div>
              <div className="mt-3 text-center text-2xl font-bold tracking-[-0.04em] text-[#1a2333]">{value}</div>
              <div className="mt-1 text-center text-[0.7rem] font-medium leading-tight text-[#4c5467]">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 lg:mt-6 lg:rounded-[1.1rem] lg:border lg:border-[#e4e3eb] lg:bg-white lg:p-7">
          <div className="mb-3 text-[0.96rem] font-bold text-[#1a2333]">Recent Orders</div>

          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm shadow-black/5">
                <div>
                  <div className="text-[0.9rem] font-bold text-[#1a2333]">{order.id}</div>
                  <div className="mt-1 text-[0.7rem] text-[#5c6475]">
                    {order.date} · {order.items} items
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[0.98rem] font-bold text-[#1a2333]">{order.total}</div>
                  <div className="mt-1 text-[0.72rem] font-medium text-[#1ea76b]">{order.status}</div>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" onClick={() => setActiveSection("My Orders")} className="mt-4">
            View all orders
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>}

      <div className="fixed bottom-5 right-5 z-20">
        <a
          href="https://wa.me/000000000"
          aria-label="WhatsApp"
          className="grid size-12 place-items-center rounded-full bg-[#2ecb6d] text-white shadow-[0_10px_18px_rgba(46,203,109,0.38)] transition-transform hover:scale-105"
        >
          <MessageCircle aria-hidden="true" className="size-6" />
        </a>
      </div>
    </div>
  );
}
