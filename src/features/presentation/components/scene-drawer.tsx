import React from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  Film,
  Plus,
  Trash2,
  Camera,
  Play,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/features/canvas/store/editor-store';
import type { Scene } from '@/lib/schemas';

interface SceneDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPresentation: () => void;
}

export function SceneDrawer({
  isOpen,
  onClose,
  onStartPresentation,
}: SceneDrawerProps) {
  const { getViewport } = useReactFlow();
  const { project, nodes, edges } = useEditorStore();

  if (!isOpen || !project) return null;

  const scenes = project.scenes || [];

  const handleCaptureNewScene = () => {
    const vp = getViewport();
    const newScene: Scene = {
      id: `scene-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order: scenes.length,
      title: `Cena ${scenes.length + 1}: ${scenes.length === 0 ? 'Visão Geral' : 'Foco na Solução'}`,
      description: 'Enquadramento e nós destacados para apresentação.',
      speakerNotes: '',
      viewport: { x: vp.x, y: vp.y, zoom: vp.zoom },
      highlightNodeIds: nodes.map((n) => n.id),
      highlightEdgeIds: edges.map((e) => e.id),
      animatedEdgeIds: edges.slice(0, 1).map((e) => e.id),
    };

    useEditorStore.setState({
      project: {
        ...project,
        scenes: [...scenes, newScene],
      },
      saveStatus: 'unsaved',
    });
  };

  const handleUpdateScene = (id: string, partial: Partial<Scene>) => {
    const nextScenes = scenes.map((s) => (s.id === id ? { ...s, ...partial } : s));
    useEditorStore.setState({
      project: { ...project, scenes: nextScenes },
      saveStatus: 'unsaved',
    });
  };

  const handleDeleteScene = (id: string) => {
    const nextScenes = scenes.filter((s) => s.id !== id);
    useEditorStore.setState({
      project: { ...project, scenes: nextScenes },
      saveStatus: 'unsaved',
    });
  };

  const handleRecaptureViewport = (id: string) => {
    const vp = getViewport();
    handleUpdateScene(id, {
      viewport: { x: vp.x, y: vp.y, zoom: vp.zoom },
    });
  };

  return (
    <div className="absolute top-14 sm:top-16 right-2 sm:right-4 left-2 sm:left-auto w-auto sm:w-80 z-40 rounded-card border border-border bg-surface/95 backdrop-blur-md shadow-raised select-none flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="flex items-center gap-2">
          <Film size={16} className="text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Roteiro de Cenas
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-foreground-secondary hover:text-foreground p-1 rounded"
          aria-label="Fechar roteiro"
        >
          <X size={14} />
        </button>
      </div>

      {/* Action buttons */}
      <div className="p-3 border-b border-border flex items-center justify-between gap-2 bg-surface-muted/50">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCaptureNewScene}
          className="gap-1.5 text-xs h-7 flex-1"
        >
          <Plus size={13} />
          <span>Capturar Cena Atual</span>
        </Button>

        {scenes.length > 0 && (
          <Button
            size="sm"
            variant="default"
            onClick={onStartPresentation}
            className="gap-1.5 text-xs h-7"
          >
            <Play size={12} className="fill-white" />
            <span>Apresentar</span>
          </Button>
        )}
      </div>

      {/* Scenes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {scenes.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-xs text-foreground-secondary">
              Nenhuma cena criada.
            </p>
          </div>
        ) : (
          scenes.map((scene, idx) => (
            <div
              key={scene.id}
              className="rounded-btn border border-border bg-surface p-2.5 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-primary uppercase">
                  #{idx + 1}
                </span>
                <Input
                  value={scene.title}
                  onChange={(e) => handleUpdateScene(scene.id, { title: e.target.value })}
                  className="h-6 text-xs font-medium"
                />
                <Button
                  size="iconSm"
                  variant="ghost"
                  onClick={() => handleDeleteScene(scene.id)}
                  className="text-foreground-secondary hover:text-destructive h-6 w-6"
                  title="Excluir cena"
                >
                  <Trash2 size={12} />
                </Button>
              </div>

              {/* Viewport recapture button */}
              <div className="flex items-center justify-between text-[11px] text-foreground-secondary pt-1">
                <span>Zoom: {scene.viewport.zoom.toFixed(2)}x</span>
                <button
                  onClick={() => handleRecaptureViewport(scene.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                  title="Atualizar coordenadas da cena para o enquadramento atual"
                >
                  <Camera size={11} />
                  <span>Recapturar tela</span>
                </button>
              </div>

              {/* Speaker notes input */}
              <div className="pt-1">
                <textarea
                  rows={2}
                  value={scene.speakerNotes || ''}
                  onChange={(e) =>
                    handleUpdateScene(scene.id, { speakerNotes: e.target.value })
                  }
                  placeholder="Notas do apresentador para esta cena..."
                  className="w-full rounded-btn border border-border bg-amber-500/5 p-1.5 text-[11px] text-foreground placeholder:text-foreground-secondary/60 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
