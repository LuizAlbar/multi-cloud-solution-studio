import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const CATALOG_PATH = path.join(ROOT_DIR, 'src/data/service-catalog.json');
const AI_DOCS_DIR = path.join(ROOT_DIR, 'docs/ai');
const EXAMPLES_DIR = path.join(AI_DOCS_DIR, 'examples');

// Ensure target directories exist
if (!fs.existsSync(EXAMPLES_DIR)) {
  fs.mkdirSync(EXAMPLES_DIR, { recursive: true });
}

const rawCatalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

// 1. Generate Manifest service-catalog.json
export function generateServiceCatalogJson() {
  const manifest = {
    catalogVersion: '1.0.0',
    totalServices: rawCatalog.services.length,
    providers: rawCatalog.providers,
    categories: rawCatalog.categories,
    services: rawCatalog.services.map((svc) => ({
      serviceId: svc.serviceId,
      providerId: svc.providerId,
      category: svc.category,
      displayName: svc.displayName,
      shortDescription: svc.shortDescription,
      officialDocsUrl: svc.officialDocsUrl,
      lastReviewedAt: svc.lastReviewedAt,
    })),
  };
  return JSON.stringify(manifest, null, 2);
}

// 2. Generate JSON Schema Draft 2020-12 (mcss-diagram.schema.json)
export function generateMcssSchemaJson() {
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://cloud-solution-studio.voler.com/schemas/mcss-diagram-v1.json',
    title: 'MCSS Diagram Format v1.0.0',
    description: 'Contrato aberto de diagramas de arquitetura do MultiCloud Solution Studio para importação/exportação e interoperabilidade com IA.',
    type: 'object',
    required: ['format', 'schemaVersion', 'metadata', 'diagram'],
    properties: {
      format: {
        type: 'string',
        const: 'mcss.diagram',
        description: 'Discriminador fixo de formato.',
      },
      schemaVersion: {
        type: 'string',
        pattern: '^\\d+\\.\\d+\\.\\d+$',
        description: 'Versão SemVer do contrato (ex: 1.0.0).',
      },
      catalogVersion: {
        type: 'string',
        description: 'Versão informativa do catálogo de serviços.',
      },
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
        additionalProperties: true,
      },
      diagram: {
        type: 'object',
        required: ['nodes', 'edges'],
        properties: {
          nodes: {
            type: 'array',
            items: { $ref: '#/$defs/node' },
            maxItems: 500,
          },
          edges: {
            type: 'array',
            items: { $ref: '#/$defs/edge' },
            maxItems: 1000,
          },
          drawings: {
            type: 'array',
            items: { $ref: '#/$defs/drawing' },
            maxItems: 300,
          },
          scenes: {
            type: 'array',
            items: { $ref: '#/$defs/scene' },
            maxItems: 50,
          },
          viewport: { $ref: '#/$defs/viewport' },
          settings: {
            type: 'object',
            properties: {
              snapToGrid: { type: 'boolean' },
              showGrid: { type: 'boolean' },
              reduceMotion: { type: 'boolean' },
            },
          },
        },
        additionalProperties: true,
      },
      extensions: { type: 'object' },
    },
    $defs: {
      viewport: {
        type: 'object',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          zoom: { type: 'number', minimum: 0.1, maximum: 5 },
        },
      },
      node: {
        type: 'object',
        required: ['id', 'kind', 'label', 'position'],
        properties: {
          id: { type: 'string', minLength: 1, maxLength: 128 },
          kind: {
            type: 'string',
            enum: ['service', 'generic', 'group', 'shape', 'note', 'text'],
          },
          label: { type: 'string', maxLength: 256 },
          serviceId: {
            type: 'string',
            description: 'serviceId exato do catálogo quando kind=service (ex: gcp-cloud-run, aws-s3).',
          },
          position: {
            type: 'object',
            required: ['x', 'y'],
            properties: {
              x: { type: 'number' },
              y: { type: 'number' },
            },
          },
          size: {
            type: 'object',
            properties: {
              width: { type: 'number', minimum: 1 },
              height: { type: 'number', minimum: 1 },
            },
          },
          parentId: { type: 'string', maxLength: 128 },
          properties: { type: 'object' },
          notes: {
            type: 'string',
            maxLength: 10000,
            description: 'Observações técnicas da solução.',
          },
          style: { type: 'object' },
        },
        additionalProperties: true,
      },
      edge: {
        type: 'object',
        required: ['id', 'sourceId', 'targetId'],
        properties: {
          id: { type: 'string', minLength: 1, maxLength: 128 },
          sourceId: { type: 'string', minLength: 1, maxLength: 128 },
          targetId: { type: 'string', minLength: 1, maxLength: 128 },
          sourceHandle: { type: 'string' },
          targetHandle: { type: 'string' },
          direction: {
            type: 'string',
            enum: ['forward', 'reverse', 'bidirectional', 'none'],
          },
          flowType: {
            type: 'string',
            enum: ['http', 'data', 'events', 'network', 'auth', 'generic', 'logical'],
          },
          label: { type: 'string', maxLength: 128 },
          animated: { type: 'boolean' },
          notes: { type: 'string' },
        },
        additionalProperties: true,
      },
      drawing: {
        type: 'object',
        required: ['id', 'points'],
        properties: {
          id: { type: 'string' },
          points: {
            type: 'array',
            items: {
              type: 'object',
              required: ['x', 'y'],
              properties: { x: { type: 'number' }, y: { type: 'number' } },
            },
          },
          strokeWidth: { type: 'number', minimum: 1 },
          color: { type: 'string' },
          layer: { type: 'number' },
        },
      },
      scene: {
        type: 'object',
        required: ['id', 'order', 'title'],
        properties: {
          id: { type: 'string' },
          order: { type: 'integer', minimum: 0 },
          title: { type: 'string', minLength: 1, maxLength: 256 },
          description: { type: 'string', maxLength: 2000 },
          speakerNotes: {
            type: 'string',
            maxLength: 10000,
            description: 'Roteiro e notas do apresentador exclusivo para a cena.',
          },
          viewport: { $ref: '#/$defs/viewport' },
          nodeHighlights: { type: 'array', items: { type: 'string' } },
          edgeHighlights: { type: 'array', items: { type: 'string' } },
          animatedEdgeIds: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  };
  return JSON.stringify(schema, null, 2);
}

// 3. Generate README.md
export function generateReadmeMd() {
  return `# MultiCloud Solution Studio — Kit para IA

Versão do Formato: \`1.0.0\`  
Versão do Catálogo: \`1.0.0\`  
Serviços Reais Suportados: \`${rawCatalog.services.length}\`  

Este kit contém os artefatos oficiais necessários para que modelos de IA externos (ChatGPT, Claude, Gemini etc.) gerem diagramas de arquitetura no formato **MCSS Diagram Format** (\`.mcss.json\`).

## Arquivos no Kit

1. \`AI_GUIDE.md\`: Manual de regras de modelagem arquitetural para modelos de linguagem.
2. \`mcss-diagram.schema.json\`: JSON Schema Draft 2020-12 autossuficiente para validação offline.
3. \`service-catalog.json\`: Manifesto canônico de todos os ${rawCatalog.services.length} serviços reais disponíveis nos 7 provedores.
4. \`PROMPT_TEMPLATE.md\`: Prompt pronto para copiar e colar na IA junto com os requisitos (BANT).
5. \`FORMAT_CHANGELOG.md\`: Histórico de evolução e versionamento do contrato de diagramas.
6. \`examples/\`: Exemplos completos válidos e prontos para importar.

## Aviso de Privacidade e Segurança
Antes de enviar requisitos ou BANT a serviços de IA externos, certifique-se de anonimizar dados confidenciais de clientes, senhas, chaves de API e nomes proprietários de acordo com a política corporativa da sua organização.
`;
}

// 4. Generate AI_GUIDE.md
export function generateAiGuideMd() {
  return `# Guia de Geração de Diagramas para Modelos de IA (MCSS Diagram Format v1.0.0)

O **MCSS Diagram Format** é o formato JSON padrão do MultiCloud Solution Studio para intercâmbio de diagramas com IAs externas.

## 1. Regra Fundamental de Saída
Sua resposta deve conter **ESTRITAMENTE O OBJETO JSON COMPLETO**. Não inclua explicações antes ou depois, e não adicione comentários dentro do JSON.

## 2. Estrutura Canônica do Documento
\`\`\`json
{
  "format": "mcss.diagram",
  "schemaVersion": "1.0.0",
  "metadata": {
    "title": "Nome da Arquitetura",
    "description": "Breve resumo do fluxo arquitetural",
    "origin": "ai"
  },
  "diagram": {
    "nodes": [],
    "edges": [],
    "drawings": [],
    "scenes": [],
    "viewport": { "x": 0, "y": 0, "zoom": 1 }
  }
}
\`\`\`

## 3. Tipos de Nós (\`kind\`)
- \`"service"\`: Componente oficial de nuvem. **DEVE** conter \`serviceId\` exato constante no \`service-catalog.json\` (ex: \`"gcp-cloud-run"\`, \`"aws-s3"\`, \`"azure-functions"\`).
- \`"generic"\`: Elementos genéricos como usuários, sistemas legados, APIs de terceiros.
- \`"group"\`: Zonas visuais de nuvem e região. Incluir em \`properties\` os campos \`providerId\` e \`region\`.
- \`"shape"\`: Formas geométricas auxiliares (retângulo, círculo, banco genérico).
- \`"text"\`: Títulos ou seções descritivas.
- \`"note"\`: Post-it ou anotação explicativa.

## 4. Conexões (\`edges\`)
- Cada conexão deve ter \`sourceId\` e \`targetId\` referenciando IDs existentes em \`nodes\`.
- \`direction\`: \`"forward"\` (Origem → Destino, padrão), \`"bidirectional"\`, \`"reverse"\` ou \`"none"\`.
- \`flowType\`: \`"http"\`, \`"data"\`, \`"events"\`, \`"network"\`, \`"auth"\`, \`"generic"\` ou \`"logical"\`.
- \`label\`: Rótulo compacto e legível (ex: \`"HTTPS"\`, \`"JDBC"\`, \`"gRPC"\`, \`"ETL"\`).

## 5. Diretrizes de Layout e Posicionamento
- Utilize coordenadas \`x\` e \`y\` crescentes da esquerda para a direita (fluxo principal: entrada de clientes na esquerda, camada de aplicação no centro, bancos de dados e storage na direita).
- Mantenha espaçamento de pelo menos 250 a 350 unidades de distância entre nós para legibilidade das conexões.
`;
}

// 5. Generate PROMPT_TEMPLATE.md
export function generatePromptTemplateMd() {
  return `# Template de Prompt para Geração de Diagrama com IA

Copie e cole as instruções abaixo na sua IA de preferência (ChatGPT, Claude, Gemini etc.):

---

\`\`\`text
Você é um Arquiteto de Soluções Cloud Sênior. Sua tarefa é produzir um diagrama de arquitetura no formato oficial "MCSS Diagram Format v1.0.0" para o MultiCloud Solution Studio.

REGRAS OBRIGATÓRIAS:
1. Retorne ESTRITAMENTE o JSON completo válido com "format": "mcss.diagram" e "schemaVersion": "1.0.0". Não inclua texto, Markdown ou comentários adicionais.
2. Para nós com kind="service", use estritamente serviceIds canônicos reais dos 7 provedores (AWS, GCP, Azure, OCI, Cloudflare, Hostinger, Supabase), como:
   - GCP: "gcp-cloud-run", "gcp-bigquery", "gcp-cloud-storage", "gcp-cloud-sql", "gcp-gke"
   - AWS: "aws-ec2", "aws-lambda", "aws-s3", "aws-rds", "aws-dynamodb", "aws-ecs"
   - Azure: "azure-functions", "azure-virtual-machines", "azure-sql-database", "azure-aks"
   - Cloudflare: "cloudflare-workers", "cloudflare-r2", "cloudflare-d1", "cloudflare-waf"
   - Supabase: "supabase-postgres", "supabase-auth", "supabase-realtime", "supabase-storage"
3. Para serviços externos ou não catalogados, use kind="generic" com label claro.
4. Conecte os nós de forma lógica com edges apontando para IDs válidos existentes.
5. Organize o layout horizontalmente da esquerda para a direita com posições x/y legíveis (espaçamento de ~300px).

REQUISITOS / BANT DO CLIENTE:
[Cole aqui o briefing, BANT ou requisitos técnicos do cliente]
\`\`\`
`;
}

// 6. Generate FORMAT_CHANGELOG.md
export function generateFormatChangelogMd() {
  return `# MCSS Diagram Format — Changelog do Contrato

## [1.0.0] - 2026-11-15
### Adicionado
- Contrato JSON público oficial identificado por \`format: "mcss.diagram"\` e \`schemaVersion: "1.0.0"\`.
- Especificação formal de nós (\`service\`, \`generic\`, \`group\`, \`shape\`, \`note\`, \`text\`).
- Conexões direcionais com fluxos semânticos (\`http\`, \`data\`, \`events\`, \`network\`, \`auth\`, \`generic\`, \`logical\`).
- Suporte a Zonas Visuais multicloud com identificação de provedor e região.
- Suporte a desenhos livres vetoriais e cenas de apresentação com \`speakerNotes\`.
- Validador em duas camadas (estrutural Zod / JSON Schema e semântica com fallback seguro).
- Kit para IA com manifesto determinístico de ${rawCatalog.services.length} serviços reais.
`;
}

// 7. Generate Examples
export function generateExamples() {
  const minimal = {
    format: 'mcss.diagram',
    schemaVersion: '1.0.0',
    metadata: {
      title: 'Diagrama Mínimo',
      description: 'Exemplo minimalista com nós genéricos',
      origin: 'ai',
    },
    diagram: {
      nodes: [
        {
          id: 'client',
          kind: 'generic',
          label: 'Usuário Web',
          position: { x: 100, y: 150 },
          properties: {},
        },
        {
          id: 'server',
          kind: 'generic',
          label: 'Servidor de Aplicação',
          position: { x: 450, y: 150 },
          properties: {},
        },
      ],
      edges: [
        {
          id: 'e1',
          sourceId: 'client',
          targetId: 'server',
          direction: 'forward',
          flowType: 'http',
          label: 'HTTPS',
        },
      ],
      drawings: [],
      scenes: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  };

  const multicloud = {
    format: 'mcss.diagram',
    schemaVersion: '1.0.0',
    metadata: {
      title: 'Arquitetura Multicloud Serverless & Analytics',
      description: 'Exemplo com serviços reais dos 7 provedores',
      origin: 'ai',
    },
    diagram: {
      nodes: [
        {
          id: 'cf-edge',
          kind: 'service',
          serviceId: 'cloudflare-workers',
          label: 'Edge Worker & WAF',
          position: { x: 100, y: 200 },
          properties: { region: 'Global Anycast' },
        },
        {
          id: 'gcp-api',
          kind: 'service',
          serviceId: 'gcp-cloud-run',
          label: 'API Serverless',
          position: { x: 420, y: 200 },
          properties: { environment: 'production', capacity: 'Auto-scaling' },
        },
        {
          id: 'aws-store',
          kind: 'service',
          serviceId: 'aws-s3',
          label: 'Data Lake S3',
          position: { x: 740, y: 120 },
          properties: { region: 'us-east-1' },
        },
        {
          id: 'sb-auth-db',
          kind: 'service',
          serviceId: 'supabase-postgres',
          label: 'PostgreSQL Gerenciado',
          position: { x: 740, y: 280 },
          properties: { pooling: 'enabled' },
        },
      ],
      edges: [
        {
          id: 'e-edge-to-api',
          sourceId: 'cf-edge',
          targetId: 'gcp-api',
          direction: 'forward',
          flowType: 'http',
          label: 'HTTPS / JSON',
          animated: true,
        },
        {
          id: 'e-api-to-store',
          sourceId: 'gcp-api',
          targetId: 'aws-store',
          direction: 'forward',
          flowType: 'data',
          label: 'S3 API / Blobs',
        },
        {
          id: 'e-api-to-db',
          sourceId: 'gcp-api',
          targetId: 'sb-auth-db',
          direction: 'bidirectional',
          flowType: 'data',
          label: 'JDBC / SQL',
        },
      ],
      drawings: [],
      scenes: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  };

  const presentation = {
    format: 'mcss.diagram',
    schemaVersion: '1.0.0',
    metadata: {
      title: 'Apresentação Executiva de Arquitetura',
      description: 'Diagrama com roteiro e cenas configuradas',
      origin: 'ai',
    },
    diagram: {
      nodes: [
        {
          id: 'n-front',
          kind: 'generic',
          label: 'Frontend SPA',
          position: { x: 100, y: 150 },
        },
        {
          id: 'n-backend',
          kind: 'service',
          serviceId: 'gcp-cloud-run',
          label: 'Backend Microservices',
          position: { x: 450, y: 150 },
        },
      ],
      edges: [
        {
          id: 'e-front-back',
          sourceId: 'n-front',
          targetId: 'n-backend',
          direction: 'forward',
          flowType: 'http',
          label: 'HTTPS / REST',
        },
      ],
      drawings: [],
      scenes: [
        {
          id: 'scene-intro',
          order: 0,
          title: 'Cena 1: Recepção do Tráfego',
          description: 'Apresentação do ponto de entrada da solução.',
          speakerNotes: 'Explicar aos diretores de TI como o tráfego do usuário atinge a borda.',
          viewport: { x: 0, y: 0, zoom: 1 },
          nodeHighlights: ['n-front'],
          edgeHighlights: ['e-front-back'],
        },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  };

  return {
    'minimal.mcss.json': JSON.stringify(minimal, null, 2),
    'multicloud-real-services.mcss.json': JSON.stringify(multicloud, null, 2),
    'presentation-with-scenes.mcss.json': JSON.stringify(presentation, null, 2),
  };
}

// Write all files
export function writeAiDocs() {
  fs.writeFileSync(path.join(AI_DOCS_DIR, 'service-catalog.json'), generateServiceCatalogJson());
  fs.writeFileSync(path.join(AI_DOCS_DIR, 'mcss-diagram.schema.json'), generateMcssSchemaJson());
  fs.writeFileSync(path.join(AI_DOCS_DIR, 'README.md'), generateReadmeMd());
  fs.writeFileSync(path.join(AI_DOCS_DIR, 'AI_GUIDE.md'), generateAiGuideMd());
  fs.writeFileSync(path.join(AI_DOCS_DIR, 'PROMPT_TEMPLATE.md'), generatePromptTemplateMd());
  fs.writeFileSync(path.join(AI_DOCS_DIR, 'FORMAT_CHANGELOG.md'), generateFormatChangelogMd());

  const examples = generateExamples();
  for (const [name, content] of Object.entries(examples)) {
    fs.writeFileSync(path.join(EXAMPLES_DIR, name), content);
  }

  console.log('✓ Documentação e Kit para IA gerados com sucesso em docs/ai/');
}

if (process.argv[1] && process.argv[1].includes('generate-ai-docs')) {
  writeAiDocs();
}
