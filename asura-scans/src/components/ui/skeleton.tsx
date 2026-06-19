import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-cover bg-brand-card-hover",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
