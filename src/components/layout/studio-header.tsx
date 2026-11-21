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

      <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-border bg-surface/90 backdrop-blur-md px-3 sm:px-6 lg:px-10 select-none">
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <Link
            href="/"
            className="hover:opacity-95 transition-opacity shrink-0"
            title="MultiCloud Solution Studio"
          >
            <BrandLogo size="lg" />
          </Link>

          <div className="h-4 sm:h-5 w-px bg-border hidden md:block" />

          {/* Navigation Tabs */}
          <nav
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1"
            aria-label="Navegação do estúdio"
          >
            <Link
              href="/"
              aria-current={activeTab === 'home' ? 'page' : undefined}
              className={cn(
                'px-2 sm:px-3 py-1 sm:py-1.5 rounded-btn flex items-center gap-1 text-[11px] sm:text-xs transition-colors whitespace-nowrap',
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
                'px-2 sm:px-3 py-1 sm:py-1.5 rounded-btn flex items-center gap-1 text-[11px] sm:text-xs transition-colors whitespace-nowrap',
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
                'px-2 sm:px-3 py-1 sm:py-1.5 rounded-btn flex items-center gap-1 text-[11px] sm:text-xs transition-colors whitespace-nowrap',
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
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-2">
          {actions ? (
            actions
          ) : (
            <>
              {onOpenImport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenImport}
                  className="gap-1 sm:gap-1.5 text-xs font-semibold h-8 px-2 sm:px-3"
                  title="Importar diagrama MCSS (.json)"
                >
                  <Upload size={14} className="text-foreground-secondary" />
                  <span className="hidden sm:inline">Importar</span>
                </Button>
              )}

              <Link href="/editor">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1 sm:gap-1.5 text-xs font-semibold h-8 px-2 sm:px-3.5"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Novo Projeto</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}
