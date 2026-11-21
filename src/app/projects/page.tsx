'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  LayoutGrid,
  List,
  Star,
  Share2,
  MoreVertical,
  X,
  Sparkles,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StudioHeader } from '@/components/layout/studio-header';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
import { ServiceIcon } from '@/features/catalog/components/service-icons';
import { projectRepository, type ProjectSummary } from '@/lib/storage/project-repository';
import { getCatalogServiceById } from '@/features/catalog/catalog-service';
import { ImportModal } from '@/features/diagram-format/components/import-modal';
import { deserializeFromMCSS } from '@/features/diagram-format/serialization/serializer';
import type { MCSSDiagramDocument } from '@/features/diagram-format/domain/diagram-format';
import type { ProviderId } from '@/lib/schemas';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<ProviderId | 'todos'>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Context menu per card
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Rename state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');

  // Delete modal state
  const [deletingProject, setDeletingProject] = useState<ProjectSummary | null>(null);

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleConfirmImport = async (doc: MCSSDiagramDocument) => {
    const p = deserializeFromMCSS(doc, { titlePrefix: 'Importado' });
    await projectRepository.saveProject(p);
    router.push(`/editor?project=${p.id}`);
  };

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

  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      p.providers.forEach((prov) => {
        counts[prov] = (counts[prov] || 0) + 1;
      });
    });
    return counts;
  }, [projects]);

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

  const formatRelativeDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return 'Atualizado agora';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24 && d.getDate() === now.getDate()) return `Hoje às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return 'Ontem';
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans select-none">
      {/* Global Navbar */}
      <StudioHeader
        activeTab="projects"
        actions={
          <>
            <Link href="/playground">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-1.5 text-xs font-medium border-primary/20 bg-primary-soft/60 text-primary hover:bg-primary-soft h-8 px-2 sm:px-3"
                title="Abrir editor rápido em memória sem salvar"
              >
                <Sparkles size={13} className="text-primary" />
                <span className="hidden sm:inline">Playground</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
              className="gap-1 sm:gap-1.5 text-xs font-semibold h-8 px-2 sm:px-3"
              title="Importar diagrama MCSS (.json)"
            >
              <Upload size={14} className="text-foreground-secondary" />
              <span className="hidden sm:inline">Importar</span>
            </Button>

            <Link href="/editor">
              <Button
                variant="default"
                size="sm"
                className="gap-1 sm:gap-1.5 text-xs font-semibold h-8 px-2.5 sm:px-3.5"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Novo Projeto</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* Main Container */}
      <main id="main-content" className="flex-1 w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-10 py-5 sm:py-8 space-y-6">
        {/* Projects Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-foreground shrink-0">
              Projetos
            </h1>

            {/* Provider Filter Chips (Horizontal scrollable on mobile) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
              <button
                onClick={() => setSelectedProviderFilter('todos')}
                className={cn(
                  'text-[11px] sm:text-xs px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap shrink-0',
                  selectedProviderFilter === 'todos'
                    ? 'border-primary bg-primary-soft text-primary font-semibold shadow-2xs'
                    : 'border-border bg-surface text-foreground-secondary hover:bg-surface-muted'
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
                      'text-[11px] sm:text-xs px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0',
                      selectedProviderFilter === prov
                        ? 'border-primary bg-primary-soft text-primary font-semibold shadow-2xs'
                        : 'border-border bg-surface text-foreground-secondary hover:bg-surface-muted'
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
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64 md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-foreground-secondary/60 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar projetos..."
                className="pl-8 pr-7 text-xs h-8 bg-surface w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-foreground-secondary hover:text-foreground"
                  aria-label="Limpar busca"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-btn bg-surface overflow-hidden p-0.5 shrink-0">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="iconSm"
                onClick={() => setViewMode('grid')}
                className={cn('h-7 w-7 rounded-sm', viewMode === 'grid' ? 'bg-primary text-white' : 'text-foreground-secondary')}
                title="Visualização em Grade"
                aria-label="Grade"
              >
                <LayoutGrid size={13} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="iconSm"
                onClick={() => setViewMode('list')}
                className={cn('h-7 w-7 rounded-sm', viewMode === 'list' ? 'bg-primary text-white' : 'text-foreground-secondary')}
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
          <div className="rounded-card border border-dashed border-border bg-surface p-8 sm:p-12 text-center space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Nenhum projeto salvo
            </h3>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push('/playground')}
                className="text-xs border-primary/20 text-primary bg-primary-soft/50 hover:bg-primary-soft"
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
          <div className="rounded-card border border-border bg-surface p-8 text-center space-y-2">
            <p className="text-xs text-foreground-secondary">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/editor?project=${p.id}`)}
                className="group relative flex flex-col justify-between rounded-card border border-border bg-surface hover:border-primary/40 hover:shadow-raised hover:-translate-y-0.5 transition-all duration-standard ease-out-editorial cursor-pointer p-3.5 sm:p-4 min-h-[175px] sm:min-h-[190px]"
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
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-border text-foreground-secondary">
                          Vazio
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Favorite button */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, p)}
                        className={cn(
                          'p-1.5 rounded-sm transition-colors',
                          p.isFavorite
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-foreground-secondary/40 hover:text-foreground-secondary'
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
                          className="p-1.5 rounded-sm text-foreground-secondary hover:text-foreground hover:bg-surface-muted"
                          title="Opções"
                          aria-label="Opções"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {activeMenuId === p.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="feedback-surface absolute right-0 top-7 z-30 w-36 p-1 text-xs space-y-0.5"
                          >
                            <button
                              onClick={() => router.push(`/editor?project=${p.id}`)}
                              className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-surface-muted text-foreground"
                            >
                              Abrir
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setRenamingId(p.id);
                                setRenamingTitle(p.title);
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-surface-muted text-foreground"
                            >
                              Renomear
                            </button>
                            <button
                              onClick={(e) => handleDuplicate(e, p)}
                              className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-surface-muted text-foreground"
                            >
                              Duplicar
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setDeletingProject(p);
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-destructive/10 text-destructive"
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
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                  )}

                  {/* Chips of Representative Services */}
                  <div className="flex flex-wrap gap-1 mt-2 sm:mt-2.5">
                    {p.services.length > 0 ? (
                      <>
                        {p.services.slice(0, 3).map((svcId) => {
                          const svc = getCatalogServiceById(svcId);
                          const name = svc?.displayName || svcId;
                          return (
                            <span
                              key={svcId}
                              className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-muted border border-border text-foreground-secondary max-w-[120px] truncate"
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
                          <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-surface-muted text-foreground-secondary border border-border">
                            +{p.services.length - 3}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] text-foreground-secondary/60 italic">
                        Diagrama vazio
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Date & Connections */}
                <div className="pt-2.5 sm:pt-3 border-t border-border/60 flex items-center justify-between text-[10px] sm:text-[11px] text-foreground-secondary mt-2.5 sm:mt-3">
                  <span className="truncate">{formatRelativeDate(p.updatedAt)}</span>
                  <span className="flex items-center gap-1 font-medium text-foreground shrink-0 ml-1">
                    <Share2 size={11} className="text-foreground-secondary" />
                    <span>{p.edgeCount} {p.edgeCount === 1 ? 'conexão' : 'conexões'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View Mode */}
        {viewMode === 'list' && filteredProjects.length > 0 && (
          <div className="rounded-card border border-border bg-surface overflow-hidden divide-y divide-border/60 shadow-surface">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/editor?project=${p.id}`)}
                className="flex items-center justify-between p-2.5 sm:p-3.5 hover:bg-surface-muted/50 transition-colors cursor-pointer gap-2 sm:gap-4"
              >
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0">
                  <button
                    onClick={(e) => handleToggleFavorite(e, p)}
                    className={cn(
                      'p-1 shrink-0',
                      p.isFavorite ? 'text-amber-500' : 'text-foreground-secondary/40 hover:text-foreground-secondary'
                    )}
                    aria-label="Favoritar"
                  >
                    <Star size={14} className={p.isFavorite ? 'fill-amber-400' : ''} />
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {p.providers.map((prov) => (
                      <span key={prov} className="inline-flex">
                        <ProviderIcon providerId={prov} size={15} />
                      </span>
                    ))}
                  </div>

                  <div className="text-xs font-semibold text-foreground truncate min-w-0 flex-1">
                    {p.title}
                  </div>

                  <div className="hidden lg:flex items-center gap-1 overflow-hidden">
                    {p.services.slice(0, 2).map((svcId) => {
                      const svc = getCatalogServiceById(svcId);
                      return (
                        <span
                          key={svcId}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-surface-muted text-foreground-secondary border border-border truncate max-w-[100px]"
                        >
                          {svc?.displayName || svcId}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-6 shrink-0 text-xs text-foreground-secondary">
                  <span className="hidden sm:inline text-[11px]">{p.nodeCount} nós • {p.edgeCount} conexões</span>
                  <span className="text-[10px] sm:text-[11px] whitespace-nowrap">{formatRelativeDate(p.updatedAt)}</span>

                  <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={(e) => handleDuplicate(e, p)}
                      title="Duplicar"
                      className="h-7 w-7 text-foreground-secondary hover:text-foreground"
                    >
                      <Copy size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={() => setDeletingProject(p)}
                      title="Excluir"
                      className="h-7 w-7 text-foreground-secondary hover:text-destructive"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="feedback-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="feedback-surface w-full max-w-sm p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <AlertTriangle size={18} />
              <span>Confirmar Exclusão</span>
            </div>

            <p className="text-xs text-foreground-secondary leading-relaxed">
              Tem certeza que deseja excluir{' '}
              <strong className="text-foreground">&quot;{deletingProject.title}&quot;</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
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

      {/* Import Assisted Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirmImport={handleConfirmImport}
      />
    </div>
  );
}
