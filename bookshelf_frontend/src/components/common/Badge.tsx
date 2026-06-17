import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "success" | "error" | "muted";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-surface",
  secondary: "bg-secondary text-primary-dark",
  success: "bg-success/15 text-success",
  error: "bg-error text-white",
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
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
