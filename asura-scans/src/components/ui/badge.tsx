import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-purple text-white",
        outline: "border border-brand-purple text-brand-purple bg-transparent",
        new: "bg-brand-new text-white",
        hot: "bg-brand-hot text-white",
        completed: "bg-brand-completed text-white",
        secondary: "bg-brand-card text-brand-secondary",
        muted: "bg-brand-surface text-brand-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
