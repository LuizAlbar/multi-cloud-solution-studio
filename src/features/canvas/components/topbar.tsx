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
  Upload,
  BookmarkPlus,
  Sparkles,
  Bot,
  Keyboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand/brand-logo';
import { useEditorStore } from '../store/editor-store';
import { downloadAiKitZip } from '@/features/diagram-format/kit/generate-kit-zip';

interface TopbarProps {
  onTogglePresentation: () => void;
  onToggleSceneDrawer: () => void;
  isPresentation: boolean;
  onOpenExportDialog: () => void;
  onOpenImportDialog?: () => void;
  onOpenShortcuts?: () => void;
  isPlayground?: boolean;
  onSaveAsProject?: () => void;
}

export function Topbar({
  onTogglePresentation,
  onToggleSceneDrawer,
  isPresentation,
  onOpenExportDialog,
  onOpenImportDialog,
  onOpenShortcuts,
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
    <header className="sticky top-0 flex h-16 w-full items-center justify-between border-b border-border bg-surface/90 backdrop-blur-md px-5 sm:px-6 z-20 select-none">
      {/* Left: Brand & Context */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-95 transition-opacity"
          title="Voltar para o Início"
        >
          <BrandLogo size="lg" />
        </Link>

        <div className="h-5 w-px bg-border" />

        {/* Project Title Input (or Playground label) */}
        {isPlayground ? (
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
              <Sparkles size={13} className="text-amber-600" />
              <span>Playground</span>
              <span className="text-[10px] text-amber-700 font-medium">· Temporário</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              value={project?.title || ''}
              onChange={(e) => updateProjectTitle(e.target.value)}
              placeholder="Título do Projeto"
              className="h-8 max-w-[220px] sm:max-w-[320px] rounded-btn border border-transparent px-2 text-sm font-semibold text-foreground hover:border-border focus:border-primary focus:bg-surface focus:outline-none transition-all truncate"
            />

            {/* Save Status Indicator */}
            <div className="flex items-center gap-1.5 text-xs">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-foreground-secondary animate-pulse">
                  <Loader2 size={13} className="animate-spin" />
                  <span className="hidden md:inline">Salvando...</span>
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 size={13} />
                  <span className="hidden md:inline">Salvo</span>
                </span>
              )}
              {saveStatus === 'unsaved' && (
                <span className="text-[11px] text-amber-600 font-medium">
                  ● <span className="hidden md:inline">Alterações pendentes</span>
                </span>
              )}
              {saveStatus === 'error' && (
                <button
                  onClick={() => saveProjectNow()}
                  className="flex items-center gap-1 text-destructive hover:underline font-medium"
                  title={saveErrorMessage || 'Clique para tentar salvar novamente'}
                >
                  <AlertCircle size={13} />
                  <span>Erro ao salvar</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center border border-border rounded-btn bg-surface overflow-hidden shadow-2xs">
          <Button
            variant="ghost"
            size="iconSm"
            onClick={undo}
            disabled={!canUndo()}
            title="Desfazer (Ctrl+Z)"
            aria-label="Desfazer"
            className="rounded-none border-r border-border h-8 w-8 text-foreground-secondary hover:text-foreground"
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
            className="rounded-none h-8 w-8 text-foreground-secondary hover:text-foreground"
          >
            <Redo2 size={14} />
          </Button>
        </div>

        {/* Shortcuts Button */}
        {onOpenShortcuts && (
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onOpenShortcuts}
            title="Atalhos de Teclado (?)"
            aria-label="Atalhos de Teclado"
            className="h-8 w-8 text-foreground-secondary hover:text-foreground border border-border rounded-btn bg-surface shadow-2xs"
          >
            <Keyboard size={15} />
          </Button>
        )}

        {/* Save as Project button when in playground */}
        {isPlayground && onSaveAsProject && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveAsProject}
            className="gap-1.5 text-xs font-semibold h-8 border-primary/20 text-primary bg-primary-soft/60 hover:bg-primary-soft shadow-2xs"
          >
            <BookmarkPlus size={14} className="text-primary" />
            <span className="hidden sm:inline">Salvar como Projeto</span>
          </Button>
        )}

        {/* Import Diagram Button */}
        {onOpenImportDialog && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenImportDialog}
            className="gap-1.5 text-xs font-semibold h-8 border-border shadow-2xs"
            title="Importar diagrama gerado por IA ou arquivo .mcss.json"
          >
            <Upload size={14} className="text-foreground-secondary" />
            <span className="hidden md:inline">Importar</span>
          </Button>
        )}

        {/* AI Kit Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadAiKitZip()}
          className="gap-1.5 text-xs font-semibold h-8 border-border shadow-2xs text-foreground hover:text-primary"
          title="Baixar Kit para IA (.zip) com documentação e catálogo"
        >
          <Bot size={14} className="text-primary" />
          <span className="hidden lg:inline">Kit para IA</span>
        </Button>

        {/* Scene Script Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSceneDrawer}
          className="gap-1.5 text-xs font-semibold h-8 border-border shadow-2xs"
        >
          <Film size={14} className="text-foreground-secondary" />
          <span className="hidden sm:inline">Cenas ({project?.scenes?.length || 0})</span>
        </Button>

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenExportDialog}
          className="gap-1.5 text-xs font-semibold h-8 border-border shadow-2xs"
        >
          <Download size={14} className="text-foreground-secondary" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>

        {/* Presentation Button */}
        <Button
          variant="accentSubtle"
          size="sm"
          onClick={onTogglePresentation}
          className="gap-1.5 text-xs font-semibold h-8 shadow-2xs"
        >
          <Play size={13} className="fill-primary text-primary" />
          <span>Apresentar (P)</span>
        </Button>
      </div>
    </header>
  );
}
