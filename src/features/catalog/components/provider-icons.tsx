import React from 'react';
import type { ProviderId } from '@/lib/schemas';
import { Server } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderIconProps {
  providerId: ProviderId;
  className?: string;
  size?: number;
}

export const PROVIDER_ICON_ASSETS: Record<ProviderId, string> = {
  gcp: '/gcp-icon.svg',
  aws: '/aws-icon.svg',
  azure: '/azure-icon.svg',
  oci: '/oracle-icon.svg',
  cloudflare: '/cloudflare-icon.svg',
  hostinger: '/hostinger-icon.svg',
  supabase: '/supabase-icon.svg',
  custom: '',
};

export function ProviderIcon({
  providerId,
  className = 'w-5 h-5',
  size = 20,
}: ProviderIconProps) {
  const iconSrc = PROVIDER_ICON_ASSETS[providerId];

  if (iconSrc) {
    return (
      <img
        src={iconSrc}
        alt={providerId}
        width={size}
        height={size}
        className={cn('object-contain shrink-0 select-none', className)}
        loading="lazy"
      />
    );
  }

  return <Server className={cn('text-slate-500 shrink-0 select-none', className)} size={size} />;
}
