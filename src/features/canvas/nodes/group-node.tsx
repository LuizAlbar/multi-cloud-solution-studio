import React, { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GroupNodeData {
  label: string;
}

export const GroupNode = memo(function GroupNode({
  data,
  selected,
}: NodeProps) {
  const groupData = data as unknown as GroupNodeData;
  const label = groupData?.label || 'Zona / Grupo Lógico';

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Grupo ${label}`}
      className={cn(
        'relative min-w-[360px] min-h-[240px] rounded-card border-2 border-dashed p-4 select-none transition-all',
        selected
          ? 'border-studio-accent bg-blue-50/20'
          : 'border-slate-300 bg-slate-50/40 hover:border-slate-400'
      )}
    >
      {/* Title Header */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-studio-secondary mb-2 pointer-events-none">
        <Layers size={14} className="text-studio-secondary" />
        <span>{label}</span>
      </div>
    </div>
  );
});
