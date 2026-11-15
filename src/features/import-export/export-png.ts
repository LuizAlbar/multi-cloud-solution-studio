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
    alert('O projeto não possui elementos para exportar.');
    return;
  }

  // Calculate bounding box of all nodes with 80px margin
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

  // Draw Dotted Grid
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

  // Map nodes by id for edge drawing
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

    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw Edge Label if present
    if (edge.label) {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      ctx.font = '11px system-ui, sans-serif';
      const textWidth = ctx.measureText(edge.label).width;

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(midX - textWidth / 2 - 8, midY - 10, textWidth + 16, 20, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#111827';
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

    // Node Box Shadow & Background
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 12);
    ctx.fill();
    ctx.stroke();

    // Provider Badge
    if (n.providerId) {
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(n.providerId.toUpperCase(), x + 12, y + 12);
    }

    // Node Label
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(n.label, x + 12, y + 32);

    // Node Notes snippet
    if (n.notes) {
      ctx.fillStyle = '#64748B';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(n.notes.substring(0, 24) + '...', x + 12, y + 56);
    }
  });

  // Mandatory footer
  ctx.fillStyle = '#64748B';
  ctx.font = '10px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(
    'MultiCloud Solution Studio — Arquitetura de Referência',
    contentWidth - 20,
    contentHeight - 20
  );

  // Trigger Download
  const dataUrl = canvas.toDataURL('image/png');
  const sanitizedTitle = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const fileName = options.fileName || `${sanitizedTitle || 'arquitetura'}.png`;

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
