'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudioHeader } from '@/components/layout/studio-header';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
import {
  getTemplates,
  type ArchitectureTemplate,
} from '@/data/templates';
import { projectRepository } from '@/lib/storage/project-repository';
import type { Project } from '@/lib/schemas';

export default function TemplatesPage() {
  const router = useRouter();
  const templates = getTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<ArchitectureTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleUseTemplate = async (template: ArchitectureTemplate) => {
    try {
      setIsCreating(true);
      const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();

      const newProject: Project = {
        ...template.projectData,
        id: newId,
        title: `${template.title} (Cópia)`,
        createdAt: now,
        updatedAt: now,
      };

      await projectRepository.saveProject(newProject);
      router.push(`/editor?project=${newId}`);
    } catch (err) {
      console.error('Falha ao criar projeto a partir do template:', err);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans select-none">
      {/* Top Header */}
      <StudioHeader activeTab="templates" />

      {/* Hero Banner */}
      <div className="border-b border-border bg-surface py-4 sm:py-6 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Templates de Arquitetura
          </h1>
        </div>
      </div>

      {/* Main Grid */}
      <main id="main-content" className="flex-1 p-3.5 sm:p-6 lg:p-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="flex flex-col justify-between hover:shadow-raised hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-standard ease-out-editorial border-border bg-surface"
            >
              <CardHeader className="space-y-2 sm:space-y-2.5 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {template.providers.map((p) => (
                      <span key={p} title={p} className="inline-flex">
                        <ProviderIcon providerId={p} size={18} />
                      </span>
                    ))}
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {template.complexity}
                  </Badge>
                </div>

                <CardTitle className="text-sm sm:text-base leading-snug">
                  {template.title}
                </CardTitle>

                <CardDescription className="text-xs leading-relaxed line-clamp-3">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 p-4 sm:p-5 pt-0 sm:pt-0">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-foreground-secondary uppercase tracking-wider">
                    Serviços Principais:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {template.keyServices.map((svc) => (
                      <span
                        key={svc}
                        className="text-[10px] px-2 py-0.5 rounded-btn bg-surface-muted text-foreground-secondary border border-border"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 sm:p-5 pt-2 sm:pt-2 border-t border-border/60 flex items-center justify-between">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="text-xs text-foreground-secondary hover:text-primary font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>Ver prévia</span>
                  <ArrowUpRight size={12} />
                </button>

                <Button
                  size="sm"
                  variant="default"
                  disabled={isCreating}
                  onClick={() => handleUseTemplate(template)}
                  className="gap-1.5 text-xs h-8"
                >
                  <span>Usar Template</span>
                  <ArrowRight size={13} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="feedback-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="feedback-surface w-full max-w-xl p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {selectedTemplate.title}
                </h3>
                <p className="text-xs text-foreground-secondary mt-1">
                  {selectedTemplate.useCase}
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-foreground-secondary hover:text-foreground text-sm font-semibold p-1 rounded-md shrink-0"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-foreground/90 leading-relaxed">
              {selectedTemplate.description}
            </p>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-foreground">
                Nós configurados no diagrama ({selectedTemplate.projectData.nodes.length}):
              </span>
              <ul className="text-xs text-foreground-secondary space-y-1 list-disc pl-5">
                {selectedTemplate.projectData.nodes.map((n) => (
                  <li key={n.id}>
                    <span className="font-medium text-foreground">{n.label}</span> —{' '}
                    {n.notes}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTemplate(null)}
              >
                Fechar
              </Button>
              <Button
                size="sm"
                variant="default"
                disabled={isCreating}
                onClick={() => {
                  const temp = selectedTemplate;
                  setSelectedTemplate(null);
                  handleUseTemplate(temp);
                }}
              >
                Criar Projeto deste Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
