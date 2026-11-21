'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Download,
  Upload,
  FileCode,
  Image as ImageIcon,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useEditorStore,
  flowNodeToStudioNode,
  flowEdgeToStudioEdge,
} from '@/features/canvas/store/editor-store';
import { exportProjectToJson } from '../export-project';
import { exportProjectToPng } from '../export-png';
import { importProjectFromJson } from '../import-project';
import { AppAlertModal, type AppAlertModalProps } from '@/components/ui/app-alert-modal';
import type { Project } from '@/lib/schemas';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);

  const [alertModalState, setAlertModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AppAlertModalProps['type'];
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
  });

  const { project, nodes, edges, setProject } = useEditorStore();

  // Construct active project snapshot including live canvas nodes/edges (even in playground mode)
  const activeProjectSnapshot = useMemo<Project | null>(() => {
    if (!project && nodes.length === 0) return null;

    const base = project || {
      id: 'diagram',
      title: 'Diagrama',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
      catalogVersion: '1.0.0',
      viewport: { x: 0, y: 0, zoom: 1 },
      drawings: [],
      scenes: [],
      settings: { snapToGrid: false, showGrid: true, reduceMotion: false },
    };

    return {
      ...base,
      nodes: nodes.map(flowNodeToStudioNode),
      edges: edges.map(flowEdgeToStudioEdge),
    };
  }, [project, nodes, edges]);

  if (!isOpen) return null;

  const handleExportJson = () => {
    if (!activeProjectSnapshot || activeProjectSnapshot.nodes.length === 0) {
      setAlertModalState({
        isOpen: true,
        title: 'Diagrama Vazio',
        message: 'O projeto não possui elementos para exportar. Adicione componentes antes de baixar o JSON.',
        type: 'warning',
      });
      return;
    }
    exportProjectToJson(activeProjectSnapshot);
  };

  const handleExportPng = async (scale: number) => {
    if (!activeProjectSnapshot || activeProjectSnapshot.nodes.length === 0) {
      setAlertModalState({
        isOpen: true,
        title: 'Diagrama Vazio',
        message: 'O projeto não possui elementos para exportar. Adicione componentes antes de exportar como imagem.',
        type: 'warning',
      });
      return;
    }

    setIsExportingPng(true);
    try {
      await exportProjectToPng(activeProjectSnapshot, { scale });
    } catch (err: unknown) {
      setAlertModalState({
        isOpen: true,
        title: 'Falha na Exportação',
        message: err instanceof Error ? err.message : 'Não foi possível gerar a imagem do diagrama.',
        type: 'error',
      });
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = await importProjectFromJson(text);
      setProject(imported);
      router.push(`/editor?project=${imported.id}`);
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha ao processar arquivo de importação.';
      setImportError(message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div className="feedback-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
        <div className="feedback-surface w-full max-w-md p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Download size={18} className="text-primary" />
              <h3 className="text-base font-bold text-foreground">
                Exportar & Importar Projeto
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-foreground-secondary hover:text-foreground p-1 text-sm font-semibold rounded-md"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* Export JSON */}
            <div className="rounded-btn border border-border p-3 flex items-center justify-between hover:bg-surface-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary-soft text-primary">
                  <FileCode size={18} />
                </div>
                <div className="text-xs font-semibold text-foreground">
                  Arquivo do Projeto (.mcss.json)
                </div>
              </div>
              <Button size="sm" variant="default" onClick={handleExportJson} className="text-xs h-7">
                Baixar JSON
              </Button>
            </div>

            {/* Export PNG */}
            <div className="rounded-btn border border-border p-3 flex items-center justify-between hover:bg-surface-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-emerald-500/10 text-emerald-700">
                  <ImageIcon size={18} />
                </div>
                <div className="text-xs font-semibold text-foreground">
                  Imagem PNG (2x)
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={isExportingPng}
                onClick={() => handleExportPng(2)}
                className="text-xs h-7"
              >
                {isExportingPng ? 'Gerando...' : 'Exportar PNG'}
              </Button>
            </div>

            {/* Import JSON */}
            <div className="rounded-btn border border-border p-3 flex items-center justify-between hover:bg-surface-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-amber-500/10 text-amber-700">
                  <Upload size={18} />
                </div>
                <div className="text-xs font-semibold text-foreground">
                  Importar Arquivo (.mcss.json)
                </div>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.mcss.json"
                  onChange={handleFileChange}
                  className="hidden"
                  id="import-project-file"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs h-7"
                >
                  Selecionar
                </Button>
              </div>
            </div>
          </div>

          {/* Error message if import fails */}
          {importError && (
            <div className="rounded-btn bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{importError}</span>
            </div>
          )}

          <div className="pt-2 border-t border-border flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Fechar
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Application Alert Modal */}
      <AppAlertModal
        isOpen={alertModalState.isOpen}
        onClose={() => setAlertModalState((prev) => ({ ...prev, isOpen: false }))}
        title={alertModalState.title}
        message={alertModalState.message}
        type={alertModalState.type}
      />
    </>
  );
}
