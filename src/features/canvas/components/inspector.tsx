import React from 'react';
import {
  ExternalLink,
  Trash2,
  Copy,
  ChevronRight,
  ChevronLeft,
  Sliders,
  FileText,
  Network,
  Layers,
  ArrowRight,
  Globe,
  Radio,
  X,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProviderIcon } from '@/features/catalog/components/provider-icons';
import { ServiceIcon } from '@/features/catalog/components/service-icons';
import { getCatalogServiceById } from '@/features/catalog/catalog-service';
import { useEditorStore } from '../store/editor-store';
import type { EdgeFlowType, EdgeDirection, ProviderId } from '@/lib/schemas';
import { cn } from '@/lib/utils';

interface InspectorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Inspector({ isOpen, onToggle }: InspectorProps) {
  const {
    project,
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    updateNodeLabel,
    updateNodeProperties,
    updateNodeNotes,
    deleteSelected,
    duplicateSelected,
    selectNode,
    selectEdge,
  } = useEditorStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  const nodeData = selectedNode?.data as Record<string, unknown> | undefined;
  const isGroup = selectedNode?.type === 'group';
  const isShape = selectedNode?.type === 'shape' || selectedNode?.type === 'generic';

  const serviceId = typeof nodeData?.serviceId === 'string' ? nodeData.serviceId : undefined;
  const catalogService = serviceId ? getCatalogServiceById(serviceId) : undefined;

  const edgeData = selectedEdge?.data as Record<string, unknown> | undefined;
  const sourceNode = edges ? nodes.find((n) => n.id === selectedEdge?.source) : undefined;
  const targetNode = edges ? nodes.find((n) => n.id === selectedEdge?.target) : undefined;

  return (
    <aside
      aria-label="Painel de propriedades do elemento"
      className={cn(
        'relative flex flex-col border-l border-studio-border bg-white transition-all duration-200 z-10 select-none shrink-0 h-full',
        isOpen ? 'w-[355px]' : 'w-0'
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="iconSm"
        onClick={onToggle}
        aria-label={isOpen ? 'Recolher propriedades' : 'Expandir propriedades'}
        className="absolute -left-3 top-3.5 z-20 h-6 w-6 rounded-full border border-studio-border bg-white shadow-sm hover:bg-slate-50 text-slate-600"
      >
        {isOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

      {isOpen && (
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-studio-border p-3.5 bg-slate-50/40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {selectedNode
                ? isGroup
                  ? 'Zona de Arquitetura'
                  : 'Propriedades do Componente'
                : selectedEdge
                ? 'Propriedades da Conexão'
                : 'Visão do Projeto'}
            </span>

            {(selectedNode || selectedEdge) && (
              <button
                onClick={() => {
                  selectNode(null);
                  selectEdge(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
                title="Deselecionar"
                aria-label="Deselecionar"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex-1 p-4 space-y-4">
            {/* 1. Node Selected (Cloud Service or Generic) */}
            {selectedNode && !isGroup && (
              <>
                {/* Node Title / Label */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Rótulo da Instância
                  </label>
                  <Input
                    value={(nodeData?.label as string) || ''}
                    onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
                    placeholder="Nome da instância"
                    className="text-xs font-medium h-8"
                  />
                </div>

                {/* Service Metadata Card */}
                {catalogService && (
                  <div className="rounded-btn border border-slate-200 bg-slate-50/70 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ServiceIcon
                          iconKey={catalogService.iconKey}
                          providerId={catalogService.providerId}
                          category={catalogService.category}
                          size={20}
                        />
                        <span className="text-xs font-bold text-slate-900">
                          {catalogService.displayName}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase border-slate-200">
                        {catalogService.providerId}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {catalogService.shortDescription}
                    </p>

                    <div className="pt-1 flex items-center justify-between border-t border-slate-200/60">
                      <a
                        href={catalogService.officialDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        <span>Documentação oficial</span>
                        <ExternalLink size={11} />
                      </a>
                      <span className="text-[10px] text-slate-400">
                        Rev. {catalogService.lastReviewedAt}
                      </span>
                    </div>
                  </div>
                )}

                {/* Configuration / Properties */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Sliders size={13} className="text-slate-500" />
                    <span>Configurações</span>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600">Ambiente</label>
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
                      <label className="text-[11px] font-medium text-slate-600">Capacidade / SKU</label>
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

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600">Região de Execução</label>
                      <Input
                        value={((nodeData?.properties as Record<string, unknown>)?.region as string) || ''}
                        onChange={(e) =>
                          updateNodeProperties(selectedNode.id, {
                            ...(nodeData?.properties as Record<string, unknown>),
                            region: e.target.value,
                          })
                        }
                        placeholder="Ex: us-east-1, southamerica-east1, Global"
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Notes (No Speaker Notes on elements RF2-05 / RF4-07) */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <FileText size={13} className="text-slate-500" />
                    <span>Observações Técnicas da Solução</span>
                  </div>
                  <textarea
                    rows={3}
                    value={(nodeData?.notes as string) || ''}
                    onChange={(e) => updateNodeNotes(selectedNode.id, e.target.value)}
                    placeholder="Adicione premissas, requisitos ou detalhes de integração..."
                    className="w-full rounded-btn border border-slate-200 bg-white p-2 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                  />
                </div>

                {/* Node Actions */}
                <div className="pt-2 border-t border-studio-border flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={duplicateSelected}
                    className="gap-1.5 text-xs h-7"
                  >
                    <Copy size={12} />
                    <span>Duplicar</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteSelected}
                    className="gap-1.5 text-xs h-7"
                  >
                    <Trash2 size={12} />
                    <span>Excluir</span>
                  </Button>
                </div>
              </>
            )}

            {/* 2. Zone Selected */}
            {selectedNode && isGroup && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Título da Zona / Grupo
                  </label>
                  <Input
                    value={(nodeData?.label as string) || ''}
                    onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
                    placeholder="Ex: AWS - us-east-1"
                    className="text-xs font-medium h-8"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Provedor da Zona
                  </label>
                  <select
                    value={(nodeData?.providerId as string) || 'custom'}
                    onChange={(e) => {
                      const newProv = e.target.value as ProviderId;
                      useEditorStore.setState((state) => ({
                        nodes: state.nodes.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, data: { ...n.data, providerId: newProv } }
                            : n
                        ),
                        saveStatus: 'unsaved',
                      }));
                    }}
                    className="w-full h-8 rounded-btn border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="custom">Customizado / On-Premises</option>
                    <option value="aws">Amazon Web Services (AWS)</option>
                    <option value="gcp">Google Cloud Platform (GCP)</option>
                    <option value="azure">Microsoft Azure</option>
                    <option value="oci">Oracle Cloud Infrastructure (OCI)</option>
                    <option value="cloudflare">Cloudflare</option>
                    <option value="supabase">Supabase</option>
                    <option value="hostinger">Hostinger</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Região
                  </label>
                  <Input
                    value={(nodeData?.region as string) || ''}
                    onChange={(e) => {
                      const newReg = e.target.value;
                      useEditorStore.setState((state) => ({
                        nodes: state.nodes.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, data: { ...n.data, region: newReg } }
                            : n
                        ),
                        saveStatus: 'unsaved',
                      }));
                    }}
                    placeholder="Ex: us-east-1, southamerica-east1"
                    className="text-xs font-medium h-8"
                  />
                </div>

                <div className="pt-2 border-t border-studio-border flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteSelected}
                    className="gap-1.5 text-xs h-7"
                  >
                    <Trash2 size={12} />
                    <span>Excluir Zona</span>
                  </Button>
                </div>
              </div>
            )}

            {/* 3. Edge / Connection Selected */}
            {selectedEdge && (
              <div className="space-y-4">
                {/* Connected endpoints summary */}
                <div className="rounded-btn border border-slate-200 bg-slate-50/70 p-2.5 flex items-center justify-between text-xs text-slate-700 font-medium">
                  <span className="truncate max-w-[120px]">
                    {(sourceNode?.data?.label as string) || 'Origem'}
                  </span>
                  <ArrowRight size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate max-w-[120px]">
                    {(targetNode?.data?.label as string) || 'Destino'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
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
                    placeholder="Ex: HTTPS, ETL, JDBC, gRPC"
                    className="text-xs font-medium h-8"
                  />
                </div>

                {/* Connection Protocol / Flow Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Tipo de Conexão / Protocolo
                  </label>
                  <select
                    value={(edgeData?.flowType as string) || 'http'}
                    onChange={(e) => {
                      const newType = e.target.value as EdgeFlowType;
                      useEditorStore.setState((state) => ({
                        edges: state.edges.map((edge) =>
                          edge.id === selectedEdge.id
                            ? { ...edge, data: { ...edge.data, flowType: newType } }
                            : edge
                        ),
                        saveStatus: 'unsaved',
                      }));
                    }}
                    className="w-full h-8 rounded-btn border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="http">HTTPS / HTTP / REST</option>
                    <option value="data">Dados / JDBC / SQL / Replicação</option>
                    <option value="events">Eventos / Mensageria / Filas</option>
                    <option value="network">Rede Privada / VPC / VPN</option>
                    <option value="auth">Autenticação / JWT / mTLS</option>
                    <option value="generic">Genérico / Outros</option>
                  </select>
                </div>

                {/* Connection Direction */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Direção do Fluxo
                  </label>
                  <select
                    value={(edgeData?.direction as string) || 'sourceToTarget'}
                    onChange={(e) => {
                      const newDir = e.target.value as EdgeDirection;
                      useEditorStore.setState((state) => ({
                        edges: state.edges.map((edge) =>
                          edge.id === selectedEdge.id
                            ? { ...edge, data: { ...edge.data, direction: newDir } }
                            : edge
                        ),
                        saveStatus: 'unsaved',
                      }));
                    }}
                    className="w-full h-8 rounded-btn border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sourceToTarget">Origem → Destino (Padrão)</option>
                    <option value="bidirectional">Bidirecional (↔)</option>
                    <option value="targetToSource">Destino → Origem (←)</option>
                    <option value="none">Sem setas (Lógico)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-studio-border flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteSelected}
                    className="gap-1.5 text-xs h-7"
                  >
                    <Trash2 size={12} />
                    <span>Excluir Conexão</span>
                  </Button>
                </div>
              </div>
            )}

            {/* 4. No Selection: Compact Project Summary */}
            {!selectedNode && !selectedEdge && (
              <div className="space-y-3 pt-1">
                <div className="rounded-btn border border-slate-200 bg-slate-50/60 p-3 space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    {project?.title || 'Diagrama'}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{nodes.length} {nodes.length === 1 ? 'nó' : 'nós'}</span>
                    <span>•</span>
                    <span>{edges.length} {edges.length === 1 ? 'conexão' : 'conexões'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 text-center py-4">
                  Selecione um elemento para editar propriedades.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
