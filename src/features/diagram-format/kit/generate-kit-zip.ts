import { zipSync, strToU8 } from 'fflate';
import catalogData from '@/data/service-catalog.json';
import { PROVIDERS, CATEGORIES } from '@/features/catalog/catalog-service';
import { MCSS_SCHEMA_VERSION, MCSS_CATALOG_VERSION } from '../domain/diagram-format';

export function buildAiKitFiles(): Record<string, Uint8Array> {
  const manifest = {
    catalogVersion: MCSS_CATALOG_VERSION,
    totalServices: catalogData.services.length,
    providers: PROVIDERS,
    categories: CATEGORIES,
    services: catalogData.services.map((svc) => ({
      serviceId: svc.serviceId,
      providerId: svc.providerId,
      category: svc.category,
      displayName: svc.displayName,
      shortDescription: svc.shortDescription,
      officialDocsUrl: svc.officialDocsUrl,
      lastReviewedAt: svc.lastReviewedAt,
    })),
  };

  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://cloud-solution-studio.voler.com/schemas/mcss-diagram-v1.json',
    title: 'MCSS Diagram Format v1.0.0',
    description: 'Contrato aberto de diagramas de arquitetura do MultiCloud Solution Studio para importação/exportação e interoperabilidade com IA.',
    type: 'object',
    required: ['format', 'schemaVersion', 'metadata', 'diagram'],
    properties: {
      format: { type: 'string', const: 'mcss.diagram' },
      schemaVersion: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
      catalogVersion: { type: 'string' },
      metadata: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 256 },
          description: { type: 'string', maxLength: 2000 },
          origin: { type: 'string', enum: ['ai', 'human', 'export'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      diagram: {
        type: 'object',
        required: ['nodes', 'edges'],
        properties: {
          nodes: { type: 'array', maxItems: 500 },
          edges: { type: 'array', maxItems: 1000 },
          drawings: { type: 'array', maxItems: 300 },
          scenes: { type: 'array', maxItems: 50 },
          viewport: { type: 'object' },
        },
      },
    },
  };

  const readme = `# MultiCloud Solution Studio — Kit para IA

Versão do Formato: \`${MCSS_SCHEMA_VERSION}\`  
Versão do Catálogo: \`${MCSS_CATALOG_VERSION}\`  
Serviços Reais Suportados: \`${catalogData.services.length}\`  

Este kit contém os artefatos oficiais necessários para que modelos de IA externos (ChatGPT, Claude, Gemini etc.) gerem diagramas de arquitetura no formato **MCSS Diagram Format** (\`.mcss.json\`).

## Arquivos no Kit
1. AI_GUIDE.md: Manual de regras de modelagem arquitetural para modelos de linguagem.
2. mcss-diagram.schema.json: JSON Schema Draft 2020-12 autossuficiente para validação offline.
3. service-catalog.json: Manifesto canônico de todos os ${catalogData.services.length} serviços reais disponíveis nos 7 provedores.
4. PROMPT_TEMPLATE.md: Prompt pronto para copiar e colar na IA junto com os requisitos (BANT).
5. FORMAT_CHANGELOG.md: Histórico de evolução e versionamento do contrato de diagramas.
6. examples/: Exemplos completos válidos e prontos para importar.
`;

  const guide = `# Guia de Geração de Diagramas para Modelos de IA (MCSS Diagram Format v1.0.0)

Sua resposta deve conter **ESTRITAMENTE O OBJETO JSON COMPLETO**.

## Estrutura Básica
{
  "format": "mcss.diagram",
  "schemaVersion": "1.0.0",
  "metadata": { "title": "Minha Solução", "origin": "ai" },
  "diagram": { "nodes": [], "edges": [] }
}
`;

  const prompt = `# Template de Prompt para Geração de Diagrama com IA

Copie e cole na sua IA:

\`\`\`text
Você é um Arquiteto de Soluções Cloud. Retorne ESTRITAMENTE o JSON completo válido com "format": "mcss.diagram" e "schemaVersion": "1.0.0".
Use serviceIds válidos do catálogo para nós kind="service" e posições x/y legíveis.
\`\`\`
`;

  const changelog = `# MCSS Diagram Format — Changelog

## [1.0.0] - 2026-11-15
- Contrato JSON público oficial identificado por format: "mcss.diagram" e schemaVersion: "1.0.0".
`;

  const minimalExample = JSON.stringify(
    {
      format: 'mcss.diagram',
      schemaVersion: '1.0.0',
      metadata: { title: 'Diagrama Mínimo', origin: 'ai' },
      diagram: {
        nodes: [
          { id: 'client', kind: 'generic', label: 'Cliente', position: { x: 100, y: 100 } },
          { id: 'api', kind: 'service', serviceId: 'gcp-cloud-run', label: 'API', position: { x: 400, y: 100 } },
        ],
        edges: [
          { id: 'e1', sourceId: 'client', targetId: 'api', direction: 'forward', flowType: 'http', label: 'HTTPS' },
        ],
      },
    },
    null,
    2
  );

  return {
    'README.md': strToU8(readme),
    'AI_GUIDE.md': strToU8(guide),
    'PROMPT_TEMPLATE.md': strToU8(prompt),
    'mcss-diagram.schema.json': strToU8(JSON.stringify(schema, null, 2)),
    'service-catalog.json': strToU8(JSON.stringify(manifest, null, 2)),
    'FORMAT_CHANGELOG.md': strToU8(changelog),
    'examples/minimal.mcss.json': strToU8(minimalExample),
  };
}

export function downloadAiKitZip(): void {
  const files = buildAiKitFiles();
  const zipData = zipSync(files);

  const fileName = `multicloud-studio-ai-kit-v${MCSS_SCHEMA_VERSION}-${MCSS_CATALOG_VERSION}.zip`;
  const blob = new Blob([zipData], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
