'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './canvas';
import { Topbar } from './topbar';
import { CatalogSidebar } from '@/features/catalog/components/catalog-sidebar';
import { Inspector } from './inspector';
import { SceneDrawer } from '@/features/presentation/components/scene-drawer';
import { PresentationView } from '@/features/presentation/components/presentation-view';
import { ExportDialog } from '@/features/import-export/components/export-dialog';
import { ImportModal } from '@/features/diagram-format/components/import-modal';
import { useEditorStore } from '../store/editor-store';
import { deserializeFromMCSS } from '@/features/diagram-format/serialization/serializer';
import { projectRepository } from '@/lib/storage/project-repository';
import type { CatalogService } from '@/lib/schemas';
import type { MCSSDiagramDocument } from '@/features/diagram-format/domain/diagram-format';

interface EditorShellProps {
  projectId?: string;
  isPlayground?: boolean;
}

export function EditorShell({ projectId, isPlayground = false }: EditorShellProps) {
  const router = useRouter();
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isSceneDrawerOpen, setIsSceneDrawerOpen] = useState(false);
  const [isPresentation, setIsPresentation] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    loadProject,
    initNewProject,
    initPlayground,
    convertPlaygroundToProject,
    addServiceNode,
    nodes,
    edges,
  } = useEditorStore();

  // Load project or initialize playground on mount
  useEffect(() => {
    let isMounted = true;

    async function setup() {
      setIsLoading(true);
      if (isPlayground) {
        initPlayground();
      } else if (projectId) {
        await loadProject(projectId);
      } else {
        await initNewProject();
      }
      if (isMounted) {
        setIsLoading(false);
      }
    }

    setup();

    return () => {
      isMounted = false;
    };
  }, [projectId, isPlayground, loadProject, initPlayground]);

  // Warning before unload if playground has work
  useEffect(() => {
    if (!isPlayground) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (nodes.length > 0 || edges.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPlayground, nodes.length, edges.length]);

  // Global 'P' shortcut for presentation mode
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsPresentation((prev) => !prev);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddService = useCallback(
    (service: CatalogService) => {
      addServiceNode(service, {
        x: 250 + Math.random() * 80,
        y: 150 + Math.random() * 80,
      });
    },
    [addServiceNode]
  );

  const handleSaveAsProject = async () => {
    try {
      const converted = await convertPlaygroundToProject();
      router.push(`/editor?project=${converted.id}`);
    } catch (err) {
      console.error('Falha ao converter playground para projeto:', err);
    }
  };

  const handleConfirmImport = async (doc: MCSSDiagramDocument) => {
    if (isPlayground) {
      const p = deserializeFromMCSS(doc);
      const flowNodes = p.nodes.map((n) => ({
        id: n.id,
        type: n.kind === 'service' ? 'service' : n.kind === 'group' ? 'group' : 'generic',
        position: n.position,
        data: {
          label: n.label,
          serviceId: n.serviceId,
          properties: n.properties,
          notes: n.notes,
        },
      }));
      const flowEdges = p.edges.map((e) => ({
        id: e.id,
        source: e.sourceId,
        target: e.targetId,
        label: e.label,
        type: 'labeled',
        data: {
          direction: e.direction,
          flowType: e.flowType,
        },
      }));

      useEditorStore.setState({
        nodes: flowNodes,
        edges: flowEdges,
        saveStatus: 'saved',
        selectedNodeId: null,
        selectedEdgeId: null,
      });
    } else {
      const p = deserializeFromMCSS(doc, { titlePrefix: 'Importado' });
      await projectRepository.saveProject(p);
      router.push(`/editor?project=${p.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-studio-bg text-studio-secondary">
        <div className="text-center space-y-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-studio-accent border-t-transparent mx-auto" />
          <p className="text-xs font-medium">
            {isPlayground ? 'Iniciando Playground...' : 'Carregando estúdio...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-studio-bg">
        {/* Topbar */}
        <Topbar
          onTogglePresentation={() => setIsPresentation(true)}
          onToggleSceneDrawer={() => setIsSceneDrawerOpen((prev) => !prev)}
          isPresentation={isPresentation}
          onOpenExportDialog={() => setIsExportDialogOpen(true)}
          onOpenImportDialog={() => setIsImportModalOpen(true)}
          isPlayground={isPlayground}
          onSaveAsProject={handleSaveAsProject}
        />

        {/* Scene Drawer */}
        <SceneDrawer
          isOpen={isSceneDrawerOpen && !isPresentation}
          onClose={() => setIsSceneDrawerOpen(false)}
          onStartPresentation={() => {
            setIsSceneDrawerOpen(false);
            setIsPresentation(true);
          }}
        />

        {/* Export Modal */}
        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
        />

        {/* Import Assisted Modal */}
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onConfirmImport={handleConfirmImport}
          isPlayground={isPlayground}
        />

        {/* Presentation Overlay if active */}
        {isPresentation && (
          <PresentationView onExit={() => setIsPresentation(false)} />
        )}

        {/* Main Work Area */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* Catalog Left Sidebar (hidden in presentation) */}
          {!isPresentation && (
            <CatalogSidebar
              isOpen={isCatalogOpen}
              onToggle={() => setIsCatalogOpen(!isCatalogOpen)}
              onAddService={handleAddService}
            />
          )}

          {/* Central Canvas */}
          <main className="relative flex-1 overflow-hidden">
            <Canvas />
          </main>

          {/* Inspector Right Sidebar (hidden in presentation) */}
          {!isPresentation && (
            <Inspector
              isOpen={isInspectorOpen}
              onToggle={() => setIsInspectorOpen(!isInspectorOpen)}
            />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}
