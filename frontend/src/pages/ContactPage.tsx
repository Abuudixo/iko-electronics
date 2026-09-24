import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const contactDetails = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+252 600 000 000",
    className: "bg-[#34c759] text-white",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+252 600 000 000",
    className: "bg-[#f39ad7] text-white",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@ikoelectronics.so",
    className: "bg-[#c8d0dd] text-[#0e2043]",
  },
  {
    icon: MapPin,
    label: "Store Location",
    value: "Hamar Weyne District, Mogadishu",
    className: "bg-[#f5bfbc] text-white",
  },
  {
    icon: Clock3,
    label: "Opening Hours",
    value: "Daily: 8:00 AM – 8:00 PM",
    className: "bg-[#d1c4f5] text-[#0e2043]",
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full items-center justify-center px-3 py-5 sm:px-4 md:px-6 lg:py-8">
      <div className="w-full max-w-[540px] sm:max-w-[580px] md:max-w-[620px]">
        <header className="mb-4 text-center sm:mb-5">
          <h1 className="font-display text-[1.8rem] font-bold tracking-[-0.05em] text-on-surface sm:text-[2.1rem] md:text-[2.4rem]">
            Contact Us
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-xs text-on-surface-variant sm:text-sm md:text-base">
            We&apos;re here to help. Reach out through any of the channels below or send us a message.
          </p>
        </header>

        <section className="rounded-[1.35rem] border border-[#e4e7ee] bg-[#f8f9fb] p-3 sm:p-4 md:p-5">
          <h2 className="mb-4 text-[1.4rem] font-bold tracking-[-0.04em] text-on-surface sm:text-[1.5rem] md:text-[1.6rem]">
            Get In Touch
          </h2>

          <div className="space-y-2.5 sm:space-y-3.5">
            {contactDetails.map(({ icon: Icon, label, value, className }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-lg border border-[#edf0f5] bg-white px-2.5 py-2 sm:gap-3.5 sm:px-3.5 sm:py-2.5"
              >
                <div
                  className={`grid size-8 shrink-0 place-items-center rounded-lg sm:size-11 ${className}`}
                  aria-hidden="true"
                >
                  <Icon className="size-3.5 sm:size-4.5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-on-surface sm:text-base">{label}</p>
                  <p className="text-[11px] text-on-surface-variant sm:text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-5 overflow-hidden rounded-[1.1rem] border border-[#dfe4ed] bg-white">
            <iframe
              title="IKO Electronics Store location"
              src="https://www.google.com/maps?q=Hamar%20Weyne%20District%2C%20Mogadishu&z=13&output=embed"
              className="h-[180px] w-full border-0 sm:h-[200px] md:h-[220px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="rounded-b-[1.1rem] bg-white px-4 py-3 text-center">
              <p className="text-sm font-bold text-on-surface sm:text-base">IKO Electronics Store</p>
              <p className="mt-1 text-xs text-on-surface-variant sm:text-sm">Hamar Weyne District, Mogadishu</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
