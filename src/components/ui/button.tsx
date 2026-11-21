import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-btn text-sm font-medium transition-all duration-fast ease-out-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:translate-y-px',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-hover shadow-2xs',
        secondary: 'bg-surface-muted text-foreground hover:bg-border/60 border border-border shadow-2xs',
        outline: 'border border-border bg-surface hover:bg-surface-muted text-foreground shadow-2xs',
        ghost: 'hover:bg-surface-muted text-foreground',
        destructive: 'bg-destructive text-white hover:bg-destructive-hover shadow-2xs',
        accentSubtle: 'bg-primary-soft text-primary hover:bg-primary-soft/80 border border-primary/20',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-btn px-3 text-xs',
        lg: 'h-10 rounded-btn px-6 text-sm',
        icon: 'h-9 w-9 p-0',
        iconSm: 'h-7 w-7 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
