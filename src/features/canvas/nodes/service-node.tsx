import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { ServiceIcon } from '@/features/catalog/components/service-icons';
import type { ProviderId, ServiceCategory } from '@/lib/schemas';
import { cn } from '@/lib/utils';

export interface ServiceNodeData {
  label: string;
  serviceName?: string;
  serviceId?: string;
  providerId?: ProviderId;
  category?: ServiceCategory;
  notes?: string;
  properties?: Record<string, unknown>;
}

export const ServiceNode = memo(function ServiceNode({
  data,
  selected,
}: NodeProps) {
  const nodeData = data as unknown as ServiceNodeData;
  const provider = nodeData.providerId || 'custom';
  const category = nodeData.category || 'compute';
  const iconKey = nodeData.serviceId || `${provider}-${category}`;
  const label = nodeData.label || nodeData.serviceName || 'Cloud Service';

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Serviço ${label}, provedor ${provider}`}
      className={cn(
        'group relative w-[184px] rounded-card border bg-white p-2.5 shadow-2xs transition-all select-none',
        selected
          ? 'border-studio-accent ring-2 ring-studio-accent/25 shadow-sm'
          : 'border-studio-border hover:border-slate-300 hover:shadow-xs'
      )}
    >
      {/* 4 Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className={cn(
          '!w-3 !h-3 !bg-studio-accent !border-2 !border-white !z-30 transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className={cn(
          '!w-3 !h-3 !bg-studio-accent !border-2 !border-white !z-30 transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className={cn(
          '!w-3 !h-3 !bg-studio-accent !border-2 !border-white !z-30 transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className={cn(
          '!w-3 !h-3 !bg-studio-accent !border-2 !border-white !z-30 transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className={cn(
          '!w-3 !h-3 !bg-studio-accent !border-2 !border-white !z-30 transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className={cn(
          '!w-3 !h-3 !bg-studio-accent !border-2 !border-white !z-30 transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className={cn(
          '!w-3 !h-3 !bg-studio-accent !border-2 !border-white !z-30 transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className={cn(
          '!w-3 !h-3 !bg-studio-accent !border-2 !border-white !z-30 transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />

      {/* Header with Specific Service Icon and Provider Badge */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <ServiceIcon
            iconKey={iconKey}
            providerId={provider}
            category={category}
            size={22}
            className="shrink-0"
          />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-studio-secondary truncate">
            {provider}
          </span>
        </div>
        {nodeData.category && (
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-slate-200">
            {nodeData.category}
          </Badge>
        )}
      </div>

      {/* Service Name & Label */}
      <div className="space-y-0.5">
        <div className="text-xs font-bold text-studio-text leading-tight line-clamp-2">
          {label}
        </div>
        {nodeData.serviceName && nodeData.serviceName !== label && (
          <div className="text-[10px] text-studio-secondary truncate">
            {nodeData.serviceName}
          </div>
        )}
      </div>
    </div>
  );
});
