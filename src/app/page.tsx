'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  LayoutTemplate,
  Trash2,
  Copy,
  Edit2,
  Calendar,
  Check,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
import { BrandLogo } from '@/components/brand/brand-logo';
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
    <div className="min-h-screen bg-studio-bg text-studio-text flex flex-col font-sans">
      {/* Top Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-studio-border bg-white px-6 z-10 select-none">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <BrandLogo size="lg" />
        </Link>

        {/* Quick Action Navigation */}
        <div className="flex items-center gap-2">
          <Link href="/playground">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium border-amber-300 bg-amber-50/60 text-amber-900 hover:bg-amber-100/80"
              title="Abrir editor rápido em memória sem salvar"
            >
              <Sparkles size={13} className="text-amber-600" />
              <span>Playground</span>
            </Button>
          </Link>

          <Link href="/templates">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <LayoutTemplate size={13} />
              <span>Templates</span>
            </Button>
          </Link>

          <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/editor')}
            className="gap-1.5 text-xs font-medium"
          >
            <Plus size={14} />
            <span>Novo Projeto</span>
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-6">
        {/* Header Title & Actions Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-studio-border pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-studio-text">
              Projetos
            </h1>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-studio-secondary pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar projetos..."
              className="pl-8 text-xs h-8 bg-white"
            />
          </div>
        </div>

        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <div className="rounded-card border border-dashed border-studio-border bg-white p-10 text-center space-y-3">
            <h3 className="text-sm font-semibold text-studio-text">
              Nenhum projeto salvo
            </h3>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Link href="/playground">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-amber-300 text-amber-900 bg-amber-50"
                >
                  Abrir Playground
                </Button>
              </Link>
              <Button
                size="sm"
                variant="default"
                onClick={() => router.push('/editor')}
                className="text-xs"
              >
                Criar Projeto
              </Button>
            </div>
          </div>
        )}

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => (
            <Card
              key={p.id}
              className="flex flex-col justify-between hover:shadow-sm transition-all border-studio-border bg-white"
            >
              <CardHeader className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  {renamingId === p.id ? (
                    <div className="flex items-center gap-1 w-full">
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

                <div className="flex items-center gap-1.5 pt-0.5">
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

              <CardFooter className="p-2.5 bg-slate-50/70 border-t border-studio-border flex items-center justify-between">
                <div className="flex items-center gap-0.5">
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

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-card border border-studio-border bg-white p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
              <AlertTriangle size={18} />
              <span>Confirmar Exclusão</span>
            </div>

            <p className="text-xs text-studio-secondary leading-relaxed">
              Tem certeza que deseja excluir{' '}
              <strong className="text-studio-text">&quot;{deletingProject.title}&quot;</strong>?
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
