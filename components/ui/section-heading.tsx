interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-[#475569] md:text-base">{subtitle}</p> : null}
    </div>
  );
}
