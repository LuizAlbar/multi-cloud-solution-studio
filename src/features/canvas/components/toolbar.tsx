import React from 'react';
import {
  MousePointer,
  Hand,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Square,
  Circle,
  StickyNote,
  Type,
  Layers,
  Pen,
  Eraser,
  Database,
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '../store/editor-store';
import type { ProviderId } from '@/lib/schemas';

export function Toolbar() {
  const { activeTool, setActiveTool, nodes } = useEditorStore();
  const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow();

  const handleAddGeneric = (
    kind: 'shape' | 'note' | 'text',
    shapeType?: string,
    label?: string
  ) => {
    const id = `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode = {
      id,
      type: kind,
      position: {
        x: center.x - 60 + Math.random() * 40,
        y: center.y - 40 + Math.random() * 40,
      },
      data: {
        label: label || 'Componente',
        shapeType,
        notes: '',
        properties: {},
      },
    };

    useEditorStore.setState({
      nodes: [...nodes, newNode],
      selectedNodeId: id,
      saveStatus: 'unsaved',
    });
  };

  const handleAddZone = (providerId: ProviderId = 'aws', label = 'Zona AWS - us-east-1', region = 'us-east-1') => {
    const id = `node-zone-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newZone = {
      id,
      type: 'group',
      position: {
        x: center.x - 180 + Math.random() * 30,
        y: center.y - 120 + Math.random() * 30,
      },
      data: {
        label,
        providerId,
        region,
      },
    };

    // Zones render behind child nodes
    useEditorStore.setState({
      nodes: [newZone, ...nodes],
      selectedNodeId: id,
      saveStatus: 'unsaved',
    });
  };

  return (
    <div
      role="toolbar"
      aria-label="Ferramentas do canvas"
      className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 sm:gap-1 rounded-card border border-border bg-surface/95 backdrop-blur-md p-1 sm:p-1.5 shadow-raised select-none max-w-[calc(100vw-1.5rem)] overflow-x-auto no-scrollbar"
    >
      {/* Navigation Tools */}
      <Button
        variant={activeTool === 'select' ? 'default' : 'ghost'}
        size="iconSm"
        onClick={() => setActiveTool('select')}
        title="Seleção (V / Esc)"
        aria-label="Seleção"
        className={activeTool === 'select' ? 'bg-primary text-white hover:bg-primary-hover' : 'text-foreground-secondary hover:text-foreground'}
      >
        <MousePointer size={15} />
      </Button>

      <Button
        variant={activeTool === 'pan' ? 'default' : 'ghost'}
        size="iconSm"
        onClick={() => setActiveTool('pan')}
        title="Pan / Navegar (H / Space)"
        aria-label="Pan"
        className={activeTool === 'pan' ? 'bg-primary text-white hover:bg-primary-hover' : 'text-foreground-secondary hover:text-foreground'}
      >
        <Hand size={15} />
      </Button>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Freehand Drawing Tools */}
      <Button
        variant={activeTool === 'pen' ? 'default' : 'ghost'}
        size="iconSm"
        onClick={() => setActiveTool(activeTool === 'pen' ? 'select' : 'pen')}
        title="Caneta livre"
        aria-label="Caneta"
        className={activeTool === 'pen' ? 'bg-primary text-white hover:bg-primary-hover' : 'text-foreground-secondary hover:text-foreground'}
      >
        <Pen size={15} />
      </Button>

      <Button
        variant={activeTool === 'eraser' ? 'default' : 'ghost'}
        size="iconSm"
        onClick={() => setActiveTool(activeTool === 'eraser' ? 'select' : 'eraser')}
        title="Borracha de traços"
        aria-label="Borracha"
        className={activeTool === 'eraser' ? 'bg-primary text-white hover:bg-primary-hover' : 'text-foreground-secondary hover:text-foreground'}
      >
        <Eraser size={15} />
      </Button>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Generic Shapes & Notes */}
      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('shape', 'rectangle', 'Retângulo')}
        title="Adicionar Retângulo"
        aria-label="Retângulo"
        className="text-foreground-secondary hover:text-foreground"
      >
        <Square size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('shape', 'circle', 'Círculo')}
        title="Adicionar Círculo"
        aria-label="Círculo"
        className="text-foreground-secondary hover:text-foreground"
      >
        <Circle size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('note', undefined, 'Nota explicativa')}
        title="Adicionar Post-it"
        aria-label="Nota"
        className="text-foreground-secondary hover:text-foreground"
      >
        <StickyNote size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('text', undefined, 'Texto da Arquitetura')}
        title="Adicionar Texto"
        aria-label="Texto"
        className="text-foreground-secondary hover:text-foreground"
      >
        <Type size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('shape', 'generic-db', 'Banco de Dados')}
        title="Banco de Dados"
        aria-label="Banco de Dados"
        className="text-foreground-secondary hover:text-foreground"
      >
        <Database size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddZone('aws', 'Zona AWS - us-east-1', 'us-east-1')}
        title="Adicionar Zona / Região"
        aria-label="Adicionar Zona"
        className="text-foreground-secondary hover:text-foreground"
      >
        <Layers size={15} />
      </Button>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Viewport controls */}
      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => fitView({ duration: 300, padding: 0.2 })}
        title="Ajustar tela (F)"
        aria-label="Ajustar tela"
        className="text-foreground-secondary hover:text-foreground"
      >
        <Maximize2 size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => zoomIn({ duration: 200 })}
        title="Aproximar (+)"
        aria-label="Aproximar"
        className="text-foreground-secondary hover:text-foreground"
      >
        <ZoomIn size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => zoomOut({ duration: 200 })}
        title="Afastar (-)"
        aria-label="Afastar"
        className="text-foreground-secondary hover:text-foreground"
      >
        <ZoomOut size={15} />
      </Button>
    </div>
  );
}
