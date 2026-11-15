import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface StickyNoteData {
  label: string;
  color?: string;
}

export const StickyNoteNode = memo(function StickyNoteNode({
  data,
  selected,
}: NodeProps) {
  const noteData = data as unknown as StickyNoteData;
  const label = noteData?.label || 'Nota adesiva...';

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Nota adesiva: ${label}`}
      className={cn(
        'group relative w-48 min-h-[110px] rounded-btn p-3 shadow-2xs select-none border transition-all flex flex-col justify-between bg-amber-100/90 border-amber-300 text-amber-950',
        selected
          ? 'ring-2 ring-studio-accent ring-offset-1 shadow-sm'
          : 'hover:shadow-xs'
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

      <p className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
        {label}
      </p>

      <div className="text-[10px] text-amber-700/70 text-right pt-2">
        Post-it
      </div>
    </div>
  );
});
