import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-studio-accent focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-100 text-studio-text hover:bg-slate-200',
        outline: 'text-studio-text border-studio-border',
        accent: 'border-transparent bg-studio-highlight text-studio-accent font-medium',
        gcp: 'border-blue-200 bg-blue-50 text-blue-700',
        aws: 'border-amber-200 bg-amber-50 text-amber-800',
        azure: 'border-sky-200 bg-sky-50 text-sky-800',
        oci: 'border-red-200 bg-red-50 text-red-800',
        cloudflare: 'border-orange-200 bg-orange-50 text-orange-800',
        hostinger: 'border-purple-200 bg-purple-50 text-purple-800',
        supabase: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        custom: 'border-gray-200 bg-gray-100 text-gray-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
