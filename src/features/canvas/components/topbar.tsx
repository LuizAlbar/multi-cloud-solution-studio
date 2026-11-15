import React from 'react';
import Link from 'next/link';
import {
  Undo2,
  Redo2,
  Play,
  Film,
  Layers,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '../store/editor-store';

interface TopbarProps {
  onTogglePresentation: () => void;
  onToggleSceneDrawer: () => void;
  isPresentation: boolean;
  onOpenExportDialog: () => void;
}

export function Topbar({
  onTogglePresentation,
  onToggleSceneDrawer,
  isPresentation,
  onOpenExportDialog,
}: TopbarProps) {
  const {
    project,
    updateProjectTitle,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
    saveErrorMessage,
    saveProjectNow,
  } = useEditorStore();

  if (isPresentation) return null;

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-studio-border bg-white px-4 z-20 select-none">
      {/* Left: Brand & Home */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-studio-text hover:text-studio-accent transition-colors"
          title="Voltar para o Dashboard de Projetos"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-studio-accent text-white shadow-xs">
            <Layers size={18} />
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:inline-block">
            MultiCloud Studio
          </span>
        </Link>

        <div className="h-4 w-px bg-studio-border mx-1" />

        {/* Project Title Input */}
        <input
          value={project?.title || ''}
          onChange={(e) => updateProjectTitle(e.target.value)}
          placeholder="Título do Projeto"
          className="h-8 max-w-[240px] sm:max-w-[320px] rounded-btn border border-transparent px-2 text-sm font-semibold text-studio-text hover:border-studio-border focus:border-studio-accent focus:bg-white focus:outline-none transition-all"
        />

        {/* Save Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-studio-secondary animate-pulse">
              <Loader2 size={13} className="animate-spin" />
              <span className="hidden md:inline">Salvando...</span>
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 size={13} />
              <span className="hidden md:inline">Salvo</span>
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="text-[11px] text-amber-600">
              ● <span className="hidden md:inline">Alterações pendentes</span>
            </span>
          )}
          {saveStatus === 'error' && (
            <button
              onClick={() => saveProjectNow()}
              className="flex items-center gap-1 text-red-600 hover:underline"
              title={saveErrorMessage || 'Clique para tentar salvar novamente'}
            >
              <AlertCircle size={13} />
              <span>Erro ao salvar</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center border border-studio-border rounded-btn bg-white overflow-hidden shadow-2xs">
          <Button
            variant="ghost"
            size="iconSm"
            onClick={undo}
            disabled={!canUndo()}
            title="Desfazer (Ctrl+Z)"
            aria-label="Desfazer"
            className="rounded-none border-r border-studio-border"
          >
            <Undo2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={redo}
            disabled={!canRedo()}
            title="Refazer (Ctrl+Shift+Z)"
            aria-label="Refazer"
            className="rounded-none"
          >
            <Redo2 size={14} />
          </Button>
        </div>

        {/* Scene Script Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSceneDrawer}
          className="gap-1.5 text-xs font-medium"
        >
          <Film size={14} />
          <span className="hidden sm:inline">Cenas ({project?.scenes?.length || 0})</span>
        </Button>

        {/* Export / Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenExportDialog}
          className="gap-1.5 text-xs font-medium"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Exportar</span>
        </Button>

        {/* Presentation Button */}
        <Button
          variant="accentSubtle"
          size="sm"
          onClick={onTogglePresentation}
          className="gap-1.5 font-medium"
        >
          <Play size={14} className="fill-studio-accent" />
          <span>Apresentar (P)</span>
        </Button>
      </div>
    </header>
  );
}
