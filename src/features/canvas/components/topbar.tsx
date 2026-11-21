import React, { useState, useRef, useEffect } from 'react';
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
  MoreHorizontal,
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMobileMenuOpen]);

  if (isPresentation) return null;

  return (
    <header className="sticky top-0 flex h-14 sm:h-16 w-full items-center justify-between border-b border-border bg-surface/90 backdrop-blur-md px-3 sm:px-6 z-20 select-none">
      {/* Left: Brand & Context */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-95 transition-opacity shrink-0"
          title="Voltar para o Início"
        >
          <BrandLogo size="lg" />
        </Link>

        <div className="h-4 sm:h-5 w-px bg-border hidden sm:block" />

        {/* Project Title Input (or Playground label) */}
        {isPlayground ? (
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1 sm:gap-1.5 shadow-2xs whitespace-nowrap">
              <Sparkles size={12} className="text-amber-600" />
              <span>Playground</span>
              <span className="text-[9px] sm:text-[10px] text-amber-700 font-medium hidden xs:inline">· Temporário</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <input
              value={project?.title || ''}
              onChange={(e) => updateProjectTitle(e.target.value)}
              placeholder="Título"
              className="h-7 sm:h-8 max-w-[110px] xs:max-w-[150px] sm:max-w-[220px] md:max-w-[320px] rounded-btn border border-transparent px-1.5 sm:px-2 text-xs sm:text-sm font-semibold text-foreground hover:border-border focus:border-primary focus:bg-surface focus:outline-none transition-all truncate"
            />

            {/* Save Status Indicator */}
            <div className="flex items-center gap-1 text-xs shrink-0">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-foreground-secondary animate-pulse" title="Salvando alterações">
                  <Loader2 size={13} className="animate-spin" />
                  <span className="hidden md:inline">Salvando...</span>
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-emerald-600 font-medium" title="Todas as alterações foram salvas">
                  <CheckCircle2 size={13} />
                  <span className="hidden md:inline">Salvo</span>
                </span>
              )}
              {saveStatus === 'unsaved' && (
                <span className="text-[11px] text-amber-600 font-medium" title="Alterações pendentes">
                  ● <span className="hidden md:inline">Pendente</span>
                </span>
              )}
              {saveStatus === 'error' && (
                <button
                  onClick={() => saveProjectNow()}
                  className="flex items-center gap-1 text-destructive hover:underline font-medium"
                  title={saveErrorMessage || 'Clique para tentar salvar novamente'}
                >
                  <AlertCircle size={13} />
                  <span className="hidden md:inline">Erro</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Undo / Redo */}
        <div className="flex items-center border border-border rounded-btn bg-surface overflow-hidden shadow-2xs">
          <Button
            variant="ghost"
            size="iconSm"
            onClick={undo}
            disabled={!canUndo()}
            title="Desfazer (Ctrl+Z)"
            aria-label="Desfazer"
            className="rounded-none border-r border-border h-7 sm:h-8 w-7 sm:w-8 text-foreground-secondary hover:text-foreground"
          >
            <Undo2 size={13} />
          </Button>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={redo}
            disabled={!canRedo()}
            title="Refazer (Ctrl+Shift+Z)"
            aria-label="Refazer"
            className="rounded-none h-7 sm:h-8 w-7 sm:w-8 text-foreground-secondary hover:text-foreground"
          >
            <Redo2 size={13} />
          </Button>
        </div>

        {/* Shortcuts Button (Desktop only) */}
        {onOpenShortcuts && (
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onOpenShortcuts}
            title="Atalhos de Teclado (?)"
            aria-label="Atalhos de Teclado"
            className="hidden xl:flex h-8 w-8 text-foreground-secondary hover:text-foreground border border-border rounded-btn bg-surface shadow-2xs"
          >
            <Keyboard size={15} />
          </Button>
        )}

        {/* Save as Project button when in playground (Desktop) */}
        {isPlayground && onSaveAsProject && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveAsProject}
            className="hidden md:flex gap-1.5 text-xs font-semibold h-8 border-primary/20 text-primary bg-primary-soft/60 hover:bg-primary-soft shadow-2xs"
          >
            <BookmarkPlus size={14} className="text-primary" />
            <span className="hidden lg:inline">Salvar como Projeto</span>
          </Button>
        )}

        {/* Import Diagram Button (Desktop) */}
        {onOpenImportDialog && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenImportDialog}
            className="hidden md:flex gap-1.5 text-xs font-semibold h-8 border-border shadow-2xs"
            title="Importar diagrama gerado por IA ou arquivo .mcss.json"
          >
            <Upload size={14} className="text-foreground-secondary" />
            <span className="hidden lg:inline">Importar</span>
          </Button>
        )}

        {/* AI Kit Export Button (Desktop) */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadAiKitZip()}
          className="hidden lg:flex gap-1.5 text-xs font-semibold h-8 border-border shadow-2xs text-foreground hover:text-primary"
          title="Baixar Kit para IA (.zip) com documentação e catálogo"
        >
          <Bot size={14} className="text-primary" />
          <span className="hidden xl:inline">Kit para IA</span>
        </Button>

        {/* Scene Script Button (Desktop) */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSceneDrawer}
          className="hidden sm:flex gap-1.5 text-xs font-semibold h-8 border-border shadow-2xs"
        >
          <Film size={14} className="text-foreground-secondary" />
          <span>Cenas ({project?.scenes?.length || 0})</span>
        </Button>

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenExportDialog}
          className="gap-1 sm:gap-1.5 text-xs font-semibold h-7 sm:h-8 px-2 sm:px-3 border-border shadow-2xs"
          title="Exportar projeto"
        >
          <Download size={13} className="text-foreground-secondary" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>

        {/* Presentation Button */}
        <Button
          variant="accentSubtle"
          size="sm"
          onClick={onTogglePresentation}
          className="gap-1 sm:gap-1.5 text-xs font-semibold h-7 sm:h-8 px-2 sm:px-3 shadow-2xs shrink-0"
          title="Apresentar em tela cheia (P)"
        >
          <Play size={12} className="fill-primary text-primary" />
          <span className="hidden sm:inline">Apresentar</span>
        </Button>

        {/* Mobile Overflow Menu Button (< sm screens) */}
        <div className="relative sm:hidden" ref={mobileMenuRef}>
          <Button
            variant="outline"
            size="iconSm"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Mais opções"
            className="h-7 w-7 border-border text-foreground-secondary"
          >
            <MoreHorizontal size={14} />
          </Button>

          {isMobileMenuOpen && (
            <div className="feedback-surface absolute right-0 top-8 z-50 w-48 p-1 text-xs space-y-0.5 shadow-raised animate-fade-in">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onToggleSceneDrawer();
                }}
                className="w-full flex items-center gap-2 text-left px-2.5 py-2 rounded-sm hover:bg-surface-muted text-foreground"
              >
                <Film size={14} className="text-foreground-secondary" />
                <span>Roteiro de Cenas ({project?.scenes?.length || 0})</span>
              </button>

              {onOpenImportDialog && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenImportDialog();
                  }}
                  className="w-full flex items-center gap-2 text-left px-2.5 py-2 rounded-sm hover:bg-surface-muted text-foreground"
                >
                  <Upload size={14} className="text-foreground-secondary" />
                  <span>Importar (.mcss.json)</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  downloadAiKitZip();
                }}
                className="w-full flex items-center gap-2 text-left px-2.5 py-2 rounded-sm hover:bg-surface-muted text-foreground"
              >
                <Bot size={14} className="text-primary" />
                <span>Baixar Kit para IA (.zip)</span>
              </button>

              {isPlayground && onSaveAsProject && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSaveAsProject();
                  }}
                  className="w-full flex items-center gap-2 text-left px-2.5 py-2 rounded-sm hover:bg-primary-soft text-primary font-semibold"
                >
                  <BookmarkPlus size={14} />
                  <span>Salvar como Projeto</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
