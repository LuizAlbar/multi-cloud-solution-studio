import React from 'react';
import Link from 'next/link';
import {
  Undo2,
  Redo2,
  Play,
  Film,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Download,
  BookmarkPlus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand/brand-logo';
import { useEditorStore } from '../store/editor-store';

interface TopbarProps {
  onTogglePresentation: () => void;
  onToggleSceneDrawer: () => void;
  isPresentation: boolean;
  onOpenExportDialog: () => void;
  isPlayground?: boolean;
  onSaveAsProject?: () => void;
}

export function Topbar({
  onTogglePresentation,
  onToggleSceneDrawer,
  isPresentation,
  onOpenExportDialog,
  isPlayground = false,
  onSaveAsProject,
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
      {/* Left: Brand & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          title="Voltar para o Dashboard de Projetos"
        >
          <BrandLogo />
        </Link>

        <div className="h-4 w-px bg-studio-border mx-1" />

        {/* Project Title Input (or Playground label) */}
        {isPlayground ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-600" />
              <span>Playground · Não salvo</span>
            </span>
          </div>
        ) : (
          <>
            <input
              value={project?.title || ''}
              onChange={(e) => updateProjectTitle(e.target.value)}
              placeholder="Título do Projeto"
              className="h-8 max-w-[200px] sm:max-w-[280px] rounded-btn border border-transparent px-2 text-sm font-semibold text-studio-text hover:border-studio-border focus:border-studio-accent focus:bg-white focus:outline-none transition-all truncate"
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
          </>
        )}
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

        {/* Save as Project button when in playground */}
        {isPlayground && onSaveAsProject && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveAsProject}
            className="gap-1.5 text-xs font-medium border-studio-accent/40 text-studio-accent hover:bg-studio-highlight"
          >
            <BookmarkPlus size={14} />
            <span className="hidden sm:inline">Salvar como Projeto</span>
          </Button>
        )}

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
