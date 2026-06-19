import { cn } from "@/lib/utils";

export function SectionTitle({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex items-center justify-between gap-4", className)}>
      <h2 className="section-heading">{title}</h2>
      {action}
    </div>
  );
}
