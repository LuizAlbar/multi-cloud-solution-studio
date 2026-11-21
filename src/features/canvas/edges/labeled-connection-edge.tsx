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
  http: '#6366F1', // Indigo (accent)
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
  const direction = edgeData?.direction || 'sourceToTarget';
  const flowColor = selected ? '#4F46E5' : FLOW_TYPE_COLORS[flowType] || '#6366F1';

  const markerId = `arrow-${id}`;

  return (
    <>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill={flowColor} />
        </marker>
      </defs>

      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={
          direction === 'sourceToTarget' || direction === 'bidirectional'
            ? `url(#${markerId})`
            : undefined
        }
        markerStart={
          direction === 'targetToSource' || direction === 'bidirectional'
            ? `url(#${markerId})`
            : undefined
        }
        style={{
          ...style,
          stroke: flowColor,
          strokeWidth: selected ? 2.5 : 2,
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
              'rounded-full border px-2 py-0.5 text-[11px] font-semibold shadow-2xs select-none transition-all cursor-pointer',
              selected
                ? 'border-primary bg-primary-soft text-primary ring-2 ring-primary/20'
                : 'border-border bg-surface text-foreground hover:border-border/80'
            )}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});
