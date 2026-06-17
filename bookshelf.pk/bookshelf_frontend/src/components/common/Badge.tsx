import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "secondary" | "success" | "error" | "muted";

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  success: "bg-success text-white",
  error: "bg-error text-white",
  muted: "bg-surface-alt text-ink-secondary border border-border",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "primary", className }: BadgeProps) {
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
