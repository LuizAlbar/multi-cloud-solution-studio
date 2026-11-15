# Implementation Plan: MultiCloud Solution Studio MVP

## Overview
O **MultiCloud Solution Studio** é uma aplicação web desktop-first e local-first desenvolvida em Next.js (App Router), TypeScript estrito, `@xyflow/react`, Tailwind CSS, shadcn/ui, Zustand, Dexie (IndexedDB) e Zod. O objetivo é permitir que Solutions Engineers construam, adaptem, expliquem e apresentem arquiteturas multicloud ao vivo durante reuniões (ex: Google Meet), cobrindo 7 provedores (Google Cloud, AWS, Azure, OCI, Cloudflare, Hostinger e Supabase), além de elementos on-premises/customizados.

A fonte canônica de requisitos é `tasks/pdr1.md` (PRD v1.0) e as regras operacionais estão em `AGENTS.md` (uso estrito de `pnpm`, TDD, separação de fronteiras, validação em navegador real e critérios `CA-01` a `CA-18`).

## Architecture Decisions
1. **Next.js App Router + TypeScript Estrito:**
   - Rotas: `/` (Dashboard de projetos), `/templates` (Galeria de templates), `/editor` (Editor e modo apresentação controlado por estado e query param `?project=<id>`).
   - Suporte a exportação estática (`output: 'export'`), sem rotas de backend nem dependência de APIs de servidor.
2. **Canvas com `@xyflow/react`:**
   - Nós customizados (`ServiceNode`, `GenericShapeNode`, `GroupNode`, `StickyNoteNode`, `TextNode`).
   - Arestas customizadas (`LabeledConnectionEdge`) com indicador de direção, tipo lógico (HTTP, Data, Event, Network, Auth, Generic) e animação visual opcional.
   - Camada de desenho livre (caneta) sincronizada no mesmo sistema de coordenadas mundiais do canvas para que zoom/pan mantenham o alinhamento (`RF-08`, `CA-04`).
3. **Estado e Persistência:**
   - **Zustand:** Gerencia estado efêmero (ferramenta ativa, hover, seleção, menus) e despacho de ações no grafo.
   - **Dexie / IndexedDB:** Persistência local robusta com tabela de projetos e thumbnails; salvamento automático com debounce (`RF-11`, `CA-07`, `CA-18`).
   - **Histórico:** Pilha imutável ou baseada em patches de ao menos 20 passos de undo/redo para nós, arestas e grupos (`RF-10`, `CA-06`).
4. **Catálogo Declarativo e Validação Zod:**
   - Catálogo estático em `src/data/service-catalog.json` cobrindo 44 serviços iniciais dos 7 provedores (`CA-02`).
   - Esquemas Zod para `Project`, `Node`, `Edge`, `Drawing`, `Scene` e formato `.mcss.json` com `schemaVersion` obrigatório e suporte a migrações/validações estritas (`CA-08`, `CA-09`).
5. **Modo Apresentação (16:9):**
   - Transição suave sem sair do projeto: oculta painéis de edição, enquadra viewport da cena, aplica spotlight nos nós/arestas da cena e ativa animação conceitual rotulada (`RF-13`, `RF-14`, `RF-15`, `CA-12`, `CA-13`, `CA-14`).
6. **Exportação PNG:**
   - Renderização limpa do canvas e overlay vetorial em imagem PNG com escala selecionável (`RF-17`, `CA-10`).
7. **Testes:**
   - Vitest para regras de domínio, catálogo, schemas e histórico.
   - Playwright para testes de fluxo end-to-end em navegador real.

---

## Task List

### Phase 1: Scaffolding, Tooling & Design Tokens
- [ ] Task 1.1: Inicialização do projeto Next.js com TypeScript estrito, Tailwind CSS e pnpm
- [ ] Task 1.2: Configuração de Vitest, scripts de qualidade e estrutura de pastas (`features/`, `components/`, `lib/`, `data/`)
- [ ] Task 1.3: Definição dos tokens visuais de design corporativo (fundo `#F8FAFC`, texto `#111827`, acento `#2563EB`) e componentes base de UI

### Checkpoint 1: Base Pronta
- [ ] Build Next.js limpo via `pnpm build`
- [ ] Vitest executando com sucesso via `pnpm test`
- [ ] Linting e typecheck estrito via `pnpm lint` e `pnpm typecheck`

---

### Phase 2: Schemas Zod, Catálogo dos 7 Provedores e Persistência Dexie
- [ ] Task 2.1: Definição de schemas Zod (`Project`, `Node`, `Edge`, `Drawing`, `Scene`, `CatalogService`, `.mcss.json`) com testes unitários
- [ ] Task 2.2: Construção do catálogo declarativo dos 7 provedores com 44 serviços iniciais conforme PRD
- [ ] Task 2.3: Implementação do serviço de persistência IndexedDB com Dexie (CRUD de projetos, auto-save com debounce, fallback e estados de salvamento)

### Checkpoint 2: Dados e Catálogo Validados
- [ ] Testes unitários do catálogo (todas as 44 entradas validadas e categorizadas)
- [ ] Testes de validação de schemas e roundtrip de serialização
- [ ] Testes de repositório Dexie em memória/mock

---

### Phase 3: Fundação do Canvas e Primeiro Vertical Slice
- [ ] Task 3.1: Configuração do `@xyflow/react` com viewport infinito, pan, zoom e grid pontilhado
- [ ] Task 3.2: Implementação do `ServiceNode` (ícone, provedor, categoria, badges, handles, foco e seleção)
- [ ] Task 3.3: Implementação da Store Zustand do Editor (nós, arestas, seleção, histórico básico de undo/redo)
- [ ] Task 3.4: Painel lateral de catálogo com busca (nome, alias, provedor, categoria) e drag-and-drop para o canvas
- [ ] Task 3.5: Inspector contextual à direita (edição de título, propriedades específicas do serviço, notas)
- [ ] Task 3.6: **Vertical Slice 1**: Adicionar Cloud Run → Conectar BigQuery → Editar propriedades → Salvar no Dexie → Reabrir → Visualizar

### Checkpoint 3: Vertical Slice Concluído
- [ ] Fluxo vertical Cloud Run → BigQuery verificado no navegador
- [ ] Autosave funcionando com indicador de status
- [ ] Testes unitários do store do canvas e inspector passando

---

### Phase 4: Editor Confiável (Conexões, Formas, Grupos, Caneta e Histórico)
- [ ] Task 4.1: Conexões customizadas (`LabeledConnectionEdge`) com rótulo, direção, tipo de fluxo lógico e estilos
- [ ] Task 4.2: Elementos genéricos e whiteboard (retângulo, círculo, texto, sticky note, sistema legado/externo, banco genérico)
- [ ] Task 4.3: Agrupamentos e zonas (mover grupo preserva posição relativa de nós filhos - `RF-09`, `CA-05`)
- [ ] Task 4.4: Camada de desenho livre (caneta) com traços em coordenadas do canvas alinhados ao zoom/pan (`RF-08`, `CA-04`)
- [ ] Task 4.5: Barra de ferramentas inferior com modos mutuamente exclusivos (Select, Pan, Connect, Shape, Text, Sticky, Pen, Eraser) e atalhos de teclado (`RF-10`)
- [ ] Task 4.6: Histórico completo com suporte a 20+ operações de undo/redo sem arestas órfãs (`RF-10`, `CA-06`)

### Checkpoint 4: Editor Completo e Confiável
- [ ] Testes do histórico de 20 operações (`CA-06`)
- [ ] Testes de agrupamento e sincronização de caneta no canvas
- [ ] Verificação interativa de todos os modos de ferramenta

---

### Phase 5: Dashboard de Projetos e Galeria de Templates
- [ ] Task 5.1: Tela de Projetos / Dashboard (`/`) com listagem, busca, novo projeto, renomear, duplicar e excluir com confirmação (`RF-01`, `CA-01`)
- [ ] Task 5.2: Galeria de Templates (`/templates`) com os 5 templates ilustrativos do PRD e prévia
- [ ] Task 5.3: Criação de novo projeto a partir de template como cópia independente (`RF-12`, `CA-11`)

### Checkpoint 5: Dashboard e Templates Integrados
- [ ] Fluxo Dashboard → Novo Projeto → Editor validado
- [ ] Templates carregando como cópias editáveis independentes

---

### Phase 6: Modo Apresentação e Cenas
- [ ] Task 6.1: Gerenciamento de Cenas no Editor (criar cena, salvar viewport, selecionar nós/arestas em destaque, títulos e notas do apresentador - `RF-13`)
- [ ] Task 6.2: Modo Apresentação 16:9 (`RF-14`, `CA-12`, `CA-14`): interface limpa, navegação entre cenas por teclado/setas, spotlight com redução de opacidade de itens fora de foco
- [ ] Task 6.3: Animação conceitual de fluxo em arestas selecionadas com aviso obrigatório de fluxo ilustrativo (`RF-15`, `CA-13`)
- [ ] Task 6.4: Fullscreen API e proteção de notas privadas na tela compartilhada (`CA-14`)

### Checkpoint 6: Apresentação Testada
- [ ] Transição Editor ↔ Apresentação suave e reversível
- [ ] Cenas preservam enquadramento e destaques sem alterar o grafo original

---

### Phase 7: Importação, Exportação e PNG
- [ ] Task 7.1: Exportação de projeto `.mcss.json` com `schemaVersion` e metadados completos (`RF-16`, `CA-08`)
- [ ] Task 7.2: Importação de projeto `.mcss.json` com validação Zod, rejeição de arquivos malformados e importação segura como novo projeto (`RF-16`, `CA-08`, `CA-09`)
- [ ] Task 7.3: Exportação em imagem PNG de alta resolução (conteúdo inteiro ou área visível) com fundo limpo e elementos legíveis (`RF-17`, `CA-10`)

### Checkpoint 7: Interoperabilidade e Mídia
- [ ] Roundtrip `.mcss.json` verificado por testes automatizados
- [ ] Validação de arquivos corrompidos/inválidos rejeitados sem perda de estado
- [ ] Geração de PNG verificada visualmente

---

### Phase 8: Qualidade, Acessibilidade, Desempenho e Defesa dos Critérios de Aceite
- [ ] Task 8.1: Acessibilidade e teclado (foco visível, navegação pelos painéis, suporte a `prefers-reduced-motion` - `RF-19`, `CA-17`)
- [ ] Task 8.2: Teste de carga e referência com 80 nós e 120 conexões medindo responsividade (`CA-16`)
- [ ] Task 8.3: Tratamento de erros e alertas de quota/falha de gravação no IndexedDB (`CA-18`)
- [ ] Task 8.4: Bateria final de testes automatizados e conferência de CA-01 a CA-18

---

## Risks and Mitigations
| Risco | Impacto | Mitigação |
|---|---|---|
| Dessincronização da camada de caneta com zoom/pan do React Flow | Alto | Renderizar a caneta dentro do container transformado pelo viewport do React Flow ou converter coordenadas mundiais usando `screenToFlowPosition`. |
| Falhas na exportação PNG com SVG de ícones ou canvas misto | Médio | Usar SVGs embutidos limpos sem recursos externos remotos; validar exportação com teste E2E real. |
| Perda de dados no IndexedDB ao limpar dados de navegação | Médio | Banner e avisos claros de que storage é local e botão direto de backup/exportação `.mcss.json`. |
| Rerenders excessivos com movimento contínuo do mouse | Alto | Separar store de estado persistido de store de ponteiro/hover efêmero; aplicar debounce na persistência. |
| Incompatibilidade de pacotes com `pnpm` | Médio | Testar builds e lockfile `pnpm-lock.yaml` estritamente com `pnpm`. |

## Open Questions
- Nenhuma no momento; requisitos P0, stack e critérios de aceite do MVP estão completamente especificados no PRD (`tasks/pdr1.md`) e `AGENTS.md`.
