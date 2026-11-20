'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface AppAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
}

export function AppAlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'error',
}: AppAlertModalProps) {
  if (!isOpen) return null;

  const config = {
    error: {
      icon: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
      defaultTitle: 'Atenção',
      headerBg: 'bg-red-50/70',
      border: 'border-red-200',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
      defaultTitle: 'Aviso',
      headerBg: 'bg-amber-50/70',
      border: 'border-amber-200',
    },
    info: {
      icon: <Info className="h-5 w-5 text-indigo-600 shrink-0" />,
      defaultTitle: 'Informação',
      headerBg: 'bg-indigo-50/70',
      border: 'border-indigo-200',
    },
    success: {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
      defaultTitle: 'Sucesso',
      headerBg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs animate-fade-in select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        className="relative flex flex-col w-full max-w-md rounded-2xl border border-studio-border bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between border-b border-studio-border px-5 py-3.5',
            config.headerBg
          )}
        >
          <div className="flex items-center gap-2">
            {config.icon}
            <h3 id="alert-dialog-title" className="text-sm font-bold text-slate-900">
              {title || config.defaultTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message Body */}
        <div className="p-5 text-xs text-slate-700 leading-relaxed">
          {message}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-studio-border px-5 py-3 bg-slate-50/60">
          <Button
            size="sm"
            onClick={onClose}
            className="text-xs h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
}
