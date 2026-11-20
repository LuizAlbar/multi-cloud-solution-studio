import { toPng } from 'html-to-image';
import type { Project } from '@/lib/schemas';

export interface PngExportOptions {
  scale?: number;
  fileName?: string;
}

export async function exportProjectToPng(
  project: Project,
  options: PngExportOptions = {}
): Promise<void> {
  const scale = options.scale || 2; // Default to 2x for high resolution
  const nodes = project.nodes || [];
  const edges = project.edges || [];

  if (nodes.length === 0) {
    throw new Error('O projeto não possui elementos para exportar.');
  }

  const sanitizedTitle = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const fileName = options.fileName || `${sanitizedTitle || 'diagrama'}.png`;

  // 1. Exact high-fidelity print of the live diagram via html-to-image
  if (typeof document !== 'undefined') {
    const viewportEl = document.querySelector('.react-flow__viewport') as HTMLElement | null;
    if (viewportEl) {
      try {
        const dataUrl = await toPng(viewportEl, {
          backgroundColor: '#FFFFFF',
          pixelRatio: scale,
          cacheBust: true,
        });

        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      } catch (err) {
        console.warn('Falha na captura DOM do viewport, usando fallback para canvas:', err);
      }
    }
  }

  // 2. Headless/Test Fallback using HTML5 canvas
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    const width = n.size?.width || 184;
    const height = n.size?.height || 92;
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + width);
    maxY = Math.max(maxY, n.position.y + height);
  });

  const margin = 80;
  const contentWidth = Math.max(400, maxX - minX + margin * 2);
  const contentHeight = Math.max(300, maxY - minY + margin * 2);

  const canvas = document.createElement('canvas');
  canvas.width = contentWidth * scale;
  canvas.height = contentHeight * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, contentWidth, contentHeight);

  // Dotted Grid
  ctx.fillStyle = '#E9EDF3';
  for (let x = 10; x < contentWidth; x += 18) {
    for (let y = 10; y < contentHeight; y += 18) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const offsetX = margin - minX;
  const offsetY = margin - minY;

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Draw Edges
  edges.forEach((edge) => {
    const sourceNode = nodeMap.get(edge.sourceId);
    const targetNode = nodeMap.get(edge.targetId);
    if (!sourceNode || !targetNode) return;

    const sWidth = sourceNode.size?.width || 184;
    const sHeight = sourceNode.size?.height || 92;
    const tWidth = targetNode.size?.width || 184;
    const tHeight = targetNode.size?.height || 92;

    const startX = sourceNode.position.x + sWidth / 2 + offsetX;
    const startY = sourceNode.position.y + sHeight / 2 + offsetY;
    const endX = targetNode.position.x + tWidth / 2 + offsetX;
    const endY = targetNode.position.y + tHeight / 2 + offsetY;

    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    if (edge.label) {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      ctx.font = '11px system-ui, sans-serif';
      const textWidth = ctx.measureText(edge.label).width;

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(midX - textWidth / 2 - 8, midY - 10, textWidth + 16, 20, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1E293B';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(edge.label, midX, midY);
    }
  });

  // Draw Nodes
  nodes.forEach((n) => {
    const width = n.size?.width || 184;
    const height = n.size?.height || 92;
    const x = n.position.x + offsetX;
    const y = n.position.y + offsetY;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 12);
    ctx.fill();
    ctx.stroke();

    if (n.providerId) {
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(n.providerId.toUpperCase(), x + 12, y + 12);
    }

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(n.label, x + 12, y + 30);
  });

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
