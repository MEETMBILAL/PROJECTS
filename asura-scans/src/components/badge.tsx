import { cn } from "@/lib/utils";
import { ComicStatus } from "@prisma/client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "new" | "hot" | "completed" | "status" | "default";
  status?: ComicStatus;
  className?: string;
}

export function Badge({ children, variant = "default", status, className }: BadgeProps) {
  const variants = {
    new: "bg-brand-badge-new text-white",
    hot: "bg-brand-badge-hot text-white",
    completed: "bg-brand-badge-completed text-white",
    status:
      status === "ONGOING"
        ? "bg-brand-badge-new/20 text-brand-badge-new border border-brand-badge-new/30"
        : status === "COMPLETED"
          ? "bg-brand-badge-completed/20 text-brand-badge-completed border border-brand-badge-completed/30"
          : "bg-brand-muted/20 text-brand-text-secondary border border-brand-muted/30",
    default: "bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variants[variant === "status" && status ? "status" : variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function GenreBadge({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border border-brand-purple/50 px-3 py-1 text-xs text-brand-purple-light transition-all duration-150 hover:bg-brand-purple/10 hover:border-brand-purple",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Comp>
  );
}
