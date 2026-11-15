import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
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
  const label = nodeData.label || nodeData.serviceName || 'Cloud Service';

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Serviço ${label}, provedor ${provider}`}
      className={cn(
        'group relative w-[184px] rounded-card border bg-white p-3 shadow-sm transition-all select-none',
        selected
          ? 'border-studio-accent ring-2 ring-studio-accent/20 shadow-md'
          : 'border-studio-border hover:border-slate-300 hover:shadow-md'
      )}
    >
      {/* 4 Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />

      {/* Header with Provider Icon and Badge */}
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <ProviderIcon providerId={provider} size={20} className="shrink-0" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-studio-secondary truncate">
            {provider}
          </span>
        </div>
        {nodeData.category && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
            {nodeData.category}
          </Badge>
        )}
      </div>

      {/* Service Name & Label */}
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-studio-text leading-snug line-clamp-2">
          {label}
        </div>
        {nodeData.serviceName && nodeData.serviceName !== label && (
          <div className="text-[11px] text-studio-secondary truncate">
            {nodeData.serviceName}
          </div>
        )}
      </div>
    </div>
  );
});
