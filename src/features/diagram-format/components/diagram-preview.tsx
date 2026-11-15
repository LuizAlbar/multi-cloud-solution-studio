'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { MCSSDiagramDocument } from '../domain/diagram-format';
import { ServiceNode } from '@/features/canvas/nodes/service-node';
import { GenericShapeNode } from '@/features/canvas/nodes/generic-shape-node';
import { StickyNoteNode } from '@/features/canvas/nodes/sticky-note-node';
import { TextNode } from '@/features/canvas/nodes/text-node';
import { GroupNode } from '@/features/canvas/nodes/group-node';
import { LabeledConnectionEdge } from '@/features/canvas/edges/labeled-connection-edge';

interface DiagramPreviewProps {
  document: MCSSDiagramDocument;
}

const PREVIEW_NODE_TYPES = {
  service: ServiceNode,
  generic: GenericShapeNode,
  shape: GenericShapeNode,
  note: StickyNoteNode,
  text: TextNode,
  group: GroupNode,
};

const PREVIEW_EDGE_TYPES = {
  labeled: LabeledConnectionEdge,
  default: LabeledConnectionEdge,
};

export function DiagramPreview({ document: doc }: DiagramPreviewProps) {
  const nodes = useMemo<Node[]>(() => {
    return doc.diagram.nodes.map((node) => ({
      id: node.id,
      type: node.kind === 'service' ? 'service' : node.kind === 'group' ? 'group' : 'generic',
      position: node.position,
      data: {
        label: node.label,
        serviceId: node.serviceId,
        properties: node.properties,
        notes: node.notes,
      },
      draggable: false,
      selectable: false,
    }));
  }, [doc]);

  const edges = useMemo<Edge[]>(() => {
    return doc.diagram.edges.map((edge) => ({
      id: edge.id,
      source: edge.sourceId,
      target: edge.targetId,
      label: edge.label,
      type: 'labeled',
      data: {
        flowType: edge.flowType,
        direction: edge.direction,
      },
      selectable: false,
    }));
  }, [doc]);

  return (
    <div className="relative h-[220px] w-full rounded-btn border border-slate-200 bg-slate-50/50 overflow-hidden select-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={PREVIEW_NODE_TYPES}
        edgeTypes={PREVIEW_EDGE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
      </ReactFlow>

      <div className="absolute bottom-2 right-2 text-[10px] font-medium text-slate-400 bg-white/80 px-2 py-0.5 rounded border border-slate-200 pointer-events-none">
        Prévia isolada • Conexões cloud não verificadas
      </div>
    </div>
  );
}
