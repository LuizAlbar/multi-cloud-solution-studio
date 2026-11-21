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
      icon: <AlertCircle className="h-4 w-4 text-destructive shrink-0" />,
      defaultTitle: 'Atenção',
      headerBg: 'bg-destructive/10',
      border: 'border-destructive/20',
    },
    warning: {
      icon: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />,
      defaultTitle: 'Aviso',
      headerBg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    info: {
      icon: <Info className="h-4 w-4 text-primary shrink-0" />,
      defaultTitle: 'Informação',
      headerBg: 'bg-primary-soft',
      border: 'border-primary/20',
    },
    success: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
      defaultTitle: 'Sucesso',
      headerBg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
  }[type];

  return (
    <div className="feedback-overlay fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        className="feedback-surface relative flex flex-col w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between border-b border-border px-5 py-3.5',
            config.headerBg
          )}
        >
          <div className="flex items-center gap-2">
            {config.icon}
            <h3 id="alert-dialog-title" className="text-sm font-semibold text-foreground">
              {title || config.defaultTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-secondary hover:text-foreground p-1 rounded-md transition-colors"
            aria-label="Fechar"
          >
            <X size={15} />
          </button>
        </div>

        {/* Message Body */}
        <div className="p-5 text-xs text-foreground/90 leading-relaxed">
          {message}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-5 py-3 bg-surface-muted/50">
          <Button
            size="sm"
            variant="default"
            onClick={onClose}
            className="text-xs h-8 px-4 font-semibold"
          >
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
}
