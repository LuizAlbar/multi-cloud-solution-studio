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
        'group relative flex flex-col items-center justify-center p-3 text-center transition-all select-none border bg-white shadow-xs',
        isCircle ? 'w-28 h-28 rounded-full' : 'w-44 min-h-[72px] rounded-card',
        selected
          ? 'border-studio-accent ring-2 ring-studio-accent/20 shadow-md'
          : 'border-studio-border hover:border-slate-300'
      )}
    >
      {/* 4 Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />

      <Handle
        type="target"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />

      <Handle
        type="target"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />

      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-studio-accent !border-2 !border-white transition-opacity opacity-0 group-hover:opacity-100"
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
