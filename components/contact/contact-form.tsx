"use client";

import { FormEvent, useState } from "react";
import { STORE_EMAIL, STORE_NAME } from "@/lib/constants/store";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "General inquiry").trim();
    const message = String(formData.get("message") ?? "").trim();

    const mailSubject = `[${STORE_NAME}] ${subject}`;
    const mailBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm"
      aria-label="Contact form"
    >
      <h2 className="text-2xl font-semibold text-[#0f172a]">Send us a message</h2>
      <p className="mt-2 text-sm text-[#64748b]">We usually reply within business hours.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm text-[#334155]">
          Full Name
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-[#0f172a] placeholder:text-[#94a3b8]"
            placeholder="Your name"
          />
        </label>

        <label className="text-sm text-[#334155]">
          Email
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-[#0f172a] placeholder:text-[#94a3b8]"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm text-[#334155]">
        Subject
        <input
          type="text"
          name="subject"
          required
          className="mt-1 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-[#0f172a] placeholder:text-[#94a3b8]"
          placeholder="How can we help?"
        />
      </label>

      <label className="mt-4 block text-sm text-[#334155]">
        Message
        <textarea
          name="message"
          rows={6}
          required
          className="mt-1 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-[#0f172a] placeholder:text-[#94a3b8]"
          placeholder="Tell us what you need..."
        />
      </label>

      <button
        type="submit"
        className="mt-5 inline-flex rounded-lg bg-[#0b2a4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12395f]"
      >
        Send via Email
      </button>

      {submitted ? <p className="mt-3 text-sm text-[#93d3b0]">Email client opened with your message.</p> : null}
    </form>
  );
}
