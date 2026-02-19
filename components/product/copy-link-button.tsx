"use client";

import { useState } from "react";

interface CopyLinkButtonProps {
  link: string;
}

export function CopyLinkButton({ link }: CopyLinkButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm text-[#334155] transition hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
      >
        Copy product link
      </button>
      <span role="status" className="text-xs text-[#64748b]">
        {status === "copied" ? "Link copied" : null}
        {status === "error" ? "Could not copy link" : null}
      </span>
    </div>
  );
}
