import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>>(
  ({ className, sideOffset = 8, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn('z-50 min-w-48 overflow-hidden rounded-xl border border-brand-surface bg-brand-card p-2 text-white shadow-2xl', className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  ),
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Item>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Item ref={ref} className={cn('focus-purple flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-brand-secondary outline-none transition-colors hover:bg-brand-cardHover hover:text-white', className)} {...props} />
  ),
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger };
