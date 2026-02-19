import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import {
  STORE_DOMAIN,
  STORE_EMAIL,
  STORE_NAME,
  STORE_PHONE_LOCAL,
  STORE_URL,
} from "@/lib/constants/store";
import { createSupportWhatsAppLink } from "@/lib/utils/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${STORE_NAME} for product inquiries, support, and WhatsApp orders.`,
  alternates: {
    canonical: `${STORE_URL}/contact`,
  },
};

const contactCards = [
  {
    title: "WhatsApp / Phone",
    value: STORE_PHONE_LOCAL,
    href: `tel:${STORE_PHONE_LOCAL}`,
  },
  {
    title: "Email",
    value: STORE_EMAIL,
    href: `mailto:${STORE_EMAIL}`,
  },
  {
    title: "Domain",
    value: STORE_DOMAIN,
    href: STORE_URL,
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-[#0f172a] md:text-4xl">Contact {STORE_NAME}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#475569] md:text-base">
          Reach us for product availability, purchase support, and technical guidance.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {contactCards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition hover:border-[#93c5fd]"
          >
            <h2 className="text-sm font-medium uppercase tracking-wide text-[#64748b]">{card.title}</h2>
            <p className="mt-2 text-lg font-semibold text-[#0f172a]">{card.value}</p>
          </a>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <ContactForm />

        <aside className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0f172a]">WhatsApp Quick Action</h2>
          <p className="mt-3 text-sm leading-6 text-[#475569]">
            Need a fast response? Start a direct conversation with our team on WhatsApp.
          </p>
          <a
            href={createSupportWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-lg bg-[#0b2a4a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#154572]"
          >
            Chat on WhatsApp
          </a>
        </aside>
      </section>
    </div>
  );
}
