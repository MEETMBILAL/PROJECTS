import type { ReactNode } from "react";

export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="border-l-[3px] border-brand-primary pl-3 text-xl font-bold text-white sm:text-2xl">{title}</h2>
      {action}
    </div>
  );
}
