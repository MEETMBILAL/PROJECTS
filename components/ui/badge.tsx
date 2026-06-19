import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors', {
  variants: {
    variant: {
      default: 'border-transparent bg-brand-primary text-white',
      outline: 'border-brand-primary/70 text-brand-accent',
      secondary: 'border-brand-surface bg-brand-cardHover text-brand-secondary',
      new: 'border-transparent bg-brand-new text-white',
      hot: 'border-transparent bg-brand-hot text-white',
      completed: 'border-transparent bg-brand-completed text-white',
      muted: 'border-brand-surface text-brand-muted',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
