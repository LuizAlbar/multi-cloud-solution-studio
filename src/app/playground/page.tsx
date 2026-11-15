import { Suspense } from 'react';
import { EditorShell } from '@/features/canvas/components/editor-shell';

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-studio-bg text-studio-secondary">
          <p className="text-xs font-medium">Iniciando Playground...</p>
        </div>
      }
    >
      <EditorShell isPlayground={true} />
    </Suspense>
  );
}
