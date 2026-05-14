import { Button } from "@/components/ui/button";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  cta?: string;
}

export function SectionHeading({ eyebrow, title, description, cta }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">{eyebrow}</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      </div>
      {cta ? (
        <Button variant="outline" className="rounded-2xl border-[#d7e5df] bg-white px-4 text-slate-700">
          {cta}
        </Button>
      ) : null}
    </div>
  );
}
