# Guia de Geração de Diagramas para Modelos de IA (MCSS Diagram Format v1.0.0)

O **MCSS Diagram Format** é o formato JSON padrão do MultiCloud Solution Studio para intercâmbio de diagramas com IAs externas.

## 1. Regra Fundamental de Saída
Sua resposta deve conter **ESTRITAMENTE O OBJETO JSON COMPLETO**. Não inclua explicações antes ou depois, e não adicione comentários dentro do JSON.

## 2. Estrutura Canônica do Documento
```json
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
```

## 3. Tipos de Nós (`kind`)
- `"service"`: Componente oficial de nuvem. **DEVE** conter `serviceId` exato constante no `service-catalog.json` (ex: `"gcp-cloud-run"`, `"aws-s3"`, `"azure-functions"`).
- `"generic"`: Elementos genéricos como usuários, sistemas legados, APIs de terceiros.
- `"group"`: Zonas visuais de nuvem e região. Incluir em `properties` os campos `providerId` e `region`.
- `"shape"`: Formas geométricas auxiliares (retângulo, círculo, banco genérico).
- `"text"`: Títulos ou seções descritivas.
- `"note"`: Post-it ou anotação explicativa.

## 4. Conexões (`edges`)
- Cada conexão deve ter `sourceId` e `targetId` referenciando IDs existentes em `nodes`.
- `direction`: `"forward"` (Origem → Destino, padrão), `"bidirectional"`, `"reverse"` ou `"none"`.
- `flowType`: `"http"`, `"data"`, `"events"`, `"network"`, `"auth"`, `"generic"` ou `"logical"`.
- `label`: Rótulo compacto e legível (ex: `"HTTPS"`, `"JDBC"`, `"gRPC"`, `"ETL"`).

## 5. Diretrizes de Layout e Posicionamento
- Utilize coordenadas `x` e `y` crescentes da esquerda para a direita (fluxo principal: entrada de clientes na esquerda, camada de aplicação no centro, bancos de dados e storage na direita).
- Mantenha espaçamento de pelo menos 250 a 350 unidades de distância entre nós para legibilidade das conexões.
