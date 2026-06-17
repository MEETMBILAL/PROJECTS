import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "success" | "error" | "muted";

const variants: Record<Variant, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  muted: "bg-surface-alt text-text-secondary",
};

export function Badge({
  children,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span className={cn("badge", variants[variant], className)}>
      {children}
    </span>
  );
}
