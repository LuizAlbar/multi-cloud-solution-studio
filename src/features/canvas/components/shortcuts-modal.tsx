'use client';

import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['D', 'Del'], description: 'Excluir nó ou conexão selecionada' },
  { keys: ['V'], description: 'Ferramenta de Seleção de elementos' },
  { keys: ['H', 'Espaço'], description: 'Ferramenta de Navegação / Mover tela (Pan)' },
  { keys: ['Ctrl', 'Z'], description: 'Desfazer última alteração' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Refazer alteração' },
  { keys: ['Ctrl', 'K'], description: 'Focar busca no catálogo multicloud' },
  { keys: ['F'], description: 'Ajustar zoom e enquadrar todo o diagrama (Fit view)' },
  { keys: ['P'], description: 'Alternar Modo Apresentação (Tela cheia)' },
  { keys: ['Esc'], description: 'Deselecionar elemento ou sair da apresentação' },
  { keys: ['?'], description: 'Abrir este painel de atalhos' },
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="feedback-overlay fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-dialog-title"
        className="feedback-surface relative flex flex-col w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-surface-muted/50">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary shrink-0" />
            <h3 id="shortcuts-dialog-title" className="text-sm font-bold text-foreground">
              Atalhos de Teclado
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-secondary hover:text-foreground p-1 rounded-md transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto divide-y divide-border/60">
          {SHORTCUTS.map((item, index) => (
            <div key={index} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <span className="text-xs text-foreground font-medium">
                {item.description}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {item.keys.map((k, kIdx) => (
                  <React.Fragment key={kIdx}>
                    <kbd className="inline-flex items-center justify-center px-2 py-0.5 min-w-[24px] h-6 rounded-md bg-surface-muted border border-border text-[11px] font-mono font-bold text-foreground shadow-2xs">
                      {k}
                    </kbd>
                    {kIdx < item.keys.length - 1 && (
                      <span className="text-[10px] text-foreground-secondary font-bold">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-5 py-3 bg-surface-muted/50">
          <Button
            size="sm"
            variant="default"
            onClick={onClose}
            className="text-xs h-8 px-4 font-semibold"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
