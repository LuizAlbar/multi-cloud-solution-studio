import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Download,
  Upload,
  FileCode,
  Image as ImageIcon,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportProjectToJson } from '../export-project';
import { importProjectFromJson } from '../import-project';
import { exportProjectToPng } from '../export-png';
import { useEditorStore } from '@/features/canvas/store/editor-store';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const router = useRouter();
  const { project, setProject } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importError, setImportError] = useState<string | null>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);

  if (!isOpen || !project) return null;

  const handleExportJson = () => {
    exportProjectToJson(project);
  };

  const handleExportPng = async (scale: number) => {
    setIsExportingPng(true);
    try {
      await exportProjectToPng(project, { scale });
    } catch (err) {
      console.error('Falha ao exportar PNG:', err);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-md rounded-card border border-studio-border bg-white p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-studio-border pb-3">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-studio-accent" />
            <h3 className="text-base font-bold text-studio-text">
              Exportar & Importar Projeto
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-studio-secondary hover:text-studio-text p-1 text-sm font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Export JSON */}
          <div className="rounded-btn border border-studio-border p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-blue-50 text-blue-600">
                <FileCode size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-studio-text">
                  Arquivo do Projeto (.mcss.json)
                </div>
                <div className="text-[11px] text-studio-secondary">
                  Salva o diagrama completo para backup ou compartilhamento.
                </div>
              </div>
            </div>
            <Button size="sm" variant="default" onClick={handleExportJson} className="text-xs">
              Baixar JSON
            </Button>
          </div>

          {/* Export PNG */}
          <div className="rounded-btn border border-studio-border p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-emerald-50 text-emerald-600">
                <ImageIcon size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-studio-text">
                  Imagem PNG em Alta Resolução
                </div>
                <div className="text-[11px] text-studio-secondary">
                  Exporta imagem nítida com fundo claro para apresentações.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled={isExportingPng}
                onClick={() => handleExportPng(2)}
                className="text-xs"
              >
                {isExportingPng ? 'Gerando...' : 'PNG (2x)'}
              </Button>
            </div>
          </div>

          {/* Import JSON */}
          <div className="rounded-btn border border-studio-border p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-amber-50 text-amber-600">
                <Upload size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-studio-text">
                  Importar Arquivo (.mcss.json)
                </div>
                <div className="text-[11px] text-studio-secondary">
                  Carrega um projeto como nova cópia independente.
                </div>
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
                className="text-xs"
              >
                Selecionar Arquivo
              </Button>
            </div>
          </div>
        </div>

        {/* Error message if import fails */}
        {importError && (
          <div className="rounded-btn bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{importError}</span>
          </div>
        )}

        <div className="pt-2 border-t border-studio-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
