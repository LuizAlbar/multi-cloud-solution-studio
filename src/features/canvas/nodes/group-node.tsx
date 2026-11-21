import React, { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
import type { ProviderId } from '@/lib/schemas';
import { cn } from '@/lib/utils';

export interface GroupNodeData {
  label: string;
  providerId?: ProviderId;
  region?: string;
  color?: string;
}

const ZONE_THEMES: Record<
  string,
  { bg: string; border: string; headerText: string }
> = {
  gcp: {
    bg: 'bg-blue-50/20',
    border: 'border-blue-300',
    headerText: 'text-blue-900',
  },
  aws: {
    bg: 'bg-amber-50/20',
    border: 'border-amber-300',
    headerText: 'text-amber-900',
  },
  azure: {
    bg: 'bg-sky-50/20',
    border: 'border-sky-300',
    headerText: 'text-sky-900',
  },
  oci: {
    bg: 'bg-red-50/20',
    border: 'border-red-300',
    headerText: 'text-red-900',
  },
  cloudflare: {
    bg: 'bg-orange-50/20',
    border: 'border-orange-300',
    headerText: 'text-orange-900',
  },
  hostinger: {
    bg: 'bg-purple-50/20',
    border: 'border-purple-300',
    headerText: 'text-purple-900',
  },
  supabase: {
    bg: 'bg-emerald-50/20',
    border: 'border-emerald-300',
    headerText: 'text-emerald-900',
  },
  custom: {
    bg: 'bg-slate-50/40',
    border: 'border-slate-300',
    headerText: 'text-slate-800',
  },
};

export const GroupNode = memo(function GroupNode({
  data,
  selected,
}: NodeProps) {
  const groupData = data as unknown as GroupNodeData;
  const label = groupData?.label || 'Zona / Ambiente';
  const provider = groupData?.providerId || 'custom';
  const region = groupData?.region;

  const theme = ZONE_THEMES[provider] || ZONE_THEMES.custom;

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Zona ${label}`}
      className={cn(
        'relative min-w-[360px] min-h-[220px] rounded-2xl border-2 border-dashed p-4 select-none transition-all',
        theme.bg,
        selected
          ? 'border-primary ring-2 ring-primary/20 shadow-sm'
          : theme.border
      )}
    >
      {/* Zone Header */}
      <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-dashed border-slate-200/80 pointer-events-none">
        <div className="flex items-center gap-2">
          {provider !== 'custom' && (
            <ProviderIcon providerId={provider} size={16} />
          )}
          <span className={cn('text-xs font-bold tracking-tight', theme.headerText)}>
            {label}
          </span>
        </div>

        {region && (
          <span className="text-[11px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
            {region}
          </span>
        )}
      </div>
    </div>
  );
});
