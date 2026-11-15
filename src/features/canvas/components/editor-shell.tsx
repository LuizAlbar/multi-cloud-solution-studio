'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './canvas';
import { Topbar } from './topbar';
import { CatalogSidebar } from '@/features/catalog/components/catalog-sidebar';
import { Inspector } from './inspector';
import { SceneDrawer } from '@/features/presentation/components/scene-drawer';
import { PresentationView } from '@/features/presentation/components/presentation-view';
import { ExportDialog } from '@/features/import-export/components/export-dialog';
import { useEditorStore } from '../store/editor-store';
import type { CatalogService } from '@/lib/schemas';

interface EditorShellProps {
  isPlayground?: boolean;
}

export function EditorShell({ isPlayground = false }: EditorShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const {
    project,
    nodes,
    edges,
    loadProject,
    initNewProject,
    initPlayground,
    convertPlaygroundToProject,
    addServiceNode,
  } = useEditorStore();

  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isSceneDrawerOpen, setIsSceneDrawerOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isPresentation, setIsPresentation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      setIsLoading(true);
      if (isPlayground) {
        initPlayground();
      } else if (projectId) {
        const loaded = await loadProject(projectId);
        if (!loaded && isMounted) {
          await initNewProject();
        }
      } else if (!project) {
        await initNewProject();
      }
      if (isMounted) setIsLoading(false);
    }

    setup();

    return () => {
      isMounted = false;
    };
  }, [projectId, isPlayground]);

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

        {/* Export / Import Modal */}
        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
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
