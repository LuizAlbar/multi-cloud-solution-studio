import React, { useState, useCallback, useRef } from 'react';
import { useViewport, useReactFlow } from '@xyflow/react';
import { useEditorStore } from '@/features/canvas/store/editor-store';
import type { Drawing, DrawingPoint } from '@/lib/schemas';

export function DrawingOverlay() {
  const { x, y, zoom } = useViewport();
  const { screenToFlowPosition } = useReactFlow();
  const { activeTool, project } = useEditorStore();

  const [currentStroke, setCurrentStroke] = useState<DrawingPoint[] | null>(null);
  const isDrawing = useRef(false);

  const drawings = project?.drawings || [];

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (activeTool !== 'pen' && activeTool !== 'eraser') return;

      const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      if (activeTool === 'pen') {
        isDrawing.current = true;
        setCurrentStroke([flowPos]);
      } else if (activeTool === 'eraser') {
        // Erase strokes near clicked point
        if (!project) return;
        const radius = 15 / zoom;
        const remaining = drawings.filter((d) => {
          return !d.points.some(
            (p) => Math.hypot(p.x - flowPos.x, p.y - flowPos.y) < radius
          );
        });

        if (remaining.length !== drawings.length) {
          useEditorStore.setState({
            project: { ...project, drawings: remaining },
            saveStatus: 'unsaved',
          });
        }
      }
    },
    [activeTool, screenToFlowPosition, drawings, project, zoom]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDrawing.current || activeTool !== 'pen') return;

      const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      setCurrentStroke((prev) => (prev ? [...prev, flowPos] : [flowPos]));
    },
    [activeTool, screenToFlowPosition]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing.current || !currentStroke || currentStroke.length < 2) {
      isDrawing.current = false;
      setCurrentStroke(null);
      return;
    }

    if (project) {
      const newDrawing: Drawing = {
        id: `draw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        points: currentStroke,
        strokeWidth: 2.5,
        color: '#2563EB',
        layer: 1,
      };

      useEditorStore.setState({
        project: {
          ...project,
          drawings: [...(project.drawings || []), newDrawing],
        },
        saveStatus: 'unsaved',
      });
    }

    isDrawing.current = false;
    setCurrentStroke(null);
  }, [currentStroke, project]);

  const pointsToSvgPath = (points: DrawingPoint[]): string => {
    if (points.length === 0) return '';
    const [first, ...rest] = points;
    return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(' ')}`;
  };

  const isInteractive = activeTool === 'pen' || activeTool === 'eraser';

  return (
    <svg
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 h-full w-full z-10 ${
        isInteractive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
      }`}
    >
      <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
        {/* Persisted strokes */}
        {drawings.map((drawing) => (
          <path
            key={drawing.id}
            d={pointsToSvgPath(drawing.points)}
            stroke={drawing.color || '#2563EB'}
            strokeWidth={drawing.strokeWidth || 2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Current in-progress stroke */}
        {currentStroke && currentStroke.length > 0 && (
          <path
            d={pointsToSvgPath(currentStroke)}
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
        )}
      </g>
    </svg>
  );
}
