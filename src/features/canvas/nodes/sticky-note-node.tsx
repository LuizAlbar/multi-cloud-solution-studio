import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface StickyNoteData {
  label: string;
  color?: string; // yellow, blue, green, pink
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
        'group relative w-48 min-h-[120px] rounded-btn p-3 shadow-sm select-none border transition-all flex flex-col justify-between bg-amber-100/80 border-amber-300 text-amber-950',
        selected
          ? 'ring-2 ring-studio-accent ring-offset-1 shadow-md'
          : 'hover:shadow-md'
      )}
    >
      <p className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
        {label}
      </p>

      <div className="text-[10px] text-amber-700/70 text-right pt-2">
        Post-it
      </div>
    </div>
  );
});
