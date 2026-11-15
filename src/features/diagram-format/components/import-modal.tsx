'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileCode,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  validateMCSSDiagramJson,
  sanitizePastedJson,
  type ValidationReport,
} from '../validation/validator';
import { DiagramPreview } from './diagram-preview';
import type { MCSSDiagramDocument } from '../domain/diagram-format';
import { cn } from '@/lib/utils';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (document: MCSSDiagramDocument) => Promise<void>;
  isPlayground?: boolean;
}

export function ImportModal({
  isOpen,
  onClose,
  onConfirmImport,
  isPlayground = false,
}: ImportModalProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'file'>('paste');
  const [jsonText, setJsonText] = useState('');
  const [hasSanitizedFence, setHasSanitizedFence] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleValidate = (textToValidate: string) => {
    let clean = textToValidate.trim();
    if (clean.startsWith('```')) {
      clean = sanitizePastedJson(clean);
      setHasSanitizedFence(true);
      setJsonText(clean);
    } else {
      setHasSanitizedFence(false);
    }

    const valReport = validateMCSSDiagramJson(clean);
    setReport(valReport);
  };

  const handleFileSelected = (file: File) => {
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      setJsonText(content);
      handleValidate(content);
    };
    reader.readAsText(file);
  };

  const handleConfirm = async () => {
    if (!report?.isValid || !report.document) return;
    setIsSubmitting(true);
    try {
      await onConfirmImport(report.document);
      onClose();
    } catch (err: unknown) {
      alert(`Falha ao importar: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs animate-fade-in select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-dialog-title"
        className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl border border-studio-border bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-studio-border px-6 py-4 bg-slate-50/60">
          <div>
            <h2 id="import-dialog-title" className="text-sm font-bold text-slate-900">
              Importar Diagrama
            </h2>
            <p className="text-xs text-slate-500">
              Cole o JSON gerado por IA ou selecione um arquivo compatível (.mcss.json).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-studio-border px-6 pt-3 bg-white">
          <button
            onClick={() => setActiveTab('paste')}
            className={cn(
              'flex items-center gap-2 pb-2.5 text-xs font-semibold border-b-2 transition-colors',
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <FileCode size={14} />
            <span>Colar JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={cn(
              'flex items-center gap-2 pb-2.5 text-xs font-semibold border-b-2 transition-colors',
              activeTab === 'file'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <Upload size={14} />
            <span>Selecionar arquivo</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'paste' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">JSON do Diagrama</span>
                {hasSanitizedFence && (
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Cercas Markdown removidas
                  </span>
                )}
              </div>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='{\n  "format": "mcss.diagram",\n  "schemaVersion": "1.0.0",\n  "metadata": { "title": "Minha Solução" },\n  "diagram": { "nodes": [], "edges": [] }\n}'
                rows={7}
                className="w-full rounded-btn border border-slate-200 bg-slate-50/50 p-3 font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => handleValidate(jsonText)}
                  disabled={!jsonText.trim()}
                  className="gap-1.5 text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Sparkles size={13} />
                  <span>Validar JSON</span>
                </Button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileSelected(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-colors text-center',
                dragOver
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.mcss.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelected(file);
                }}
              />
              <Upload size={28} className="text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                {selectedFileName || 'Clique para selecionar ou arraste o arquivo (.mcss.json)'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Leitura local no navegador sem envio a servidores externos
              </p>
            </div>
          )}

          {/* Validation Feedback & Preview */}
          {report && (
            <div className="space-y-3 pt-2 border-t border-studio-border">
              {/* Summary / Status Chip */}
              {report.isValid ? (
                <div className="flex items-center gap-2 p-3 rounded-btn bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <div className="font-semibold">
                    Arquivo compatível com o Studio • {report.summary.nodeCount} nós •{' '}
                    {report.summary.edgeCount} conexões • {report.summary.providers.length}{' '}
                    provedores
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-btn bg-red-50 text-red-900 border border-red-200 text-xs">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <div className="font-semibold">Corrija os erros antes de importar</div>
                </div>
              )}

              {/* Issues List (Errors & Warnings) */}
              {report.issues.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto rounded-btn border border-slate-200 p-2.5 bg-slate-50/70 text-xs divide-y divide-slate-200/60">
                  {report.issues.map((issue, idx) => (
                    <div key={idx} className="pt-1.5 first:pt-0 flex items-start gap-2">
                      {issue.severity === 'error' ? (
                        <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-900">{issue.message}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {issue.path} {issue.hint && `• ${issue.hint}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Isolated Visual Preview */}
              {report.isValid && report.document && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700">
                    Pré-visualização da Arquitetura
                  </span>
                  <DiagramPreview document={report.document} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-studio-border px-6 py-4 bg-slate-50/60">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
            Cancelar
          </Button>

          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!report?.isValid || isSubmitting}
            className="gap-1.5 text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <span>{isPlayground ? 'Abrir no Playground' : 'Criar novo projeto'}</span>
            <ArrowRight size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}
