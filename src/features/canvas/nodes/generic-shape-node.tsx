import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Database, Server, Box, Circle as CircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ShapeType = 'rectangle' | 'circle' | 'legacy-system' | 'generic-db';

export interface GenericShapeData {
  label: string;
  shapeType?: ShapeType;
  color?: string;
  notes?: string;
}

export const GenericShapeNode = memo(function GenericShapeNode({
  data,
  selected,
}: NodeProps) {
  const shapeData = data as unknown as GenericShapeData;
  const shapeType = shapeData?.shapeType || 'rectangle';
  const label = shapeData?.label || 'Componente';

  const isCircle = shapeType === 'circle';

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Elemento ${label}`}
      className={cn(
        'group relative flex flex-col items-center justify-center p-3 text-center transition-all select-none border bg-white shadow-2xs',
        isCircle ? 'w-28 h-28 rounded-full' : 'w-44 min-h-[72px] rounded-card',
        selected
          ? 'border-studio-accent ring-2 ring-studio-accent/25 shadow-sm'
          : 'border-studio-border hover:border-slate-300 hover:shadow-xs'
      )}
    >
      {/* Top handles */}
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

      {/* Right handles */}
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

      {/* Bottom handles */}
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

      {/* Left handles */}
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

      {/* Icon if legacy system or generic DB */}
      {shapeType === 'legacy-system' && (
        <Server className="w-5 h-5 text-studio-secondary mb-1" />
      )}
      {shapeType === 'generic-db' && (
        <Database className="w-5 h-5 text-studio-secondary mb-1" />
      )}

      <span className="text-xs font-semibold text-studio-text leading-snug px-2 line-clamp-2">
        {label}
      </span>
    </div>
  );
});
