import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-purple text-white",
        outline: "border-brand-purple/60 text-brand-purple-light",
        surface: "border-brand-border bg-brand-surface text-brand-text-secondary",
        new: "border-transparent bg-brand-new text-white",
        hot: "border-transparent bg-brand-hot text-white",
        completed: "border-transparent bg-brand-completed text-white",
        gold: "border-transparent bg-brand-gold/15 text-brand-gold",
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
