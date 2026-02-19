import { createSupportWhatsAppLink } from "@/lib/utils/whatsapp";
import { STORE_NAME } from "@/lib/constants/store";

export function FloatingWhatsAppButton() {
  return (
    <a
      href={createSupportWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${STORE_NAME} on WhatsApp`}
      className="fixed right-5 bottom-5 z-50 inline-flex items-center gap-2 rounded-full border border-[#1f5032] bg-[#1faa55] px-4 py-3 text-sm font-semibold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8ee4b3]"
    >
      <span aria-hidden="true">WhatsApp</span>
      <span className="hidden sm:inline">Support</span>
    </a>
  );
}
