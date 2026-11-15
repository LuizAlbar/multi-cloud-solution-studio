import React from 'react';
import {
  ExternalLink,
  Trash2,
  Copy,
  ChevronRight,
  ChevronLeft,
  Info,
  Sliders,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
import { getCatalogServiceById } from '@/features/catalog/catalog-service';
import { useEditorStore } from '../store/editor-store';
import { cn } from '@/lib/utils';

interface InspectorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Inspector({ isOpen, onToggle }: InspectorProps) {
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    updateNodeLabel,
    updateNodeProperties,
    updateNodeNotes,
    deleteSelected,
    duplicateSelected,
  } = useEditorStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  const nodeData = selectedNode?.data as Record<string, unknown> | undefined;
  const serviceId = typeof nodeData?.serviceId === 'string' ? nodeData.serviceId : undefined;
  const catalogService = serviceId ? getCatalogServiceById(serviceId) : undefined;

  return (
    <aside
      aria-label="Painel de propriedades"
      className={cn(
        'relative flex flex-col border-l border-studio-border bg-white transition-all duration-200 z-10 select-none',
        isOpen ? 'w-[316px]' : 'w-0'
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="iconSm"
        onClick={onToggle}
        aria-label={isOpen ? 'Recolher propriedades' : 'Expandir propriedades'}
        className="absolute -left-3 top-3 z-20 h-6 w-6 rounded-full border border-studio-border bg-white shadow-sm hover:bg-slate-50"
      >
        {isOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

      {isOpen && (
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="border-b border-studio-border p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-studio-secondary">
              {selectedNode
                ? 'Propriedades do Nó'
                : selectedEdge
                ? 'Propriedades da Conexão'
                : 'Visão do Projeto'}
            </span>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {selectedNode && (
              <>
                {/* Node Title / Label */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-studio-secondary">
                    Rótulo no Canvas
                  </label>
                  <Input
                    value={(nodeData?.label as string) || ''}
                    onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
                    placeholder="Nome do componente"
                    className="text-xs font-medium"
                  />
                </div>

                {/* Service Metadata */}
                {catalogService && (
                  <div className="rounded-btn border border-studio-border bg-slate-50/60 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ProviderIcon providerId={catalogService.providerId} size={18} />
                        <span className="text-xs font-semibold text-studio-text">
                          {catalogService.displayName}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {catalogService.providerId}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-studio-secondary leading-relaxed">
                      {catalogService.shortDescription}
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <a
                        href={catalogService.officialDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-studio-accent hover:underline"
                      >
                        <span>Documentação oficial</span>
                        <ExternalLink size={12} />
                      </a>
                      <span className="text-[10px] text-slate-400">
                        Rev. {catalogService.lastReviewedAt}
                      </span>
                    </div>
                  </div>
                )}

                {/* Properties Schema Fields */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-studio-text">
                    <Sliders size={14} className="text-studio-secondary" />
                    <span>Parâmetros Informativos</span>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[11px] text-studio-secondary">Ambiente</label>
                      <Input
                        value={((nodeData?.properties as Record<string, unknown>)?.environment as string) || ''}
                        onChange={(e) =>
                          updateNodeProperties(selectedNode.id, {
                            ...(nodeData?.properties as Record<string, unknown>),
                            environment: e.target.value,
                          })
                        }
                        placeholder="Ex: Produção, Staging, Multi-Region"
                        className="h-7 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-studio-secondary">Capacidade / SKU</label>
                      <Input
                        value={((nodeData?.properties as Record<string, unknown>)?.capacity as string) || ''}
                        onChange={(e) =>
                          updateNodeProperties(selectedNode.id, {
                            ...(nodeData?.properties as Record<string, unknown>),
                            capacity: e.target.value,
                          })
                        }
                        placeholder="Ex: 2 vCPU / 4GB, Auto-scaling"
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Notes */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-studio-text">
                    <FileText size={14} className="text-studio-secondary" />
                    <span>Notas Técnicas da Solução</span>
                  </div>
                  <textarea
                    rows={3}
                    value={(nodeData?.notes as string) || ''}
                    onChange={(e) => updateNodeNotes(selectedNode.id, e.target.value)}
                    placeholder="Adicione premissas, requisitos ou detalhes de integração..."
                    className="w-full rounded-btn border border-studio-border bg-white p-2 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-studio-accent focus:ring-offset-1 resize-y"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-studio-border flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={duplicateSelected}
                    className="gap-1.5 text-xs"
                  >
                    <Copy size={13} />
                    <span>Duplicar</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteSelected}
                    className="gap-1.5 text-xs"
                  >
                    <Trash2 size={13} />
                    <span>Excluir</span>
                  </Button>
                </div>
              </>
            )}

            {selectedEdge && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-studio-secondary">
                    Rótulo da Conexão
                  </label>
                  <Input
                    value={(selectedEdge.label as string) || ''}
                    onChange={(e) => {
                      const updatedLabel = e.target.value;
                      useEditorStore.setState((state) => ({
                        edges: state.edges.map((edge) =>
                          edge.id === selectedEdge.id
                            ? { ...edge, label: updatedLabel }
                            : edge
                        ),
                        saveStatus: 'unsaved',
                      }));
                    }}
                    placeholder="Ex: REST API, gRPC, Eventos"
                    className="text-xs font-medium"
                  />
                </div>

                <div className="pt-2 border-t border-studio-border flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteSelected}
                    className="gap-1.5 text-xs"
                  >
                    <Trash2 size={13} />
                    <span>Excluir Conexão</span>
                  </Button>
                </div>
              </div>
            )}

            {!selectedNode && !selectedEdge && (
              <div className="py-12 text-center text-xs text-studio-secondary">
                Selecione um elemento no canvas para editar suas propriedades.
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
