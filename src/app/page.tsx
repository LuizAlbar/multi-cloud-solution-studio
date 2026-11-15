'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Plus,
  Search,
  LayoutTemplate,
  Trash2,
  Copy,
  ExternalLink,
  Edit2,
  Upload,
  Calendar,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
import { projectRepository, type ProjectSummary } from '@/lib/storage/project-repository';
import type { ProviderId } from '@/lib/schemas';

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Rename state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');

  // Delete confirmation modal state
  const [deletingProject, setDeletingProject] = useState<ProjectSummary | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const list = await projectRepository.listProjects();
      setProjects(list);
    } catch (err) {
      console.error('Falha ao listar projetos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter((p) => p.title.toLowerCase().includes(q));
  }, [projects, searchQuery]);

  const handleCreateNew = () => {
    router.push('/editor');
  };

  const handleDuplicate = async (p: ProjectSummary) => {
    try {
      await projectRepository.duplicateProject(p.id);
      await fetchProjects();
    } catch (err) {
      console.error('Falha ao duplicar:', err);
    }
  };

  const handleSaveRename = async (id: string) => {
    if (!renamingTitle.trim()) return;
    try {
      const proj = await projectRepository.getProject(id);
      if (proj) {
        await projectRepository.saveProject({
          ...proj,
          title: renamingTitle.trim(),
        });
      }
      setRenamingId(null);
      await fetchProjects();
    } catch (err) {
      console.error('Falha ao renomear:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    try {
      await projectRepository.deleteProject(deletingProject.id);
      setDeletingProject(null);
      await fetchProjects();
    } catch (err) {
      console.error('Falha ao excluir:', err);
    }
  };

  return (
    <div className="min-h-screen bg-studio-bg text-studio-text flex flex-col">
      {/* Top Header */}
      <header className="flex h-14 w-full items-center justify-between border-b border-studio-border bg-white px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-studio-accent text-white shadow-xs">
            <Layers size={18} />
          </div>
          <span className="font-semibold text-sm tracking-tight text-studio-text">
            MultiCloud Solution Studio
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/templates">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <LayoutTemplate size={14} />
              <span>Templates</span>
            </Button>
          </Link>

          <Button
            variant="default"
            size="sm"
            onClick={handleCreateNew}
            className="gap-1.5 text-xs"
          >
            <Plus size={14} />
            <span>Novo Projeto</span>
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-6">
        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-studio-secondary pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar projetos pelo nome..."
              className="pl-9 text-xs h-9 bg-white"
            />
          </div>

          <span className="text-xs text-studio-secondary self-end sm:self-center">
            {projects.length} {projects.length === 1 ? 'projeto local' : 'projetos locais'}
          </span>
        </div>

        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <div className="rounded-card border border-dashed border-studio-border bg-white p-12 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-studio-highlight text-studio-accent mx-auto">
              <Layers size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-studio-text">
                Nenhum projeto local encontrado
              </h3>
              <p className="text-xs text-studio-secondary max-w-sm mx-auto">
                Crie um novo projeto vazio ou escolha um dos 5 templates corporativos prontos para começar.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/templates">
                <Button variant="outline" size="sm" className="text-xs">
                  Explorar Templates
                </Button>
              </Link>
              <Button size="sm" variant="default" onClick={handleCreateNew} className="text-xs">
                Criar Projeto
              </Button>
            </div>
          </div>
        )}

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => (
            <Card
              key={p.id}
              className="flex flex-col justify-between hover:shadow-md transition-all border-studio-border bg-white"
            >
              <CardHeader className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  {renamingId === p.id ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <Input
                        value={renamingTitle}
                        onChange={(e) => setRenamingTitle(e.target.value)}
                        className="h-7 text-xs font-semibold"
                        autoFocus
                      />
                      <Button
                        size="iconSm"
                        variant="default"
                        onClick={() => handleSaveRename(p.id)}
                      >
                        <Check size={12} />
                      </Button>
                    </div>
                  ) : (
                    <CardTitle
                      onClick={() => router.push(`/editor?project=${p.id}`)}
                      className="text-sm font-semibold hover:text-studio-accent cursor-pointer leading-snug line-clamp-2"
                    >
                      {p.title}
                    </CardTitle>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  {p.providers.length > 0 ? (
                    p.providers.map((prov) => (
                      <span key={prov} title={prov} className="inline-flex">
                        <ProviderIcon providerId={prov as ProviderId} size={16} />
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400">Sem provedores</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between text-[11px] text-studio-secondary border-t border-slate-100 pt-2">
                  <span>{p.nodeCount} nós • {p.edgeCount} conexões</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(p.updatedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-3 bg-slate-50/70 border-t border-studio-border flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => {
                      setRenamingId(p.id);
                      setRenamingTitle(p.title);
                    }}
                    title="Renomear"
                    aria-label="Renomear"
                  >
                    <Edit2 size={13} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => handleDuplicate(p)}
                    title="Duplicar projeto"
                    aria-label="Duplicar"
                  >
                    <Copy size={13} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => setDeletingProject(p)}
                    title="Excluir projeto"
                    aria-label="Excluir"
                    className="hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>

                <Link href={`/editor?project=${p.id}`}>
                  <Button size="sm" variant="default" className="text-xs h-7 px-3">
                    <span>Abrir</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Delete Confirmation Modal (RF-01) */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-card border border-studio-border bg-white p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
              <AlertTriangle size={18} />
              <span>Confirmar Exclusão</span>
            </div>

            <p className="text-xs text-studio-secondary leading-relaxed">
              Tem certeza que deseja excluir o projeto{' '}
              <strong className="text-studio-text">&quot;{deletingProject.title}&quot;</strong>?
              Esta ação removerá os dados salvos localmente no navegador.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-studio-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingProject(null)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                className="text-xs"
              >
                Excluir Projeto
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
