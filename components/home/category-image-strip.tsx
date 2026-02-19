import Image from "next/image";
import Link from "next/link";
import {
  HOME_CATEGORY_STRIP,
  type HomeCategoryStripItem,
} from "@/lib/data/homeShowcase";

interface CategoryImageStripProps {
  items?: HomeCategoryStripItem[] | null;
}

export function CategoryImageStrip({ items }: CategoryImageStripProps) {
  const categoryItems =
    Array.isArray(items) && items.length > 0 ? items : HOME_CATEGORY_STRIP;

  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-3xl">
            Shop By Category
          </h2>
          <p className="mt-2 text-sm text-[#64748b] md:text-base">
            Explore core product families with fast access to each department.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categoryItems.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="group relative overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm transition hover:border-[#93c5fd] hover:shadow-lg"
          >
            <Image
              src={item.image}
              alt={`${item.label} category`}
              width={1000}
              height={700}
              className="h-32 w-full object-cover transition duration-500 group-hover:scale-110 md:h-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115]/95 via-[#0f1115]/45 to-[#0f1115]/5" />
            <span className="absolute right-3 bottom-3 left-3 text-lg font-bold tracking-tight text-white">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
