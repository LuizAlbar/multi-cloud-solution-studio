import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Cpu,
  Box,
  HardDrive,
  Database,
  Network,
  BarChart2,
  Sparkles,
  Shield,
  Share2,
  Activity,
  Wrench,
  Layers,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProviderIcon } from './provider-icons';
import { ServiceIcon } from './service-icons';
import {
  searchCatalog,
  getCatalogServices,
  PROVIDERS,
  CATEGORIES,
} from '../catalog-service';
import type { CatalogService, ProviderId, ServiceCategory } from '@/lib/schemas';
import { cn } from '@/lib/utils';

interface CatalogSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddService: (service: CatalogService) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  compute: <Cpu size={14} className="text-slate-500" />,
  containers: <Box size={14} className="text-slate-500" />,
  storage: <HardDrive size={14} className="text-slate-500" />,
  databases: <Database size={14} className="text-slate-500" />,
  networking: <Network size={14} className="text-slate-500" />,
  analytics: <BarChart2 size={14} className="text-slate-500" />,
  'ai-ml': <Sparkles size={14} className="text-slate-500" />,
  security: <Shield size={14} className="text-slate-500" />,
  integration: <Share2 size={14} className="text-slate-500" />,
  observability: <Activity size={14} className="text-slate-500" />,
  'dev-tools': <Wrench size={14} className="text-slate-500" />,
  custom: <Layers size={14} className="text-slate-500" />,
};

export function CatalogSidebar({
  isOpen,
  onToggle,
  onAddService,
}: CatalogSidebarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderId | undefined>();

  // State of open/closed categories (accordion)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    compute: true,
    containers: true,
    storage: false,
    databases: false,
    networking: false,
    analytics: false,
    'ai-ml': false,
    security: false,
    integration: false,
    observability: false,
    'dev-tools': false,
  });

  const allServices = useMemo(() => getCatalogServices(), []);

  // Filtered services based on search and selected provider
  const filteredServices = useMemo(() => {
    return searchCatalog(searchQuery, {
      provider: selectedProvider,
    });
  }, [searchQuery, selectedProvider]);

  // Group filtered services by category
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, CatalogService[]> = {};
    CATEGORIES.forEach((cat) => {
      grouped[cat.id] = [];
    });

    filteredServices.forEach((svc) => {
      const cat = svc.category || 'compute';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(svc);
    });

    return grouped;
  }, [filteredServices]);

  // If search query is typed, automatically expand categories with matches
  useEffect(() => {
    if (searchQuery.trim()) {
      const autoExpand: Record<string, boolean> = {};
      Object.entries(servicesByCategory).forEach(([catId, svcs]) => {
        if (svcs.length > 0) {
          autoExpand[catId] = true;
        }
      });
      setExpandedCategories((prev) => ({ ...prev, ...autoExpand }));
    }
  }, [searchQuery, servicesByCategory]);

  // Ctrl+K shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    service: CatalogService
  ) => {
    e.dataTransfer.setData('application/mcss-service', JSON.stringify(service));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside
      aria-label="Catálogo multicloud de componentes"
      className={cn(
        'relative flex flex-col border-r border-studio-border bg-white transition-all duration-200 z-10 select-none shrink-0 h-full',
        isOpen ? 'w-[355px]' : 'w-0'
      )}
    >
      {/* Toggle button */}
      <Button
        variant="outline"
        size="iconSm"
        onClick={onToggle}
        aria-label={isOpen ? 'Recolher catálogo' : 'Expandir catálogo'}
        className="absolute -right-3 top-3.5 z-20 h-6 w-6 rounded-full border border-studio-border bg-white shadow-sm hover:bg-slate-50 text-slate-600"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </Button>

      {isOpen && (
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-studio-border p-3.5 space-y-2.5 bg-slate-50/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Catálogo Multicloud
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {filteredServices.length} de {allServices.length} serviços
              </span>
            </div>

            {/* Search Input (Ctrl+K) */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar serviços... (Ctrl+K)"
                className="pl-8 pr-7 text-xs h-8 bg-white border-slate-200 focus-visible:ring-indigo-500"
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

            {/* Provider Filter Chips */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              <button
                onClick={() => setSelectedProvider(undefined)}
                className={cn(
                  'text-[11px] px-2.5 py-1 rounded-full border transition-colors',
                  !selectedProvider
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                )}
              >
                Todos
              </button>
              {PROVIDERS.filter((p) => p.id !== 'custom').map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    setSelectedProvider(selectedProvider === p.id ? undefined : p.id)
                  }
                  className={cn(
                    'text-[11px] px-2 py-1 rounded-full border transition-colors flex items-center gap-1.5',
                    selectedProvider === p.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <ProviderIcon providerId={p.id} size={12} />
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Expandable Categories Accordion */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {filteredServices.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <p>Nenhum serviço encontrado para &quot;{searchQuery}&quot;.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedProvider(undefined);
                  }}
                  className="text-xs h-7"
                >
                  Limpar Busca
                </Button>
              </div>
            ) : (
              CATEGORIES.map((cat) => {
                const svcs = servicesByCategory[cat.id] || [];
                if (svcs.length === 0) return null;

                const isExpanded = Boolean(expandedCategories[cat.id]);

                return (
                  <div
                    key={cat.id}
                    className="rounded-btn border border-slate-200/80 bg-white overflow-hidden transition-all shadow-2xs"
                  >
                    {/* Category Accordion Header */}
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        {CATEGORY_ICONS[cat.id] || <Layers size={14} className="text-slate-500" />}
                        <span className="text-xs font-bold text-slate-800">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {svcs.length}
                        </span>
                        <ChevronDown
                          size={14}
                          className={cn(
                            'text-slate-400 transition-transform duration-200',
                            isExpanded ? 'rotate-180' : ''
                          )}
                        />
                      </div>
                    </button>

                    {/* Services Items inside expanded Category */}
                    {isExpanded && (
                      <div className="p-1.5 space-y-1 bg-white divide-y divide-slate-100">
                        {svcs.map((service) => (
                          <div
                            key={service.serviceId}
                            draggable
                            onDragStart={(e) => handleDragStart(e, service)}
                            onClick={() => onAddService(service)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onAddService(service);
                              }
                            }}
                            className="group flex items-center justify-between gap-2.5 p-1.5 rounded-sm hover:bg-slate-50/90 cursor-grab active:cursor-grabbing transition-colors pt-2"
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <ServiceIcon
                                iconKey={service.iconKey}
                                providerId={service.providerId}
                                category={service.category}
                                size={22}
                                className="shrink-0"
                              />
                              <div className="overflow-hidden">
                                <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                  {service.displayName}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {service.shortDescription}
                                </div>
                              </div>
                            </div>

                            {/* Show provider badge when viewing All providers */}
                            {!selectedProvider && (
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1.5 py-0 h-4 uppercase shrink-0 border-slate-200 text-slate-500 font-medium"
                              >
                                {service.providerId}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
