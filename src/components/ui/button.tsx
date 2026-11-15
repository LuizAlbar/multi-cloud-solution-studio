import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-btn text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-studio-accent text-white hover:bg-studio-accent-hover shadow-sm',
        secondary: 'bg-slate-100 text-studio-text hover:bg-slate-200 border border-studio-border',
        outline: 'border border-studio-border bg-white hover:bg-slate-50 text-studio-text',
        ghost: 'hover:bg-slate-100 text-studio-text',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        accentSubtle: 'bg-studio-highlight text-studio-accent hover:bg-blue-100 border border-blue-200',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-btn px-3 text-xs',
        lg: 'h-10 rounded-btn px-6 text-base',
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
