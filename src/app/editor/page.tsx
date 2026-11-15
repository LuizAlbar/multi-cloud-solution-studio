import { Suspense } from 'react';
import { EditorShell } from '@/features/canvas/components/editor-shell';

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-studio-bg text-studio-secondary">
          <p className="text-xs font-medium">Carregando editor...</p>
        </div>
      }
    >
      <EditorShell />
    </Suspense>
  );
}
