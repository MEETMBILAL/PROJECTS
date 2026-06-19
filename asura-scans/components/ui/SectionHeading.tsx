import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  className?: string;
}

export function SectionHeading({ title, className }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        "mb-6 border-l-[3px] border-brand-purple pl-4 text-xl font-bold text-brand-text-primary md:text-2xl",
        className
      )}
    >
      {title}
    </h2>
  );
}
