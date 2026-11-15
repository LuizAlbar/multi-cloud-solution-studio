import React, { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import type { EdgeFlowType, EdgeDirection } from '@/lib/schemas';
import { cn } from '@/lib/utils';

export interface LabeledEdgeData {
  flowType?: EdgeFlowType;
  direction?: EdgeDirection;
}

const FLOW_TYPE_COLORS: Record<EdgeFlowType, string> = {
  http: '#2563EB', // Blue
  data: '#059669', // Emerald
  events: '#D97706', // Amber
  network: '#7C3AED', // Purple
  auth: '#DC2626', // Red
  generic: '#64748B', // Slate
};

export const LabeledConnectionEdge = memo(function LabeledConnectionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  selected,
  animated,
  data,
  style = {},
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as unknown as LabeledEdgeData;
  const flowType = edgeData?.flowType || 'http';
  const flowColor = FLOW_TYPE_COLORS[flowType] || '#64748B';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: selected ? '#2563EB' : flowColor,
          strokeWidth: selected ? 3 : 2,
        }}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={cn(
              'rounded-full border px-2 py-0.5 text-[11px] font-medium shadow-xs select-none transition-all',
              selected
                ? 'border-studio-accent bg-studio-highlight text-studio-accent ring-1 ring-studio-accent font-semibold'
                : 'border-studio-border bg-white text-studio-text hover:bg-slate-50'
            )}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});
