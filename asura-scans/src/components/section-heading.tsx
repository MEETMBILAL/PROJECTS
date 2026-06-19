import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionHeading({ children, className, id }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className={cn(
        "text-xl md:text-2xl font-bold text-brand-text-primary border-l-[3px] border-brand-purple pl-3 mb-6",
        className
      )}
    >
      {children}
    </h2>
  );
}
