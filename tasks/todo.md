# Tasks Todo — MultiCloud Solution Studio MVP

## Phase 1: Scaffolding, Tooling & Design Tokens

### Task 1.1: Inicialização do projeto Next.js com TypeScript estrito, Tailwind CSS e pnpm
**Description:** Inicializar o projeto com Next.js (App Router), TypeScript com verificação estrita, Tailwind CSS e Lucide React, configurado estritamente com `pnpm`.
**Acceptance criteria:**
- [x] `package.json` possui dependências corretas instaladas exclusivamente via `pnpm`
- [x] `tsconfig.json` configurado com `strict: true` e paths `@/*` mapeados para `src/*`
- [x] `pnpm dev` e `pnpm build` executam sem erros
**Verification:**
- [x] Build succeeds: `pnpm build`
- [x] Typecheck succeeds: `pnpm exec tsc --noEmit`
**Dependencies:** None
**Files likely touched:**
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `next.config.ts`
- `tailwind.config.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
**Estimated scope:** Medium (3-5 files)

---

### Task 1.2: Configuração de Vitest, scripts de qualidade e estrutura de pastas
**Description:** Configurar Vitest com testing-library/react e ambiente jsdom para testes de unidade e componentes, além de criar os diretórios de arquitetura modular recomendados pelo PRD (`features/`, `components/`, `lib/`, `data/`).
**Acceptance criteria:**
- [x] Script `pnpm test` roda os testes com Vitest
- [x] Teste de sanidade básico passa com sucesso
- [x] Estrutura modular de diretórios criada conforme PRD seção 8.2
**Verification:**
- [x] Tests pass: `pnpm test`
**Dependencies:** Task 1.1
**Files likely touched:**
- `vitest.config.ts`
- `src/test/setup.ts`
- `src/test/sanity.test.ts`
**Estimated scope:** Small (1-2 files)

---

### Task 1.3: Definição dos tokens visuais de design corporativo e componentes base de UI
**Description:** Configurar os tokens de cores do PRD (Fundo `#F8FAFC`, texto `#111827`, secundário `#64748B`, bordas `#E5E7EB`, acento `#2563EB`, destaque suave `#EFF6FF`) e criar componentes atômicos essenciais (Button, Card, Input, Dialog, Tooltip, Badge).
**Acceptance criteria:**
- [x] Tokens visuais corporativos configurados em Tailwind e CSS variables
- [x] Componentes base de UI criados em `src/components/ui/`
- [x] Interface visual reflete estética clean e corporativa conforme PRD seção 6
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 1.1
**Files likely touched:**
- `src/app/globals.css`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
**Estimated scope:** Medium (3-5 files)

---

## Checkpoint 1: Base e Ferramental Prontos
- [x] `pnpm build` concluído sem erros
- [x] `pnpm test` executado com sucesso
- [x] TypeScript estrito validado

---

## Phase 2: Schemas Zod, Catálogo dos 7 Provedores e Persistência Dexie

### Task 2.1: Definição de schemas Zod para o modelo de dados completo
**Description:** Criar esquemas Zod e tipos TypeScript para `Project`, `Node`, `Edge`, `Drawing`, `Scene`, `CatalogService` e formato `.mcss.json` com `schemaVersion` obrigatório conforme PRD seção 7.
**Acceptance criteria:**
- [x] Schemas Zod definidos para todas as entidades principais
- [x] Validações garantem `schemaVersion` e campos obrigatórios
- [x] Testes unitários validando parsing e rejeição de payloads inválidos
**Verification:**
- [x] Tests pass: `pnpm test src/lib/schemas/`
**Dependencies:** Task 1.2
**Files likely touched:**
- `src/lib/schemas/project.ts`
- `src/lib/schemas/catalog.ts`
- `src/lib/schemas/index.ts`
- `src/lib/schemas/schemas.test.ts`
**Estimated scope:** Medium (3-5 files)

---

### Task 2.2: Construção do catálogo declarativo dos 7 provedores com 44 serviços iniciais
**Description:** Construir o catálogo declarativo com as 44 entradas iniciais especificadas no PRD seção 4.2 (Google Cloud, AWS, Azure, OCI, Cloudflare, Hostinger e Supabase), com metadados, links para documentação oficial, categorias e ícones vetoriais.
**Acceptance criteria:**
- [x] Exatamente 44 serviços declarados com dados estruturados
- [x] Cobertura dos 7 provedores e categorias da taxonomia oficial
- [x] Testes unitários confirmam integridade e contagem do catálogo
**Verification:**
- [x] Tests pass: `pnpm test src/features/catalog/`
**Dependencies:** Task 2.1
**Files likely touched:**
- `src/data/service-catalog.json`
- `src/features/catalog/catalog-service.ts`
- `src/features/catalog/catalog.test.ts`
**Estimated scope:** Small (2-3 files)

---

### Task 2.3: Implementação do serviço de persistência IndexedDB com Dexie
**Description:** Criar a camada de persistência com Dexie para armazenamento local-first dos projetos, histórico de alterações, controle de status (Salvando / Salvo / Erro) e debounce de gravação conforme `RF-11` e `CA-07`.
**Acceptance criteria:**
- [x] Repositório Dexie suporta CRUD de projetos e thumbnails
- [x] Tratamento de erros de cota e falhas com status recuperável
- [x] Testes unitários cobrindo operações de persistência
**Verification:**
- [x] Tests pass: `pnpm test src/lib/storage/`
**Dependencies:** Task 2.1
**Files likely touched:**
- `src/lib/storage/db.ts`
- `src/lib/storage/project-repository.ts`
- `src/lib/storage/storage.test.ts`
**Estimated scope:** Medium (3 files)

---

## Checkpoint 2: Dados, Catálogo e Persistência Validados
- [x] Catálogo validado com 44 itens
- [x] Persistência Dexie com testes unitários passando

---

## Phase 3: Fundação do Canvas e Primeiro Vertical Slice

### Task 3.1: Configuração do `@xyflow/react` e Canvas Base
**Description:** Implementar o componente de canvas com `@xyflow/react`, controles de zoom, pan, fit-to-view, grade pontilhada e layout do editor (`RF-03`, `RF-04`).
**Acceptance criteria:**
- [x] Canvas renderiza com controles e grid pontilhado corporativo
- [x] Zoom, pan e seleção funcionam fluidamente
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 1.3
**Files likely touched:**
- `src/features/canvas/components/canvas.tsx`
- `src/app/editor/page.tsx`
**Estimated scope:** Small (2 files)

---

### Task 3.2: Implementação do `ServiceNode` e visual de componentes cloud
**Description:** Criar o nó customizado do React Flow para serviços de nuvem com ícone, nome editável, badge do provedor, categoria, status de seleção (borda azul 2px) e handles de conexão nos 4 lados.
**Acceptance criteria:**
- [x] Nó exibe ícone do provedor/serviço, label e badge conforme design do PRD
- [x] Handles de conexão aparecem na seleção/hover
**Verification:**
- [x] Tests pass: `pnpm test src/features/canvas/nodes/`
**Dependencies:** Task 3.1, Task 2.2
**Files likely touched:**
- `src/features/canvas/nodes/service-node.tsx`
- `src/features/canvas/nodes/service-node.test.tsx`
**Estimated scope:** Small (2 files)

---

### Task 3.3: Implementação da Store Zustand do Editor
**Description:** Criar store Zustand para gerenciar nós, arestas, seleção ativa, ferramenta em uso e integração com o repositório de persistência Dexie.
**Acceptance criteria:**
- [x] Ações atômicas: adicionar nó, mover nó, conectar, selecionar, remover
- [x] Separação clara entre estado do documento e estado transitório de UI
**Verification:**
- [x] Tests pass: `pnpm test src/features/canvas/store/`
**Dependencies:** Task 2.3, Task 3.2
**Files likely touched:**
- `src/features/canvas/store/editor-store.ts`
- `src/features/canvas/store/editor-store.test.ts`
**Estimated scope:** Small (2 files)

---

### Task 3.4: Painel lateral de catálogo e busca com Drag-and-Drop
**Description:** Desenvolver o painel esquerdo com abas, busca instantânea (por nome, sinônimos, provedor e categoria) e suporte a arrastar serviços para o canvas ou clicar para inserir no centro (`RF-02`, `RF-03`).
**Acceptance criteria:**
- [x] Busca filtra instantaneamente nos 44 serviços
- [x] Arrastar um item solta o nó na coordenada do canvas
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 3.3
**Files likely touched:**
- `src/features/catalog/components/catalog-sidebar.tsx`
- `src/features/catalog/components/catalog-item.tsx`
**Estimated scope:** Medium (3 files)

---

### Task 3.5: Inspector contextual à direita
**Description:** Criar o painel lateral direito para inspecionar e editar propriedades do nó selecionado: título, provedor, categoria, link para doc oficial e propriedades customizadas (`RF-06`, `RF-18`).
**Acceptance criteria:**
- [x] Exibe e edita dados do nó selecionado
- [x] Link oficial verificado abre em nova aba
- [x] Alterações refletem imediatamente no nó do canvas
**Verification:**
- [x] Tests pass: `pnpm test src/features/canvas/inspector/`
**Dependencies:** Task 3.3
**Files likely touched:**
- `src/features/canvas/components/inspector.tsx`
- `src/features/canvas/components/inspector.test.tsx`
**Estimated scope:** Small (2 files)

---

### Task 3.6: Vertical Slice 1 - Cloud Run → BigQuery → Salvar → Reabrir
**Description:** Integrar o fluxo vertical completo recomendado no PRD: adicionar Cloud Run, adicionar BigQuery, conectá-los, editar propriedades no inspector, autosave no Dexie, recarregar a página e confirmar restauração integral (`CA-03`, `CA-07`).
**Acceptance criteria:**
- [x] Fluxo funciona ponta a ponta no navegador
- [x] Dados persistem após reload da página
**Verification:**
- [x] Manual check / browser test: carregar editor, arrastar nós, salvar e recarregar
**Dependencies:** Tasks 3.1 a 3.5
**Files likely touched:**
- `src/app/editor/page.tsx`
- `src/features/canvas/components/editor-shell.tsx`
**Estimated scope:** Small (2 files)

---

## Checkpoint 3: Vertical Slice Concluído
- [x] Fluxo vertical Cloud Run → BigQuery verificado
- [x] Autosave funcionando e restaurando estado

---

## Phase 4: Editor Confiável (Conexões, Formas, Grupos, Caneta e Histórico)

### Task 4.1: Conexões customizadas com rótulos e tipos lógicos
**Description:** Implementar arestas customizadas (`LabeledConnectionEdge`) com suporte a direção por seta, tipo de fluxo lógico (HTTP/API, dados, eventos, rede, autenticação, genérico) e rótulo central editável (`RF-05`).
**Acceptance criteria:**
- [x] Arestas renderizam com estilo e rótulo selecionável
- [x] Edição do tipo lógico e rótulo no inspector
**Verification:**
- [x] Tests pass: `pnpm test src/features/canvas/`
**Dependencies:** Task 3.6
**Files likely touched:**
- `src/features/canvas/edges/labeled-connection-edge.tsx`
- `src/features/canvas/edges/edge.test.ts`
**Estimated scope:** Small (2 files)

---

### Task 4.2: Elementos genéricos e Whiteboard
**Description:** Implementar nós genéricos para retângulo, círculo, texto, sticky note, sistema externo/legado e banco genérico (`RF-07`, `CA-04`).
**Acceptance criteria:**
- [x] Formas e notas inseríveis no canvas e redimensionáveis
- [x] Cores neutras e estilos configuráveis pelo inspector
**Verification:**
- [x] Tests pass: `pnpm test src/features/canvas/`
**Dependencies:** Task 3.6
**Files likely touched:**
- `src/features/canvas/nodes/generic-shape-node.tsx`
- `src/features/canvas/nodes/sticky-note-node.tsx`
- `src/features/canvas/nodes/text-node.tsx`
**Estimated scope:** Medium (3-4 files)

---

### Task 4.3: Agrupamentos e Zonas
**Description:** Implementar grupos/zonas no canvas onde nós contidos se movem junto com o container sem alterar suas posições relativas nem quebrar conexões (`RF-09`, `CA-05`).
**Acceptance criteria:**
- [x] Mover zona desloca todos os nós internos
- [x] Conexões entre nós internos e externos permanecem íntegras
**Verification:**
- [x] Tests pass: `pnpm test src/features/canvas/`
**Dependencies:** Task 4.2
**Files likely touched:**
- `src/features/canvas/nodes/group-node.tsx`
- `src/features/canvas/groups/group.test.ts`
**Estimated scope:** Small (2 files)

---

### Task 4.4: Camada de desenho livre (Caneta) sincronizada
**Description:** Implementar ferramenta de caneta e borracha livre sincronizada com o sistema de coordenadas mundiais do canvas para que zoom e pan preservem o alinhamento exato (`RF-08`, `CA-04`).
**Acceptance criteria:**
- [x] Traço livre desenhado em coordenadas de canvas
- [x] Zoom e pan mantêm traço perfeitamente alinhado aos nós
**Verification:**
- [x] Tests pass: `pnpm test src/features/annotations/`
**Dependencies:** Task 3.6
**Files likely touched:**
- `src/features/annotations/components/drawing-overlay.tsx`
- `src/features/annotations/store/drawing-store.ts`
**Estimated scope:** Small (2 files)

---

### Task 4.5: Barra de ferramentas inferior e atalhos de teclado
**Description:** Criar barra flutuante inferior com modos de ferramenta mutuamente exclusivos (Select, Pan, Connect, Shape, Text, Sticky, Pen, Eraser) e atalhos de teclado padrão (`Ctrl+K`, `Ctrl+Z`, `Space+drag`, `Delete`, `Esc`, `F`, `P` - `RF-10`, seção 5.1).
**Acceptance criteria:**
- [x] Modos de ferramenta comutáveis e mutuamente exclusivos
- [x] Atalhos não disparam enquanto usuário digita em inputs
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** Tasks 4.1 a 4.4
**Files likely touched:**
- `src/features/canvas/components/toolbar.tsx`
- `src/features/canvas/hooks/use-editor-shortcuts.ts`
**Estimated scope:** Small (2 files)

---

### Task 4.6: Histórico completo (Undo/Redo com 20+ passos)
**Description:** Implementar histórico de operações com pilha de ao menos 20 estados, suportando desfazer e refazer para nós, arestas, formas e grupos sem gerar arestas órfãs (`RF-10`, `CA-06`).
**Acceptance criteria:**
- [x] Suporta no mínimo 20 passos de desfazer/refazer
- [x] Teste automatizado simula 20 operações e valida integridade
**Verification:**
- [x] Tests pass: `pnpm test src/lib/history/`
**Dependencies:** Tasks 4.1 a 4.5
**Files likely touched:**
- `src/lib/history/history-manager.ts`
- `src/lib/history/history.test.ts`
**Estimated scope:** Small (2 files)

---

## Checkpoint 4: Editor Confiável Completo
- [x] Teste de 20 operações de histórico passando
- [x] Formas, grupos e caneta validados no canvas

---

## Phase 5: Dashboard de Projetos e Galeria de Templates

### Task 5.1: Dashboard de Projetos (`/`)
**Description:** Implementar a tela inicial com listagem de projetos locais salvos no Dexie, busca por nome, criação de novo projeto, renomear, duplicar e exclusão com confirmação modal (`RF-01`, `CA-01`).
**Acceptance criteria:**
- [x] Lista projetos com data de atualização e badges de provedores
- [x] CRUD completo funcional com confirmação de exclusão
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 2.3
**Files likely touched:**
- `src/app/page.tsx`
- `src/features/projects/components/project-card.tsx`
- `src/features/projects/components/project-grid.tsx`
**Estimated scope:** Medium (3 files)

---

### Task 5.2: Galeria de Templates (`/templates`) com os 5 cenários iniciais
**Description:** Criar galeria com os 5 templates ilustrativos do PRD seção 3 (Serverless web app, AWS Analytics, RAG Enterprise AI, Managed backend com Cloudflare+Supabase, OCI Enterprise) com modal de prévia (`CA-11`).
**Acceptance criteria:**
- [x] 5 templates disponíveis com metadados e prévias
- [x] Aviso de arquitetura ilustrativa visível em cada card
**Verification:**
- [x] Tests pass: `pnpm test src/data/templates/`
**Dependencies:** Task 2.1
**Files likely touched:**
- `src/app/templates/page.tsx`
- `src/data/templates/index.ts`
- `src/features/templates/components/template-card.tsx`
**Estimated scope:** Medium (3 files)

---

### Task 5.3: Criação de projeto a partir de template como cópia independente
**Description:** Ao clicar em "Usar este template", criar um novo projeto com IDs próprios, sem alterar o template original (`RF-12`, `CA-11`).
**Acceptance criteria:**
- [x] Projeto criado é cópia desvinculada
- [x] Template original permanece inalterado
**Verification:**
- [x] Tests pass: `pnpm test src/data/templates/`
**Dependencies:** Task 5.1, Task 5.2
**Files likely touched:**
- `src/app/templates/page.tsx`
- `src/data/templates/templates.test.ts`
**Estimated scope:** Small (2 files)

---

## Checkpoint 5: Dashboard e Templates Integrados
- [x] Dashboard lista e cria projetos
- [x] Templates abrem como cópias editáveis

---

## Phase 6: Modo Apresentação e Cenas

### Task 6.1: Gerenciamento de Cenas no Editor
**Description:** Criar painel/drawer para adicionar cenas, capturar viewport atual, selecionar nós e arestas em destaque, ordenar cenas e adicionar notas do apresentador (`RF-13`, `CA-12`).
**Acceptance criteria:**
- [x] Cenas armazenam viewport, destaques e notas
- [x] Mínimo de 1 cena suportada por projeto
**Verification:**
- [x] Tests pass: `pnpm test src/lib/schemas/`
**Dependencies:** Task 3.3
**Files likely touched:**
- `src/features/presentation/components/scene-drawer.tsx`
**Estimated scope:** Small (2 files)

---

### Task 6.2: Modo Apresentação 16:9 e Spotlight
**Description:** Implementar tela cheia e visualização 16:9 limpa, sem controles de edição, com navegação por setas do teclado, enquadramento suave do viewport da cena e redução de opacidade de itens fora de foco (`RF-14`, `CA-12`, `CA-14`).
**Acceptance criteria:**
- [x] Painéis de edição ocultos no modo apresentação
- [x] Navegação entre cenas por setas e controles discretos
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 6.1
**Files likely touched:**
- `src/features/presentation/components/presentation-view.tsx`
**Estimated scope:** Medium (3 files)

---

### Task 6.3: Animação conceitual de fluxo
**Description:** Implementar animação visual apenas nas arestas explicitamente marcadas na cena ativa, com rodapé obrigatório "Fluxo ilustrativo — não representa tráfego real" (`RF-15`, `CA-13`).
**Acceptance criteria:**
- [x] Anima apenas arestas configuradas
- [x] Aviso visível de fluxo conceitual sempre exibido
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 6.2
**Files likely touched:**
- `src/features/presentation/components/presentation-view.tsx`
**Estimated scope:** Small (1-2 files)

---

### Task 6.4: Fullscreen e proteção de notas do apresentador
**Description:** Integrar Fullscreen API e garantir que notas privadas não fiquem visíveis no canvas compartilhado durante apresentações (`CA-14`).
**Acceptance criteria:**
- [x] Fullscreen acionável via botão e atalho
- [x] Notas do apresentador separadas em painel recolhível
**Verification:**
- [x] Manual check: testar alternância de tela cheia
**Dependencies:** Task 6.2
**Files likely touched:**
- `src/features/presentation/components/presentation-view.tsx`
**Estimated scope:** Small (1 file)

---

## Checkpoint 6: Apresentação Completa
- [x] Cenas navegáveis em 16:9
- [x] Animação e spotlight validados

---

## Phase 7: Importação, Exportação e PNG

### Task 7.1: Exportação de projeto `.mcss.json`
**Description:** Gerar arquivo JSON versionado contendo todos os dados do projeto (nós, arestas, anotações, cenas, viewport e metadados) com nome padrão `projeto-YYYY-MM-DD.mcss.json` (`RF-16`, `CA-08`).
**Acceptance criteria:**
- [x] JSON inclui `schemaVersion` e integridade referencial
- [x] Download disparado localmente no navegador
**Verification:**
- [x] Tests pass: `pnpm test src/features/import-export/`
**Dependencies:** Task 2.1
**Files likely touched:**
- `src/features/import-export/export-project.ts`
- `src/features/import-export/import-export.test.ts`
**Estimated scope:** Small (2 files)

---

### Task 7.2: Importação segura de `.mcss.json`
**Description:** Implementar importador de arquivo que valida o schema com Zod, rejeita arquivos corrompidos ou maliciosos com erro claro e importa sempre como um novo projeto no Dexie (`RF-16`, `CA-08`, `CA-09`).
**Acceptance criteria:**
- [x] Arquivo inválido rejeitado com mensagem explicativa sem corromper estado
- [x] Arquivo válido importado com novo ID sem sobrescrever projeto aberto
**Verification:**
- [x] Tests pass: `pnpm test src/features/import-export/`
**Dependencies:** Task 7.1
**Files likely touched:**
- `src/features/import-export/import-project.ts`
- `src/features/import-export/import-export.test.ts`
**Estimated scope:** Small (2 files)

---

### Task 7.3: Exportação em imagem PNG de alta resolução
**Description:** Implementar exportador de PNG permitindo escolher conteúdo inteiro ou área visível, com escala e fundo claro garantindo legibilidade de ícones, textos e conexões (`RF-17`, `CA-10`).
**Acceptance criteria:**
- [x] PNG gerado inclui todos os nós, formas, textos e conexões
- [x] Fundo branco e escala configurável
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 3.1
**Files likely touched:**
- `src/features/import-export/export-png.ts`
- `src/features/import-export/components/export-dialog.tsx`
**Estimated scope:** Small (2 files)

---

## Checkpoint 7: Import/Export e PNG Concluídos
- [x] Roundtrip `.mcss.json` verificado
- [x] Rejeição de arquivo malformado validada
- [x] Exportação PNG visualmente limpa

---

## Phase 8: Qualidade, Acessibilidade, Desempenho e Defesa dos Critérios de Aceite

### Task 8.1: Acessibilidade e teclado
**Description:** Auditar e garantir foco visível, navegação por teclado e respeito a `prefers-reduced-motion` em toda a aplicação (`RF-19`, `CA-17`).
**Acceptance criteria:**
- [x] Navegação completa por teclado em painéis e dialogs
- [x] `prefers-reduced-motion` desativa animações
**Verification:**
- [x] Tests pass: `pnpm test src/`
**Dependencies:** All previous tasks
**Files likely touched:**
- `src/app/globals.css`
- `src/features/canvas/components/canvas.tsx`
**Estimated scope:** Small (2 files)

---

### Task 8.2: Teste de carga e referência (80 nós e 120 conexões)
**Description:** Implementar gerador de cenário de benchmark com 80 nós e 120 arestas e validar responsividade no Chrome (`CA-16`).
**Acceptance criteria:**
- [x] Cenário com 80 nós e 120 arestas carrega e responde a pan/zoom
- [x] Métricas de desempenho documentadas
**Verification:**
- [x] Benchmark script / test passes: `pnpm test src/test/benchmark-scene.test.ts`
**Dependencies:** Task 3.6
**Files likely touched:**
- `src/test/benchmark-scene.test.ts`
**Estimated scope:** Small (1 file)

---

### Task 8.3: Tratamento de erros e alertas de quota/falha de gravação
**Description:** Implementar aviso explícito quando o IndexedDB falhar ou atingir cota, oferecendo exportação manual de emergência e impedindo status falso de "Salvo" (`CA-18`).
**Acceptance criteria:**
- [x] Status indica erro visualmente em caso de falha
- [x] Botão de download de emergência habilitado
**Verification:**
- [x] Tests pass: `pnpm test src/lib/storage/`
**Dependencies:** Task 2.3
**Files likely touched:**
- `src/features/canvas/components/topbar.tsx`
**Estimated scope:** Small (1-2 files)

---

### Task 8.4: Verificação integral dos Critérios de Aceite (CA-01 a CA-18)
**Description:** Executar varredura completa dos critérios CA-01 a CA-18 do PRD, validando scripts de teste, build e execução de navegador.
**Acceptance criteria:**
- [x] Todos os 18 critérios de aceite confirmados com evidências
- [x] `pnpm build`, `pnpm test`, `pnpm typecheck` com 100% de sucesso
**Verification:**
- [x] `pnpm build && pnpm test && pnpm typecheck`
**Dependencies:** All tasks
**Files likely touched:**
- `README.md`
**Estimated scope:** Small (1 file)

---

# PRD 2 — Evolução Visual e Funcional

## Phase 9: Fatia A — Identidade, Logo, Favicon e Tokens Visuais
### Task 9.1: Integração de logo.png e favicon.png e tokens visuais roxo/índigo
**Description:** Integrar a logo e favicon reais fornecidos em `assets/` e `public/` nos headers do Dashboard e Editor e nos metadados do Next.js. Ajustar tokens de acento para roxo/índigo alinhado com a nova marca.
**Acceptance criteria:**
- [x] Logo oficial visível no header do Dashboard e Editor com proporção e alinhamento corretos
- [x] Favicon oficial configurado e carregando na aba do navegador
- [x] Acento de cor alinhado à identidade roxo/índigo da marca
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** None
**Files likely touched:**
- `src/app/layout.tsx`
- `src/app/globals.css`
- `tailwind.config.ts`
- `src/features/canvas/components/topbar.tsx`
- `src/app/page.tsx`
- `src/app/templates/page.tsx`
**Estimated scope:** Medium (3-5 files)

---

## Phase 10: Fatia B — Modo Playground Anônimo e Efêmero (RF2-01)
### Task 10.1: Criação da rota `/playground` e isolamento de estado em memória
**Description:** Criar rota `/playground` e modo de execução 100% efêmero (stateless). O playground nunca salva em IndexedDB/localStorage, inicia sempre vazio após refresh e não altera contadores ou lista de projetos.
**Acceptance criteria:**
- [x] Botão "Playground" de destaque no Dashboard ao lado de "Novo Projeto"
- [x] Rota `/playground` abre canvas vazio com indicador "Playground · Não salvo"
- [x] Nenhuma persistência automática ocorre no Dexie/storage durante o playground
- [x] Atualizar página volta ao canvas vazio
- [x] Ações manuais de exportar PNG e exportar JSON funcionam normalmente
- [x] Opção opt-in "Salvar como projeto" converte o rascunho em projeto salvo somente se o usuário desejar
**Verification:**
- [x] Tests pass: `pnpm test`
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 9.1
**Files likely touched:**
- `src/app/playground/page.tsx`
- `src/features/canvas/components/editor-shell.tsx`
- `src/features/canvas/components/topbar.tsx`
- `src/features/canvas/store/editor-store.ts`
- `src/app/page.tsx`
**Estimated scope:** Medium (4-5 files)

---

## Phase 11: Fatia C — Redesign Compacto e Remoção de Notas do Apresentador nos Nós (RF2-02, RF2-05)
### Task 11.1: Remoção de "Notas do Apresentador" do inspector de elementos e formulários de nós
**Description:** Remover o campo "Notas do apresentador" do inspector de nós/formas e formulários de elementos. Preservar apenas as notas técnicas de arquitetura no nó e manter `speakerNotes` exclusivamente no roteiro de cenas da apresentação.
**Acceptance criteria:**
- [x] Inspector de nós não exibe mais "Notas do Apresentador"
- [x] Projetos antigos abrem sem erros preservando outros campos
- [x] Notas privadas das cenas de apresentação continuam intactas
**Verification:**
- [x] Tests pass: `pnpm test`
**Dependencies:** None
**Files likely touched:**
- `src/features/canvas/components/inspector.tsx`
- `src/features/canvas/nodes/service-node.tsx`
- `src/features/canvas/store/editor-store.ts`
**Estimated scope:** Small (2-3 files)

### Task 11.2: Redesign minimalista, compacto e aumento da densidade útil no Dashboard e Editor
**Description:** Refinar o layout do Dashboard (grid limpo e centralizado, sem vazio exagerado, exibindo apenas os projetos reais) e do Editor (espaçamentos mais compactos de 4/8/12/16px, nós com altura proporcional, inspector limpo e sem grupos vazios).
**Acceptance criteria:**
- [x] Dashboard com layout equilibrado e compacto para 0, 1, 2 ou muitos projetos
- [x] Editor com preenchimentos compactos e área útil otimizada para 1366x768 e 1920x1080
- [x] Sem componentes decorativos vazios ou botões sem ação real
**Verification:**
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 11.1
**Files likely touched:**
- `src/app/page.tsx`
- `src/features/canvas/components/inspector.tsx`
- `src/features/catalog/components/catalog-sidebar.tsx`
- `src/features/canvas/nodes/service-node.tsx`
**Estimated scope:** Medium (4 files)

---

## Phase 12: Fatia D — Expansão do Catálogo para 150+ Serviços com Ícones Específicos (RF2-03)
### Task 12.1: Expansão do manifesto declarativo com 150+ serviços oficiais dos 7 provedores
**Description:** Expandir o catálogo para mais de 150 serviços reais cobrindo todas as categorias essenciais nos 7 provedores (GCP, AWS, Azure, OCI, Cloudflare, Hostinger, Supabase), preservando os 44 IDs existentes.
**Acceptance criteria:**
- [x] Mais de 150 serviços reais catalogados com documentação oficial (153 serviços)
- [x] Cobertura de todas as categorias da taxonomia oficial
- [x] Compatibilidade retroativa total com os 44 serviços do MVP
**Verification:**
- [x] Tests pass: `pnpm test src/features/catalog/`
**Dependencies:** None
**Files likely touched:**
- `src/data/service-catalog.json`
- `src/features/catalog/catalog-service.ts`
- `src/features/catalog/catalog.test.ts`
**Estimated scope:** Medium (3 files)

### Task 12.2: Implementação de ícones específicos e diferenciados por serviço
**Description:** Implementar renderização de ícones oficiais específicos para cada serviço (ex: Cloud Run, BigQuery, S3, EC2, Lambda, Azure Functions, Workers, Supabase Auth), sem chamadas de rede externas e sem repetir a logo genérica do provedor para todos os serviços.
**Acceptance criteria:**
- [x] Serviços possuem ícones distintos e reconhecíveis da sua oferta
- [x] Ícones renderizados localmente via SVG/componentes sem dependência de internet
- [x] Busca filtra por nome, alias, provedor e categoria com contadores reais
**Verification:**
- [x] Tests pass: `pnpm test`
- [x] Build succeeds: `pnpm build`
**Dependencies:** Task 12.1
**Files likely touched:**
- `src/features/catalog/components/service-icons.tsx`
- `src/features/catalog/components/provider-icons.tsx`
- `src/features/canvas/nodes/service-node.tsx`
- `src/features/catalog/components/catalog-sidebar.tsx`
**Estimated scope:** Medium (4 files)

---

## Phase 13: Fatia E — QA, Regressão e Validação da DoD do PRD 2
### Task 13.1: Bateria completa de testes, regressão e validação dos critérios de aceite do PRD 2
**Description:** Executar validação de ponta a ponta: Playground efêmero, compatibilidade de projetos salvos, exportação PNG/JSON, expansão do catálogo, branding com logo/favicon e ausência de notas de apresentador nos nós.
**Acceptance criteria:**
- [x] Todos os testes unitários e de integração passando (29 testes em 10 suítes)
- [x] Typecheck estrito aprovado sem erros
- [x] Build do Next.js aprovado com todas as rotas estáticas (/ e /playground)
- [x] Documentação do README.md atualizada com as novidades do PRD 2
**Verification:**
- [x] `pnpm build && pnpm test && pnpm typecheck`
**Dependencies:** All PRD 2 tasks
**Files likely touched:**
- `README.md`
**Estimated scope:** Small (1 file)


