import React, { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface TextNodeData {
  label: string;
}

export const TextNode = memo(function TextNode({
  data,
  selected,
}: NodeProps) {
  const textData = data as unknown as TextNodeData;
  const label = textData?.label || 'Texto explicativo...';

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Texto: ${label}`}
      className={cn(
        'group relative min-w-[120px] max-w-[320px] p-2 select-none rounded-btn transition-all',
        selected
          ? 'ring-2 ring-studio-accent bg-studio-highlight/50'
          : 'hover:bg-slate-100/50'
      )}
    >
      <div className="text-sm font-semibold text-studio-text leading-snug whitespace-pre-wrap">
        {label}
      </div>
    </div>
  );
});
