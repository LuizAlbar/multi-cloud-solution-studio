import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default: 'border-border bg-surface-muted text-foreground hover:bg-border/40',
        outline: 'text-foreground border-border bg-surface',
        accent: 'border-primary/20 bg-primary-soft text-primary font-medium',
        gcp: 'border-blue-200/80 bg-blue-50/80 text-blue-800',
        aws: 'border-amber-200/80 bg-amber-50/80 text-amber-900',
        azure: 'border-sky-200/80 bg-sky-50/80 text-sky-900',
        oci: 'border-red-200/80 bg-red-50/80 text-red-900',
        cloudflare: 'border-orange-200/80 bg-orange-50/80 text-orange-900',
        hostinger: 'border-purple-200/80 bg-purple-50/80 text-purple-900',
        supabase: 'border-emerald-200/80 bg-emerald-50/80 text-emerald-900',
        custom: 'border-border bg-surface-muted text-foreground',
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
