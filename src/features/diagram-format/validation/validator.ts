import {
  MCSSDiagramDocumentSchema,
  MCSS_FORMAT_IDENTIFIER,
  MCSS_SCHEMA_VERSION,
  MCSS_MAX_PAYLOAD_SIZE,
  MCSS_MAX_NODES,
  MCSS_MAX_EDGES,
  MCSS_MAX_DRAWINGS,
  MCSS_MAX_SCENES,
  type MCSSDiagramDocument,
} from '../domain/diagram-format';
import { getCatalogServiceById } from '@/features/catalog/catalog-service';

export interface ValidationIssue {
  code: string;
  severity: 'error' | 'warning';
  path: string; // JSON Pointer, e.g. /diagram/edges/0/targetId
  message: string;
  hint?: string;
}

export interface ValidationReport {
  isValid: boolean; // true if 0 errors (warnings are permitted)
  hasErrors: boolean;
  hasWarnings: boolean;
  issues: ValidationIssue[];
  document?: MCSSDiagramDocument;
  summary: {
    nodeCount: number;
    edgeCount: number;
    sceneCount: number;
    drawingCount: number;
    providers: string[];
    unknownServices: string[];
  };
}

/**
 * Strips markdown code fences (```json ... ```) safely if user pasted raw AI response.
 */
export function sanitizePastedJson(rawText: string): string {
  let cleaned = rawText.trim();

  // If text starts with ``` or ```json and ends with ```
  if (cleaned.startsWith('```')) {
    const firstNewline = cleaned.indexOf('\n');
    const lastFence = cleaned.lastIndexOf('```');
    if (firstNewline !== -1 && lastFence > firstNewline) {
      cleaned = cleaned.substring(firstNewline + 1, lastFence).trim();
    }
  }

  return cleaned;
}

/**
 * Validates an MCSS Diagram JSON string across structural and semantic layers.
 */
export function validateMCSSDiagramJson(rawJson: string): ValidationReport {
  const issues: ValidationIssue[] = [];

  // 1. Payload Size Check (Security Limit)
  if (new Blob([rawJson]).size > MCSS_MAX_PAYLOAD_SIZE) {
    issues.push({
      code: 'PAYLOAD_TOO_LARGE',
      severity: 'error',
      path: '/',
      message: `O arquivo excede o limite máximo permitido de 3 MiB.`,
      hint: 'Reduza o tamanho do diagrama ou divida-o em partes menores.',
    });
    return createErrorReport(issues);
  }

  // 2. Strict JSON Parse
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sintaxe JSON inválida';
    issues.push({
      code: 'INVALID_JSON',
      severity: 'error',
      path: '/',
      message: `Erro de sintaxe JSON: ${message}`,
      hint: 'Certifique-se de que o texto não contém aspas simples, vírgulas sobrando ou comentários.',
    });
    return createErrorReport(issues);
  }

  if (typeof parsed !== 'object' || parsed === null) {
    issues.push({
      code: 'NOT_AN_OBJECT',
      severity: 'error',
      path: '/',
      message: 'O documento raiz deve ser um objeto JSON.',
      hint: 'O JSON deve começar com { e conter os campos obrigatórios format, schemaVersion, metadata e diagram.',
    });
    return createErrorReport(issues);
  }

  const rawObj = parsed as Record<string, unknown>;

  // 3. Format Identifier Check
  if (rawObj.format !== MCSS_FORMAT_IDENTIFIER) {
    issues.push({
      code: 'UNSUPPORTED_FORMAT',
      severity: 'error',
      path: '/format',
      message: `Formato de arquivo incompatível. Esperado "${MCSS_FORMAT_IDENTIFIER}", recebido "${String(rawObj.format || 'indefinido')}".`,
      hint: 'Se você estiver importando um projeto legado do estúdio, use a ferramenta de migração ou verifique o arquivo exportado.',
    });
    return createErrorReport(issues);
  }

  // 4. Schema Version Check
  const version = typeof rawObj.schemaVersion === 'string' ? rawObj.schemaVersion : '';
  const majorVersion = version.split('.')[0];
  const expectedMajor = MCSS_SCHEMA_VERSION.split('.')[0];
  if (majorVersion !== expectedMajor) {
    issues.push({
      code: 'INCOMPATIBLE_VERSION',
      severity: 'error',
      path: '/schemaVersion',
      message: `Versão do schema (${version || 'ausente'}) incompatível com esta versão do estúdio (${MCSS_SCHEMA_VERSION}).`,
      hint: `A versão requerida do formato é ${MCSS_SCHEMA_VERSION}.`,
    });
    return createErrorReport(issues);
  }

  // 5. Structural Validation (Zod)
  const structuralResult = MCSSDiagramDocumentSchema.safeParse(parsed);
  if (!structuralResult.success) {
    for (const zIssue of structuralResult.error.issues) {
      const pointerPath = '/' + zIssue.path.join('/');
      issues.push({
        code: 'STRUCTURAL_ERROR',
        severity: 'error',
        path: pointerPath,
        message: zIssue.message,
        hint: `Campo esperado em ${pointerPath}`,
      });
    }
    return createErrorReport(issues);
  }

  const doc = structuralResult.data;

  // 6. Semantic Validation

  // A. Resource Limits
  if (doc.diagram.nodes.length > MCSS_MAX_NODES) {
    issues.push({
      code: 'NODE_LIMIT_EXCEEDED',
      severity: 'error',
      path: '/diagram/nodes',
      message: `O diagrama contém ${doc.diagram.nodes.length} nós, excedendo o limite de ${MCSS_MAX_NODES}.`,
      hint: 'Divida a arquitetura em múltiplos diagramas.',
    });
  }

  if (doc.diagram.edges.length > MCSS_MAX_EDGES) {
    issues.push({
      code: 'EDGE_LIMIT_EXCEEDED',
      severity: 'error',
      path: '/diagram/edges',
      message: `O diagrama contém ${doc.diagram.edges.length} conexões, excedendo o limite de ${MCSS_MAX_EDGES}.`,
      hint: 'Reduza o número de conexões redundantes.',
    });
  }

  if (doc.diagram.drawings.length > MCSS_MAX_DRAWINGS) {
    issues.push({
      code: 'DRAWING_LIMIT_EXCEEDED',
      severity: 'error',
      path: '/diagram/drawings',
      message: `O diagrama contém ${doc.diagram.drawings.length} desenhos livres, excedendo o limite de ${MCSS_MAX_DRAWINGS}.`,
    });
  }

  if (doc.diagram.scenes.length > MCSS_MAX_SCENES) {
    issues.push({
      code: 'SCENE_LIMIT_EXCEEDED',
      severity: 'error',
      path: '/diagram/scenes',
      message: `O diagrama contém ${doc.diagram.scenes.length} cenas, excedendo o limite de ${MCSS_MAX_SCENES}.`,
    });
  }

  // B. Unique Node IDs
  const nodeMap = new Map<string, (typeof doc.diagram.nodes)[0]>();
  doc.diagram.nodes.forEach((node, index) => {
    if (nodeMap.has(node.id)) {
      issues.push({
        code: 'DUPLICATE_NODE_ID',
        severity: 'error',
        path: `/diagram/nodes/${index}/id`,
        message: `Identificador de nó duplicado: "${node.id}".`,
        hint: 'Cada nó deve ter um "id" exclusivo no diagrama.',
      });
    } else {
      nodeMap.set(node.id, node);
    }
  });

  // C. Parent ID cycle check
  doc.diagram.nodes.forEach((node, index) => {
    if (node.parentId) {
      if (node.parentId === node.id) {
        issues.push({
          code: 'CIRCULAR_PARENT_ID',
          severity: 'error',
          path: `/diagram/nodes/${index}/parentId`,
          message: `O nó "${node.id}" aponta para si mesmo como parentId.`,
          hint: 'Remova o parentId ou aponte para um grupo válido.',
        });
      } else if (!nodeMap.has(node.parentId)) {
        issues.push({
          code: 'PARENT_NODE_NOT_FOUND',
          severity: 'error',
          path: `/diagram/nodes/${index}/parentId`,
          message: `O grupo pai "${node.parentId}" referenciado pelo nó "${node.id}" não existe.`,
          hint: 'Crie o nó de grupo ou corrija o parentId.',
        });
      }
    }
  });

  // D. Unique Edge IDs & Valid Endpoints
  const edgeMap = new Set<string>();
  doc.diagram.edges.forEach((edge, index) => {
    if (edgeMap.has(edge.id)) {
      issues.push({
        code: 'DUPLICATE_EDGE_ID',
        severity: 'error',
        path: `/diagram/edges/${index}/id`,
        message: `Identificador de conexão duplicado: "${edge.id}".`,
        hint: 'Cada conexão deve ter um "id" exclusivo.',
      });
    } else {
      edgeMap.add(edge.id);
    }

    if (!nodeMap.has(edge.sourceId)) {
      issues.push({
        code: 'EDGE_SOURCE_NOT_FOUND',
        severity: 'error',
        path: `/diagram/edges/${index}/sourceId`,
        message: `A conexão "${edge.id}" aponta para uma origem inexistente: "${edge.sourceId}".`,
        hint: 'Crie o nó de origem ou corrija o sourceId da conexão.',
      });
    }

    if (!nodeMap.has(edge.targetId)) {
      issues.push({
        code: 'EDGE_TARGET_NOT_FOUND',
        severity: 'error',
        path: `/diagram/edges/${index}/targetId`,
        message: `A conexão "${edge.id}" aponta para um destino inexistente: "${edge.targetId}".`,
        hint: 'Crie o nó de destino ou corrija o targetId da conexão.',
      });
    }
  });

  // E. Service Catalog Resolution & Unknown Services Fallback (CA5-14 / CA5-20 / RF5-06)
  const unknownServices: string[] = [];
  const providersSet = new Set<string>();

  doc.diagram.nodes.forEach((node, index) => {
    if (node.kind === 'service') {
      if (!node.serviceId) {
        issues.push({
          code: 'MISSING_SERVICE_ID',
          severity: 'error',
          path: `/diagram/nodes/${index}/serviceId`,
          message: `Nó do tipo "service" com id "${node.id}" não possui "serviceId".`,
          hint: 'Informe o serviceId do catálogo ou altere o kind para "generic".',
        });
      } else {
        const found = getCatalogServiceById(node.serviceId);
        if (!found) {
          unknownServices.push(node.serviceId);
          issues.push({
            code: 'UNKNOWN_SERVICE_ID',
            severity: 'warning',
            path: `/diagram/nodes/${index}/serviceId`,
            message: `Serviço "${node.serviceId}" não foi encontrado no catálogo instalado. Será exibido como componente genérico.`,
            hint: 'O rótulo e as propriedades serão preservados com fallback visual.',
          });
        } else {
          providersSet.add(found.providerId);
        }
      }
    } else if (node.kind === 'group' && node.properties?.providerId) {
      providersSet.add(String(node.properties.providerId));
    }
  });

  // F. Scene highlights validation
  doc.diagram.scenes.forEach((scene, index) => {
    scene.nodeHighlights.forEach((nid) => {
      if (!nodeMap.has(nid)) {
        issues.push({
          code: 'SCENE_NODE_NOT_FOUND',
          severity: 'warning',
          path: `/diagram/scenes/${index}/nodeHighlights`,
          message: `A cena "${scene.title}" destaca o nó inexistente "${nid}".`,
          hint: 'A referência órfã será ignorada na apresentação.',
        });
      }
    });

    scene.edgeHighlights.forEach((eid) => {
      if (!edgeMap.has(eid)) {
        issues.push({
          code: 'SCENE_EDGE_NOT_FOUND',
          severity: 'warning',
          path: `/diagram/scenes/${index}/edgeHighlights`,
          message: `A cena "${scene.title}" destaca a conexão inexistente "${eid}".`,
          hint: 'A referência órfã será ignorada na apresentação.',
        });
      }
    });
  });

  const hasErrors = issues.some((i) => i.severity === 'error');
  const hasWarnings = issues.some((i) => i.severity === 'warning');

  return {
    isValid: !hasErrors,
    hasErrors,
    hasWarnings,
    issues,
    document: hasErrors ? undefined : doc,
    summary: {
      nodeCount: doc.diagram.nodes.length,
      edgeCount: doc.diagram.edges.length,
      sceneCount: doc.diagram.scenes.length,
      drawingCount: doc.diagram.drawings.length,
      providers: Array.from(providersSet),
      unknownServices,
    },
  };
}

function createErrorReport(issues: ValidationIssue[]): ValidationReport {
  return {
    isValid: false,
    hasErrors: true,
    hasWarnings: issues.some((i) => i.severity === 'warning'),
    issues,
    summary: {
      nodeCount: 0,
      edgeCount: 0,
      sceneCount: 0,
      drawingCount: 0,
      providers: [],
      unknownServices: [],
    },
  };
}
