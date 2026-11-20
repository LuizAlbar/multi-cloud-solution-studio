import React, { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  type NodeMouseHandler,
  type EdgeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useEditorStore } from '../store/editor-store';
import { Toolbar } from './toolbar';
import { DrawingOverlay } from '@/features/annotations/components/drawing-overlay';
import { ServiceNode } from '../nodes/service-node';
import { GenericShapeNode } from '../nodes/generic-shape-node';
import { StickyNoteNode } from '../nodes/sticky-note-node';
import { TextNode } from '../nodes/text-node';
import { GroupNode } from '../nodes/group-node';
import { LabeledConnectionEdge } from '../edges/labeled-connection-edge';
import type { CatalogService } from '@/lib/schemas';

const nodeTypes = {
  service: ServiceNode,
  shape: GenericShapeNode,
  generic: GenericShapeNode,
  sticky: StickyNoteNode,
  note: StickyNoteNode,
  text: TextNode,
  group: GroupNode,
};

const edgeTypes = {
  default: LabeledConnectionEdge,
  labeled: LabeledConnectionEdge,
};

interface CanvasProps {
  isPresentation?: boolean;
}

export function Canvas({ isPresentation = false }: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addServiceNode,
    selectNode,
    selectEdge,
    activeTool,
    deleteSelected,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorStore();

  // Drag-and-drop from catalog
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const rawService = event.dataTransfer.getData('application/mcss-service');
      if (!rawService) return;

      try {
        const service: CatalogService = JSON.parse(rawService);
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        addServiceNode(service, position);
      } catch (err) {
        console.error('Failed to parse dropped service:', err);
      }
    },
    [screenToFlowPosition, addServiceNode]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  // Global window diagram shortcuts listener (e.g. 'D' to delete selected element)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        !target ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        return;
      }

      // 'D' or 'Delete' or 'Backspace' deletes selected object (Request 3)
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        (e.key === 'd' || e.key === 'D' || e.key === 'Delete' || e.key === 'Backspace')
      ) {
        const { selectedNodeId, selectedEdgeId, deleteSelected: del } = useEditorStore.getState();
        if (selectedNodeId || selectedEdgeId) {
          e.preventDefault();
          del();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Focused element shortcuts
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        deleteSelected();
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo()) redo();
        } else {
          if (canUndo()) undo();
        }
      } else if (e.key === 'Escape') {
        selectNode(null);
        selectEdge(null);
      }
    },
    [deleteSelected, undo, redo, canUndo, canRedo, selectNode, selectEdge]
  );

  return (
    <div
      ref={reactFlowWrapper}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative h-full w-full bg-studio-canvas outline-none"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        fitView
        panOnDrag={activeTool === 'pan' || [1, 2]}
        selectionOnDrag={activeTool === 'select'}
        minZoom={0.2}
        maxZoom={2.5}
        defaultEdgeOptions={{
          type: 'default',
          animated: false,
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.5}
          color="#E9EDF3"
        />

        {/* Freehand Drawing Overlay synced to React Flow viewport */}
        <DrawingOverlay />
      </ReactFlow>

      {/* Floating Toolbar (hidden in presentation mode) */}
      {!isPresentation && <Toolbar />}
    </div>
  );
}
