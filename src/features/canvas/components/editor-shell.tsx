'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './canvas';
import { Topbar } from './topbar';
import { CatalogSidebar } from '@/features/catalog/components/catalog-sidebar';
import { Inspector } from './inspector';
import { SceneDrawer } from '@/features/presentation/components/scene-drawer';
import { PresentationView } from '@/features/presentation/components/presentation-view';
import { ExportDialog } from '@/features/import-export/components/export-dialog';
import { ImportModal } from '@/features/diagram-format/components/import-modal';
import { ShortcutsModal } from './shortcuts-modal';
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
  const searchParams = useSearchParams();
  const queryProjectId = searchParams.get('project') || searchParams.get('projectId');
  const effectiveProjectId = projectId || queryProjectId || undefined;

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isSceneDrawerOpen, setIsSceneDrawerOpen] = useState(false);
  const [isPresentation, setIsPresentation] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Open sidebars automatically on desktop (>= 1024px)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsCatalogOpen(true);
      setIsInspectorOpen(true);
    }
  }, []);

  const handleToggleCatalog = () => {
    setIsCatalogOpen((prev) => {
      const next = !prev;
      if (next && typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsInspectorOpen(false);
      }
      return next;
    });
  };

  const handleToggleInspector = () => {
    setIsInspectorOpen((prev) => {
      const next = !prev;
      if (next && typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsCatalogOpen(false);
      }
      return next;
    });
  };

  const isCreatingProjectRef = useRef(false);

  const {
    loadProject,
    initNewProject,
    initPlayground,
    convertPlaygroundToProject,
    addServiceNode,
    nodes,
    edges,
  } = useEditorStore();

  // Load project or initialize playground on mount (with strict deduplication against StrictMode)
  useEffect(() => {
    let cancelled = false;

    async function setup() {
      setIsLoading(true);

      if (isPlayground) {
        initPlayground();
        if (!cancelled) setIsLoading(false);
        return;
      }

      if (effectiveProjectId) {
        const loaded = await loadProject(effectiveProjectId);
        if (loaded) {
          if (!cancelled) setIsLoading(false);
          return;
        }
      }

      // Only create a new project if not already creating one (prevents duplicate projects in StrictMode)
      if (isCreatingProjectRef.current) return;
      isCreatingProjectRef.current = true;

      try {
        const newProj = await initNewProject();
        if (!cancelled) {
          router.replace(`/editor?project=${newProj.id}`);
          setIsLoading(false);
        }
      } finally {
        isCreatingProjectRef.current = false;
      }
    }

    setup();

    return () => {
      cancelled = true;
    };
  }, [effectiveProjectId, isPlayground, loadProject, initNewProject, initPlayground, router]);

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

  // Global 'P' shortcut for presentation mode and '?' for shortcuts help
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
      } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
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
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsCatalogOpen(false);
      }
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
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
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

        {/* Keyboard Shortcuts Modal */}
        <ShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />

        {/* Presentation Overlay if active */}
        {isPresentation && (
          <PresentationView onExit={() => setIsPresentation(false)} />
        )}

        {/* Main Work Area */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* Mobile Backdrop when catalog or inspector is open */}
          {!isPresentation && (isCatalogOpen || isInspectorOpen) && (
            <div
              className="lg:hidden fixed inset-0 top-14 sm:top-16 z-20 bg-foreground/20 backdrop-blur-2xs transition-opacity"
              onClick={() => {
                setIsCatalogOpen(false);
                setIsInspectorOpen(false);
              }}
              aria-label="Fechar painéis"
            />
          )}

          {/* Catalog Left Sidebar (hidden in presentation) */}
          {!isPresentation && (
            <CatalogSidebar
              isOpen={isCatalogOpen}
              onToggle={handleToggleCatalog}
              onAddService={handleAddService}
            />
          )}

          {/* Central Canvas (toolbar hidden in presentation) */}
          <main className="relative flex-1 overflow-hidden">
            <Canvas isPresentation={isPresentation} />
          </main>

          {/* Inspector Right Sidebar (hidden in presentation) */}
          {!isPresentation && (
            <Inspector
              isOpen={isInspectorOpen}
              onToggle={handleToggleInspector}
            />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}
