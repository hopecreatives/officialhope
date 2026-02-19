import type { Metadata } from "next";
import { STORE_NAME, STORE_URL } from "@/lib/constants/store";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${STORE_NAME} and our approach to premium camera gear and electronics.`,
  alternates: {
    canonical: `${STORE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm md:p-10">
      <h1 className="text-3xl font-semibold text-[#0f172a] md:text-4xl">About {STORE_NAME}</h1>
      <p className="mt-5 text-sm leading-7 text-[#475569] md:text-base">
        {STORE_NAME} was created to serve photographers, filmmakers, content creators, and businesses looking for dependable technology products in Rwanda. We focus on practical, proven gear from trusted brands and guide customers toward solutions that match their workflow and budget.
      </p>
      <p className="mt-4 text-sm leading-7 text-[#475569] md:text-base">
        Our catalog includes cameras, lenses, stabilization tools, lighting, audio recorders, and Apple devices. We prioritize clear communication, transparent pricing, and responsive support before and after every purchase.
      </p>
      <p className="mt-4 text-sm leading-7 text-[#475569] md:text-base">
        As {STORE_NAME} grows, our goal remains simple: deliver professional gear with confidence, speed, and service quality customers can trust.
      </p>
    </article>
  );
}
