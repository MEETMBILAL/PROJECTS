import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors duration-150",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-purple text-white",
        outline: "border-brand-purple text-brand-purple-light bg-transparent",
        new: "border-transparent bg-brand-new text-white",
        hot: "border-transparent bg-brand-hot text-white",
        completed: "border-transparent bg-brand-completed text-white",
        ongoing: "border-transparent bg-brand-new text-white",
        hiatus: "border-transparent bg-amber-500 text-black",
        type: "border-brand-surface bg-brand-card text-brand-text-secondary",
        gold: "border-transparent bg-black/70 text-brand-gold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
