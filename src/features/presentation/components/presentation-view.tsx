import React, { useEffect, useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  X,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/features/canvas/store/editor-store';
import type { Scene } from '@/lib/schemas';

interface PresentationViewProps {
  onExit: () => void;
}

export function PresentationView({ onExit }: PresentationViewProps) {
  const { setViewport } = useReactFlow();
  const { project, nodes, edges } = useEditorStore();

  const scenes: Scene[] = project?.scenes || [];
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeScene = scenes[currentSceneIndex] || null;

  // Apply scene viewport and spotlight
  const applyScene = useCallback(
    (scene: Scene | null) => {
      if (!scene) return;

      // 1. Smoothly pan & zoom to scene viewport
      setViewport(scene.viewport, { duration: 450 });

      // 2. Spotlight: dim non-highlighted nodes and edges
      useEditorStore.setState((state) => {
        const highlightedNodes = new Set(scene.highlightNodeIds || []);
        const highlightedEdges = new Set(scene.highlightEdgeIds || []);
        const animatedEdges = new Set(scene.animatedEdgeIds || []);

        const hasSpecificNodeHighlights = highlightedNodes.size > 0;
        const hasSpecificEdgeHighlights = highlightedEdges.size > 0;

        return {
          nodes: state.nodes.map((n) => {
            const isHighlighted =
              !hasSpecificNodeHighlights || highlightedNodes.has(n.id);
            return {
              ...n,
              style: {
                ...n.style,
                opacity: isHighlighted ? 1 : 0.2,
                transition: 'opacity 300ms ease-in-out',
              },
            };
          }),
          edges: state.edges.map((e) => {
            const isHighlighted =
              !hasSpecificEdgeHighlights || highlightedEdges.has(e.id);
            const isAnimated = animatedEdges.has(e.id);
            return {
              ...e,
              animated: isAnimated,
              style: {
                ...e.style,
                opacity: isHighlighted ? 1 : 0.15,
                transition: 'opacity 300ms ease-in-out',
              },
            };
          }),
        };
      });
    },
    [setViewport]
  );

  useEffect(() => {
    if (activeScene) {
      applyScene(activeScene);
    }

    // Cleanup spotlight on exit
    return () => {
      useEditorStore.setState((state) => ({
        nodes: state.nodes.map((n) => ({
          ...n,
          style: { ...n.style, opacity: 1 },
        })),
        edges: state.edges.map((e) => ({
          ...e,
          animated: false,
          style: { ...e.style, opacity: 1 },
        })),
      }));
    };
  }, [currentSceneIndex, activeScene, applyScene]);

  // Keyboard navigation for scenes
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        if (currentSceneIndex < scenes.length - 1) {
          setCurrentSceneIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentSceneIndex > 0) {
          setCurrentSceneIndex((prev) => prev - 1);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSceneIndex, scenes.length, onExit]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* Top Floating Banner: Mandatory Conceptual Flow Disclaimer (CA-13) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 backdrop-blur-xs px-4 py-1 text-xs text-slate-300 shadow-lg select-none">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-medium text-white">
          {activeScene ? activeScene.title : project?.title}
        </span>
        <span className="text-slate-500">|</span>
        <span className="text-[11px] text-amber-400 font-medium">
          Fluxo ilustrativo — não representa tráfego real
        </span>
      </div>

      {/* Floating Bottom Navigation Bar (16:9 meeting mode) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-card border border-slate-700 bg-slate-900/95 backdrop-blur-md px-3 py-2 text-white shadow-2xl select-none">
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => setCurrentSceneIndex((p) => Math.max(0, p - 1))}
          disabled={currentSceneIndex === 0}
          className="text-slate-300 hover:text-white hover:bg-slate-800"
          title="Cena Anterior (←)"
          aria-label="Cena Anterior"
        >
          <ChevronLeft size={16} />
        </Button>

        <span className="text-xs font-semibold px-2 text-slate-200 min-w-[80px] text-center">
          {scenes.length > 0 ? (
            <>
              Cena {currentSceneIndex + 1} de {scenes.length}
            </>
          ) : (
            'Apresentação'
          )}
        </span>

        <Button
          variant="ghost"
          size="iconSm"
          onClick={() =>
            setCurrentSceneIndex((p) => Math.min(scenes.length - 1, p + 1))
          }
          disabled={currentSceneIndex >= scenes.length - 1}
          className="text-slate-300 hover:text-white hover:bg-slate-800"
          title="Próxima Cena (→ ou Espaço)"
          aria-label="Próxima Cena"
        >
          <ChevronRight size={16} />
        </Button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        {/* Presenter Notes Button */}
        <Button
          variant={showPresenterNotes ? 'default' : 'ghost'}
          size="iconSm"
          onClick={() => setShowPresenterNotes((p) => !p)}
          className={
            showPresenterNotes
              ? 'bg-amber-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }
          title="Notas do Apresentador (não compartilhadas)"
          aria-label="Notas do Apresentador"
        >
          <FileText size={14} />
        </Button>

        {/* Fullscreen Button */}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={toggleFullscreen}
          className="text-slate-300 hover:text-white hover:bg-slate-800"
          title="Tela Cheia (F)"
          aria-label="Tela Cheia"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </Button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        {/* Exit Presentation */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onExit}
          className="h-7 text-xs px-2.5 font-medium"
        >
          <X size={13} className="mr-1" />
          <span>Sair (Esc)</span>
        </Button>
      </div>

      {/* Presenter Private Notes Drawer (CA-14) */}
      {showPresenterNotes && (
        <div className="absolute top-16 right-6 z-40 w-80 rounded-card border border-amber-300 bg-amber-50/95 backdrop-blur-md p-4 text-amber-950 shadow-2xl select-none space-y-2">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Notas do Apresentador (Privadas)
            </span>
            <button
              onClick={() => setShowPresenterNotes(false)}
              className="text-amber-800 hover:text-amber-950 text-xs"
            >
              ✕
            </button>
          </div>

          <p className="text-xs leading-relaxed whitespace-pre-wrap">
            {activeScene?.speakerNotes ||
              'Nenhuma nota gravada para esta cena. Adicione notas no editor para orientar sua fala em reuniões.'}
          </p>

          <p className="text-[10px] text-amber-700 italic pt-1 border-t border-amber-200/60">
            Dica: Posicione esta janela na sua segunda tela se for compartilhar apenas o Meet.
          </p>
        </div>
      )}
    </>
  );
}
