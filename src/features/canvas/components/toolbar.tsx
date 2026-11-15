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
  Server,
  Database,
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '../store/editor-store';
import { cn } from '@/lib/utils';

export function Toolbar() {
  const { activeTool, setActiveTool, nodes, project } = useEditorStore();
  const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow();

  const handleAddGeneric = (
    kind: 'shape' | 'note' | 'text' | 'group',
    shapeType?: string,
    label?: string
  ) => {
    const id = `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    // Center of screen approximation
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
        label: label || (kind === 'group' ? 'Nova Zona' : 'Componente'),
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

  return (
    <div
      role="toolbar"
      aria-label="Ferramentas do canvas"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-card border border-studio-border bg-white p-1.5 shadow-md select-none"
    >
      {/* Navigation Tools */}
      <Button
        variant={activeTool === 'select' ? 'default' : 'ghost'}
        size="iconSm"
        onClick={() => setActiveTool('select')}
        title="Seleção (V / Esc)"
        aria-label="Seleção"
      >
        <MousePointer size={15} />
      </Button>

      <Button
        variant={activeTool === 'pan' ? 'default' : 'ghost'}
        size="iconSm"
        onClick={() => setActiveTool('pan')}
        title="Pan / Navegar (H / Space)"
        aria-label="Pan"
      >
        <Hand size={15} />
      </Button>

      <div className="h-4 w-px bg-studio-border mx-0.5" />

      {/* Freehand Drawing Tools */}
      <Button
        variant={activeTool === 'pen' ? 'default' : 'ghost'}
        size="iconSm"
        onClick={() => setActiveTool(activeTool === 'pen' ? 'select' : 'pen')}
        title="Caneta livre"
        aria-label="Caneta"
      >
        <Pen size={15} />
      </Button>

      <Button
        variant={activeTool === 'eraser' ? 'default' : 'ghost'}
        size="iconSm"
        onClick={() => setActiveTool(activeTool === 'eraser' ? 'select' : 'eraser')}
        title="Borracha de traços"
        aria-label="Borracha"
      >
        <Eraser size={15} />
      </Button>

      <div className="h-4 w-px bg-studio-border mx-0.5" />

      {/* Generic Shapes & Notes */}
      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('shape', 'rectangle', 'Retângulo')}
        title="Adicionar Retângulo"
        aria-label="Retângulo"
      >
        <Square size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('shape', 'circle', 'Círculo')}
        title="Adicionar Círculo"
        aria-label="Círculo"
      >
        <Circle size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('note', undefined, 'Nota explicativa')}
        title="Adicionar Post-it"
        aria-label="Nota"
      >
        <StickyNote size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('text', undefined, 'Texto da Arquitetura')}
        title="Adicionar Texto"
        aria-label="Texto"
      >
        <Type size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('shape', 'legacy-system', 'Sistema Legado / On-Prem')}
        title="Sistema Legado / On-Premises"
        aria-label="Sistema Legado"
      >
        <Server size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('shape', 'generic-db', 'Banco de Dados')}
        title="Banco de Dados"
        aria-label="Banco de Dados"
      >
        <Database size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => handleAddGeneric('group', undefined, 'Zona / Ambiente')}
        title="Adicionar Zona / Grupo"
        aria-label="Grupo"
      >
        <Layers size={15} />
      </Button>

      <div className="h-4 w-px bg-studio-border mx-0.5" />

      {/* Viewport controls */}
      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => fitView({ duration: 300, padding: 0.2 })}
        title="Ajustar tela (F)"
        aria-label="Ajustar tela"
      >
        <Maximize2 size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => zoomIn({ duration: 200 })}
        title="Aproximar (+)"
        aria-label="Aproximar"
      >
        <ZoomIn size={15} />
      </Button>

      <Button
        variant="ghost"
        size="iconSm"
        onClick={() => zoomOut({ duration: 200 })}
        title="Afastar (-)"
        aria-label="Afastar"
      >
        <ZoomOut size={15} />
      </Button>
    </div>
  );
}
