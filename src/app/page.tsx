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
  Play,
  FolderPlus,
  LayoutGrid,
  List,
  Star,
  Share2,
  MoreVertical,
  X,
  Layers,
  ArrowRight,
  Clock,
  Box,
  Folder,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
import { ServiceIcon } from '@/features/catalog/components/service-icons';
import { BrandLogo } from '@/components/brand/brand-logo';
import { projectRepository, type ProjectSummary } from '@/lib/storage/project-repository';
import { getCatalogServiceById } from '@/features/catalog/catalog-service';
import { getTemplates, type ArchitectureTemplate } from '@/data/templates';
import type { Project, ProviderId } from '@/lib/schemas';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const templates = useMemo(() => getTemplates().slice(0, 3), []);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<ProviderId | 'todos'>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Active contextual menu per card
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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

  // Compute total components (nodes count) across all saved projects
  const totalComponentsCount = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p.nodeCount || 0), 0);
  }, [projects]);

  // Compute provider distribution for filter chips
  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      p.providers.forEach((prov) => {
        counts[prov] = (counts[prov] || 0) + 1;
      });
    });
    return counts;
  }, [projects]);

  // Filter projects by search query and provider
  const filteredProjects = useMemo(() => {
    let result = projects;

    if (selectedProviderFilter !== 'todos') {
      result = result.filter((p) => p.providers.includes(selectedProviderFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    return result;
  }, [projects, selectedProviderFilter, searchQuery]);

  const handleToggleFavorite = async (e: React.MouseEvent, p: ProjectSummary) => {
    e.stopPropagation();
    try {
      const nextFav = await projectRepository.toggleFavorite(p.id);
      setProjects((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, isFavorite: nextFav } : item
        )
      );
    } catch (err) {
      console.error('Falha ao alternar favorito:', err);
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, p: ProjectSummary) => {
    e.stopPropagation();
    setActiveMenuId(null);
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

  const handleUseTemplate = async (template: ArchitectureTemplate) => {
    try {
      const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();

      const newProject: Project = {
        ...template.projectData,
        id: newId,
        title: `${template.title} (Cópia)`,
        createdAt: now,
        updatedAt: now,
        isFavorite: false,
      };

      await projectRepository.saveProject(newProject);
      router.push(`/editor?project=${newId}`);
    } catch (err) {
      console.error('Falha ao criar projeto a partir do template:', err);
    }
  };

  const formatRelativeDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return 'Atualizado agora';
    if (diffMins < 60) return `Atualizado há ${diffMins} min`;
    if (diffHours < 24 && d.getDate() === now.getDate()) return `Atualizado hoje às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return 'Atualizado ontem';
    return `Atualizado em ${d.toLocaleDateString('pt-BR')}`;
  };

  return (
    <div className="min-h-screen bg-studio-bg text-studio-text flex flex-col font-sans select-none">
      {/* 1. Global Navbar */}
      <header className="flex h-16 w-full items-center justify-between border-b border-studio-border bg-white px-6 sm:px-10 z-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:opacity-95 transition-opacity">
            <BrandLogo size="lg" />
          </Link>

          <div className="h-5 w-px bg-studio-border hidden sm:block" />

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="bg-indigo-50/80 text-indigo-900 font-semibold px-3 py-1.5 rounded-btn flex items-center gap-1.5 text-xs transition-colors"
            >
              <span>Início</span>
            </Link>
            <Link
              href="/projects"
              className="text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-btn flex items-center gap-1.5 text-xs font-medium transition-colors"
            >
              <span>Projetos</span>
            </Link>
            <Link
              href="/templates"
              className="text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-btn flex items-center gap-1.5 text-xs font-medium transition-colors"
            >
              <span>Templates</span>
            </Link>
          </nav>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/editor')}
            className="gap-1.5 text-xs font-semibold h-8 px-3.5 shadow-2xs"
          >
            <Plus size={14} />
            <span>Novo Projeto</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 sm:px-10 py-8 space-y-8">
        {/* 2. Hero / Welcome Banner */}
        <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-2">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              BEM-VINDO(A) AO
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              MultiCloud Solution Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Projete, conecte e visualize arquiteturas em múltiplas nuvens.
            </p>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="rounded-card border border-studio-border bg-white px-4 py-3 min-w-[110px] sm:min-w-[130px] shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Folder size={14} className="text-indigo-600" />
                <span className="font-medium">Projetos</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? '...' : projects.length}
              </div>
            </div>

            <div className="rounded-card border border-studio-border bg-white px-4 py-3 min-w-[110px] sm:min-w-[130px] shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <LayoutTemplate size={14} className="text-indigo-600" />
                <span className="font-medium">Templates</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                5
              </div>
            </div>

            <div className="rounded-card border border-studio-border bg-white px-4 py-3 min-w-[110px] sm:min-w-[130px] shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Box size={14} className="text-indigo-600" />
                <span className="font-medium">Componentes</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? '...' : totalComponentsCount}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Quick Action Cards (Trio) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card A: Modo Playground (Highlight) */}
          <Link
            href="/playground"
            className="group flex items-center justify-between p-4 rounded-card border border-[#d8caff] bg-[#f8f6ff] hover:bg-[#f2edff] hover:border-[#b49bff] transition-all shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-indigo-600 text-white shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <Play size={18} className="fill-white ml-0.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Modo Playground
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  Modele livremente, sem criar ou salvar um projeto.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-indigo-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>

          {/* Card B: Novo Projeto */}
          <Link
            href="/editor"
            className="group flex items-center justify-between p-4 rounded-card border border-studio-border bg-white hover:border-slate-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-slate-100 text-slate-700 group-hover:bg-slate-200 transition-colors shrink-0">
                <FolderPlus size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Novo Projeto
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  Crie um projeto salvo para organizar seus diagramas.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>

          {/* Card C: Explorar Templates */}
          <Link
            href="/templates"
            className="group flex items-center justify-between p-4 rounded-card border border-studio-border bg-white hover:border-slate-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-slate-100 text-slate-700 group-hover:bg-slate-200 transition-colors shrink-0">
                <LayoutTemplate size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Explorar Templates
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  Comece com uma arquitetura pronta e personalizável.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>
        </section>

        {/* 4. Projects Section */}
        <section id="projetos" className="space-y-4 pt-2">
          {/* Projects Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-studio-border pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 mr-2">
                Seus projetos
              </h2>

              {/* Provider Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSelectedProviderFilter('todos')}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full border transition-colors',
                    selectedProviderFilter === 'todos'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                      : 'border-studio-border bg-white text-slate-600 hover:bg-slate-50'
                  )}
                >
                  Todos ({projects.length})
                </button>

                {(['gcp', 'aws', 'azure', 'oci', 'cloudflare', 'supabase'] as const).map((prov) => {
                  const count = providerCounts[prov] || 0;
                  if (count === 0 && selectedProviderFilter !== prov) return null;

                  return (
                    <button
                      key={prov}
                      onClick={() =>
                        setSelectedProviderFilter(selectedProviderFilter === prov ? 'todos' : prov)
                      }
                      className={cn(
                        'text-xs px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1.5',
                        selectedProviderFilter === prov
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                          : 'border-studio-border bg-white text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <ProviderIcon providerId={prov} size={13} />
                      <span className="capitalize">{prov.toUpperCase()} ({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search and Grid/List Toggle */}
            <div className="flex items-center gap-2 self-end lg:self-center">
              <div className="relative w-64 sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar projetos..."
                  className="pl-8 pr-7 text-xs h-8 bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                    aria-label="Limpar busca"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-studio-border rounded-btn bg-white overflow-hidden p-0.5">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="iconSm"
                  onClick={() => setViewMode('grid')}
                  className={cn('h-7 w-7 rounded-sm', viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500')}
                  title="Visualização em Grade"
                  aria-label="Grade"
                >
                  <LayoutGrid size={13} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="iconSm"
                  onClick={() => setViewMode('list')}
                  className={cn('h-7 w-7 rounded-sm', viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500')}
                  title="Visualização em Lista"
                  aria-label="Lista"
                >
                  <List size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* Empty state when 0 projects */}
          {!isLoading && projects.length === 0 && (
            <div className="rounded-card border border-dashed border-studio-border bg-white p-12 text-center space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Nenhum projeto salvo
              </h3>
              <div className="flex items-center justify-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push('/playground')}
                  className="text-xs border-indigo-200 text-indigo-900 bg-indigo-50/50"
                >
                  Abrir Playground
                </Button>
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

          {/* Empty state when search/filter returns nothing */}
          {!isLoading && projects.length > 0 && filteredProjects.length === 0 && (
            <div className="rounded-card border border-studio-border bg-white p-8 text-center space-y-2">
              <p className="text-xs text-slate-500">
                Nenhum projeto corresponde ao filtro ou busca.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedProviderFilter('todos');
                }}
                className="text-xs"
              >
                Limpar Filtros
              </Button>
            </div>
          )}

          {/* Grid View Mode */}
          {viewMode === 'grid' && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/editor?project=${p.id}`)}
                  className="group relative flex flex-col justify-between rounded-card border border-studio-border bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer p-4 min-h-[190px]"
                >
                  {/* Top Bar: Providers & Actions */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {p.providers.length > 0 ? (
                          p.providers.map((prov) => (
                            <span key={prov} title={prov} className="inline-flex shrink-0">
                              <ProviderIcon providerId={prov} size={16} />
                            </span>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-slate-200 text-slate-400">
                            Vazio
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Favorite button */}
                        <button
                          onClick={(e) => handleToggleFavorite(e, p)}
                          className={cn(
                            'p-1 rounded-sm transition-colors',
                            p.isFavorite
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-slate-300 hover:text-slate-500'
                          )}
                          title={p.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                          aria-label="Favoritar"
                        >
                          <Star size={14} className={p.isFavorite ? 'fill-amber-400' : ''} />
                        </button>

                        {/* Menu ... */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === p.id ? null : p.id);
                            }}
                            className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Opções"
                            aria-label="Opções"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeMenuId === p.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-6 z-30 w-36 rounded-btn border border-studio-border bg-white p-1 shadow-lg text-xs space-y-0.5"
                            >
                              <button
                                onClick={() => router.push(`/editor?project=${p.id}`)}
                                className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-slate-100 text-slate-700"
                              >
                                Abrir
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setRenamingId(p.id);
                                  setRenamingTitle(p.title);
                                }}
                                className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-slate-100 text-slate-700"
                              >
                                Renomear
                              </button>
                              <button
                                onClick={(e) => handleDuplicate(e, p)}
                                className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-slate-100 text-slate-700"
                              >
                                Duplicar
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setDeletingProject(p);
                                }}
                                className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-red-50 text-red-600"
                              >
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    {renamingId === p.id ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 my-1"
                      >
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
                          className="h-7 w-7 shrink-0"
                        >
                          <Check size={12} />
                        </Button>
                      </div>
                    ) : (
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                        {p.title}
                      </h3>
                    )}

                    {/* Chips of Representative Services */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {p.services.length > 0 ? (
                        <>
                          {p.services.slice(0, 3).map((svcId) => {
                            const svc = getCatalogServiceById(svcId);
                            const name = svc?.displayName || svcId;
                            return (
                              <span
                                key={svcId}
                                className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 max-w-[120px] truncate"
                              >
                                {svc && (
                                  <ServiceIcon
                                    iconKey={svc.iconKey}
                                    providerId={svc.providerId}
                                    category={svc.category}
                                    size={12}
                                    className="shrink-0"
                                  />
                                )}
                                <span className="truncate">{name}</span>
                              </span>
                            );
                          })}
                          {p.services.length > 3 && (
                            <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                              +{p.services.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Diagrama vazio
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer: Date & Connections */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-3">
                    <span>{formatRelativeDate(p.updatedAt)}</span>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Share2 size={11} className="text-slate-400" />
                      <span>{p.edgeCount} {p.edgeCount === 1 ? 'conexão' : 'conexões'}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View Mode */}
          {viewMode === 'list' && filteredProjects.length > 0 && (
            <div className="rounded-card border border-studio-border bg-white overflow-hidden divide-y divide-slate-100">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/editor?project=${p.id}`)}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <button
                      onClick={(e) => handleToggleFavorite(e, p)}
                      className={cn(
                        'p-1 shrink-0',
                        p.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                      )}
                      aria-label="Favoritar"
                    >
                      <Star size={14} className={p.isFavorite ? 'fill-amber-400' : ''} />
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.providers.map((prov) => (
                        <span key={prov} className="inline-flex">
                          <ProviderIcon providerId={prov} size={15} />
                        </span>
                      ))}
                    </div>

                    <div className="text-xs font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {p.title}
                    </div>

                    <div className="hidden md:flex items-center gap-1 overflow-hidden">
                      {p.services.slice(0, 2).map((svcId) => {
                        const svc = getCatalogServiceById(svcId);
                        return (
                          <span
                            key={svcId}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[100px]"
                          >
                            {svc?.displayName || svcId}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-xs text-slate-500">
                    <span className="hidden sm:inline">{p.nodeCount} nós • {p.edgeCount} conexões</span>
                    <span className="text-[11px]">{formatRelativeDate(p.updatedAt)}</span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={(e) => handleDuplicate(e, p)}
                        title="Duplicar"
                        className="h-7 w-7 text-slate-400 hover:text-slate-700"
                      >
                        <Copy size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => setDeletingProject(p)}
                        title="Excluir"
                        className="h-7 w-7 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Bottom Contextual Content (Templates de Referência) */}
        <section className="space-y-3 pt-4 border-t border-studio-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutTemplate size={16} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Templates de Arquitetura
              </h2>
            </div>
            <Link
              href="/templates"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
            >
              <span>Ver todos os templates</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="flex flex-col justify-between rounded-card border border-studio-border bg-white p-4 hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      {tpl.providers.map((p) => (
                        <span key={p} className="inline-flex">
                          <ProviderIcon providerId={p} size={15} />
                        </span>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-slate-200">
                      {tpl.complexity}
                    </Badge>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {tpl.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {tpl.keyServices.slice(0, 2).join(' • ')}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUseTemplate(tpl)}
                    className="text-xs h-7 px-2.5 font-medium border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-900"
                  >
                    Usar template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-card border border-studio-border bg-white p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
              <AlertTriangle size={18} />
              <span>Confirmar Exclusão</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tem certeza que deseja excluir{' '}
              <strong className="text-slate-900">&quot;{deletingProject.title}&quot;</strong>?
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
