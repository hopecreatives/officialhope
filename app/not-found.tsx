import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center shadow-sm">
      <h1 className="text-3xl font-semibold text-[#0f172a]">Page Not Found</h1>
      <p className="mt-3 text-sm text-[#64748b]">
        The page you requested does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-[#0b2a4a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#154572]"
      >
        Back to Home
      </Link>
    </section>
  );
}
