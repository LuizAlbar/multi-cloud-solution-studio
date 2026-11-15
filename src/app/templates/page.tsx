'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  ArrowRight,
  ChevronLeft,
  CheckCircle,
  Sparkles,
  Info,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
import { BrandLogo } from '@/components/brand/brand-logo';
import {
  getTemplates,
  getTemplateById,
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
    <div className="min-h-screen bg-studio-bg text-studio-text flex flex-col">
      {/* Top Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-studio-border bg-white px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <BrandLogo size="lg" />
          </Link>

          <div className="h-4 w-px bg-studio-border mx-1" />

          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-studio-secondary hover:text-studio-text"
          >
            <ChevronLeft size={14} />
            <span>Voltar aos Projetos</span>
          </Link>
        </div>

        <Link href="/editor">
          <Button size="sm" variant="default" className="text-xs">
            Novo Projeto em Branco
          </Button>
        </Link>
      </header>

      {/* Hero Banner */}
      <div className="border-b border-studio-border bg-white py-6 px-6 sm:px-12">
        <div className="max-w-4xl">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-studio-text">
            Templates de Arquitetura
          </h1>
        </div>
      </div>

      {/* Main Grid */}
      <main className="flex-1 p-6 sm:p-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="flex flex-col justify-between hover:shadow-md transition-all border-studio-border"
            >
              <CardHeader className="space-y-2.5">
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

                <CardTitle className="text-base leading-snug">
                  {template.title}
                </CardTitle>

                <CardDescription className="text-xs leading-relaxed line-clamp-3">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-studio-secondary uppercase tracking-wider">
                    Serviços Principais:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {template.keyServices.map((svc) => (
                      <span
                        key={svc}
                        className="text-[10px] px-2 py-0.5 rounded-btn bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-studio-border flex items-center justify-between">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="text-xs text-studio-secondary hover:text-studio-accent font-medium inline-flex items-center gap-1"
                >
                  <span>Ver prévia</span>
                  <ArrowUpRight size={12} />
                </button>

                <Button
                  size="sm"
                  variant="default"
                  disabled={isCreating}
                  onClick={() => handleUseTemplate(template)}
                  className="gap-1.5 text-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-card border border-studio-border bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-studio-text">
                  {selectedTemplate.title}
                </h3>
                <p className="text-xs text-studio-secondary mt-1">
                  {selectedTemplate.useCase}
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-studio-secondary hover:text-studio-text text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedTemplate.description}
            </p>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-studio-text">
                Nós configurados no diagrama ({selectedTemplate.projectData.nodes.length}):
              </span>
              <ul className="text-xs text-studio-secondary space-y-1 list-disc pl-5">
                {selectedTemplate.projectData.nodes.map((n) => (
                  <li key={n.id}>
                    <span className="font-medium text-studio-text">{n.label}</span> —{' '}
                    {n.notes}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-studio-border flex justify-end gap-2">
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
