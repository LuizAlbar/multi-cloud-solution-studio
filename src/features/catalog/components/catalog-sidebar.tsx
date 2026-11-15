import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProviderIcon } from './provider-icons';
import { ServiceIcon } from './service-icons';
import {
  searchCatalog,
  getCatalogServices,
  PROVIDERS,
} from '../catalog-service';
import type { CatalogService, ProviderId, ServiceCategory } from '@/lib/schemas';
import { cn } from '@/lib/utils';

interface CatalogSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddService: (service: CatalogService) => void;
}

export function CatalogSidebar({
  isOpen,
  onToggle,
  onAddService,
}: CatalogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderId | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>();

  const totalServicesCount = useMemo(() => getCatalogServices().length, []);

  const filteredServices = useMemo(() => {
    return searchCatalog(searchQuery, {
      provider: selectedProvider,
      category: selectedCategory,
    });
  }, [searchQuery, selectedProvider, selectedCategory]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    service: CatalogService
  ) => {
    e.dataTransfer.setData('application/mcss-service', JSON.stringify(service));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside
      aria-label="Catálogo de componentes"
      className={cn(
        'relative flex flex-col border-r border-studio-border bg-white transition-all duration-200 z-10 select-none',
        isOpen ? 'w-[276px]' : 'w-0'
      )}
    >
      {/* Toggle button */}
      <Button
        variant="outline"
        size="iconSm"
        onClick={onToggle}
        aria-label={isOpen ? 'Recolher catálogo' : 'Expandir catálogo'}
        className="absolute -right-3 top-3 z-20 h-6 w-6 rounded-full border border-studio-border bg-white shadow-sm hover:bg-slate-50"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </Button>

      {isOpen && (
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header & Search */}
          <div className="border-b border-studio-border p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-studio-secondary">
                Catálogo Multicloud
              </span>
              <span className="text-[11px] font-medium text-studio-secondary">
                {filteredServices.length} de {totalServicesCount}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-studio-secondary pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar serviços... (Ctrl+K)"
                className="pl-8 text-xs h-8 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-studio-secondary hover:text-studio-text"
                  aria-label="Limpar busca"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Provider Filter Badges */}
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pt-0.5">
              <button
                onClick={() => setSelectedProvider(undefined)}
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full border transition-colors',
                  !selectedProvider
                    ? 'border-studio-accent bg-studio-highlight text-studio-accent font-semibold'
                    : 'border-studio-border bg-white text-studio-secondary hover:bg-slate-50'
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
                    'text-[10px] px-2 py-0.5 rounded-full border transition-colors flex items-center gap-1',
                    selectedProvider === p.id
                      ? 'border-studio-accent bg-studio-highlight text-studio-accent font-semibold'
                      : 'border-studio-border bg-white text-studio-secondary hover:bg-slate-50'
                  )}
                >
                  <ProviderIcon providerId={p.id} size={11} />
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Service List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredServices.length === 0 ? (
              <div className="p-6 text-center text-xs text-studio-secondary">
                Nenhum serviço encontrado para &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredServices.map((service) => (
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
                  className="flex items-center justify-between gap-2 p-1.5 rounded-btn border border-studio-border bg-white hover:border-studio-accent hover:bg-slate-50/80 cursor-grab active:cursor-grabbing transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <ServiceIcon
                      iconKey={service.iconKey}
                      providerId={service.providerId}
                      category={service.category}
                      size={20}
                      className="shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-studio-text truncate">
                        {service.displayName}
                      </div>
                      <div className="text-[10px] text-studio-secondary capitalize truncate">
                        {service.category}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 shrink-0 uppercase border-slate-200">
                    {service.providerId}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
