import { STORE_ANNOUNCEMENT } from "@/lib/constants/store";

export function AnnouncementBar() {
  return (
    <div className="border-b border-[#2a2f39] bg-[#0d2238] px-4 py-2 text-center text-xs font-medium tracking-wide text-[#d8e6f5]">
      {STORE_ANNOUNCEMENT}
    </div>
  );
}
