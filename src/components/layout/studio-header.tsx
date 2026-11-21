'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand/brand-logo';
import { cn } from '@/lib/utils';

export type StudioTab = 'home' | 'projects' | 'templates';

interface StudioHeaderProps {
  activeTab?: StudioTab;
  onOpenImport?: () => void;
  actions?: React.ReactNode;
}

export function StudioHeader({
  activeTab = 'home',
  onOpenImport,
  actions,
}: StudioHeaderProps) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/90 backdrop-blur-md px-6 sm:px-10 select-none">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:opacity-95 transition-opacity" title="MultiCloud Solution Studio">
            <BrandLogo size="lg" />
          </Link>

          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5" aria-label="Navegação do estúdio">
            <Link
              href="/"
              aria-current={activeTab === 'home' ? 'page' : undefined}
              className={cn(
                'px-3 py-1.5 rounded-btn flex items-center gap-1.5 text-xs transition-colors',
                activeTab === 'home'
                  ? 'bg-primary-soft text-primary font-semibold border border-primary/20 shadow-2xs'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface-muted'
              )}
            >
              <span>Início</span>
            </Link>

            <Link
              href="/projects"
              aria-current={activeTab === 'projects' ? 'page' : undefined}
              className={cn(
                'px-3 py-1.5 rounded-btn flex items-center gap-1.5 text-xs transition-colors',
                activeTab === 'projects'
                  ? 'bg-primary-soft text-primary font-semibold border border-primary/20 shadow-2xs'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface-muted'
              )}
            >
              <span>Projetos</span>
            </Link>

            <Link
              href="/templates"
              aria-current={activeTab === 'templates' ? 'page' : undefined}
              className={cn(
                'px-3 py-1.5 rounded-btn flex items-center gap-1.5 text-xs transition-colors',
                activeTab === 'templates'
                  ? 'bg-primary-soft text-primary font-semibold border border-primary/20 shadow-2xs'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface-muted'
              )}
            >
              <span>Templates</span>
            </Link>
          </nav>
        </div>

        {/* Actions Slot */}
        <div className="flex items-center gap-2.5">
          {actions ? (
            actions
          ) : (
            <>
              {onOpenImport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenImport}
                  className="gap-1.5 text-xs font-semibold h-8"
                  title="Importar diagrama MCSS (.json)"
                >
                  <Upload size={14} className="text-foreground-secondary" />
                  <span>Importar</span>
                </Button>
              )}

              <Link href="/editor">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 text-xs font-semibold h-8 px-3.5"
                >
                  <Plus size={14} />
                  <span>Novo Projeto</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}
