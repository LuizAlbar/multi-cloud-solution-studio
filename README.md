# MultiCloud Solution Studio

> Estúdio visual desktop-first e local-first para Solutions Engineers e Arquitetos de Soluções desenharem, adaptarem, explicarem e apresentarem arquiteturas tecnológicas multicloud ao vivo durante reuniões (ex: Google Meet).

---

## 🚀 Novidades do PRD 2 (Evolução Visual e Funcional)

- **Modo Playground Anônimo e Efêmero (`/playground`):** Experimentação instantânea sem criar ou salvar projeto no IndexedDB. Rascunho 100% em memória, com exportação manual e conversão opt-in para projeto permanente.
- **Catálogo Expandido (153 Serviços Reais):** Cobertura massiva dos 7 provedores (Google Cloud, AWS, Azure, OCI, Cloudflare, Hostinger e Supabase), com taxonomia completa e metadados oficiais.
- **Ícones Oficiais Específicos por Serviço:** Renderização de ícones distintos e reconhecíveis para cada serviço (Cloud Run, BigQuery, S3, EC2, Lambda, Azure Functions, Workers, Supabase Auth etc.), sem chamadas de rede externas e sem repetir a logo genérica do provedor.
- **Branding Oficial Integrado:** Aplicação da logo oficial (`assets/logo.png`) e favicon (`assets/favicon.png`) no cabeçalho do Dashboard, Editor e metadados da aplicação, com paleta e acento visual roxo/índigo alinhados à marca.
- **Redesign Compacto e Minimalista:** Densidade útil aprimorada, margens equilibradas e eliminação de caixas vazias ou decorações sem função.
- **Remoção de "Notas do Apresentador" dos Elementos:** Foco limpo no inspector de nós (apenas notas técnicas de arquitetura), preservando as notas do apresentador exclusivamente no roteiro de cenas da apresentação.

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, React 19, TypeScript estrito) com suporte a exportação estática (`output: 'export'`).
- **Canvas & Grafo:** [`@xyflow/react`](https://reactflow.dev/) v12 com nós inteligentes, conexões rotuladas e agrupamento.
- **Design & UI:** [Tailwind CSS](https://tailwindcss.com/) com tokens corporativos sóbrios, ícones [Lucide React](https://lucide.dev/) e primitivas baseadas em shadcn/ui.
- **Estado Reativo:** [Zustand](https://github.com/pmndrs/zustand) com separação de estado efêmero e documento.
- **Persistência Local-First:** [Dexie.js](https://dexie.org/) sobre IndexedDB, salvamento com debounce e fallback em caso de erro de cota.
- **Validação de Schemas:** [Zod](https://zod.dev/) para catálogo, projetos, cenas e interoperabilidade `.mcss.json`.
- **Testes Automatizados:** [Vitest](https://vitest.dev/) com Testing Library e `fake-indexeddb`.
- **Gerenciador de Pacotes:** `pnpm` (exclusivo).

---

## 📦 Como Executar

### Pré-requisitos
- Node.js `>= 20.x`
- `pnpm` `>= 9.x`

### Comandos Principais

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento local
pnpm dev

# Executar suíte completa de testes automatizados
pnpm test

# Verificação estrita de tipos TypeScript
pnpm typecheck

# Compilar para produção
pnpm build
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## ☁️ Cobertura do Catálogo (153 Serviços Verificados)

O catálogo declarativo (`src/data/service-catalog.json`) inclui metadados completos, categorias da taxonomia oficial e links para documentações oficiais verificadas:

| Provedor | Qtd | Serviços Principais |
|---|:---:|---|
| **Google Cloud (GCP)** | 38 | Cloud Run, Compute Engine, GKE, Cloud Storage, Cloud SQL, BigQuery, Vertex AI, Cloud Load Balancing, Spanner, Firestore, Pub/Sub, Dataflow, AlloyDB, Cloud Armor, IAM, Secret Manager... |
| **Amazon Web Services (AWS)** | 46 | EC2, Lambda, ECS, EKS, Fargate, S3, EBS, RDS, Aurora, DynamoDB, Athena, Bedrock, API Gateway, SQS, SNS, EventBridge, SageMaker, CloudWatch, OpenSearch, Step Functions... |
| **Microsoft Azure** | 27 | Virtual Machines, Functions, App Service, AKS, Container Apps, Blob Storage, Azure SQL Database, Cosmos DB, Azure Front Door, Synapse, OpenAI Service, Entra ID, Key Vault, Monitor... |
| **Oracle Cloud (OCI)** | 16 | OCI Compute, VCN, OKE, Object Storage, Block Volumes, Autonomous Database, MySQL HeatWave, Load Balancer, FastConnect, Generative AI, IAM, Vault... |
| **Cloudflare** | 12 | Workers, Pages, Durable Objects, R2, D1, KV, Vectorize, CDN, WAF, DNS, Zero Trust, Queues |
| **Hostinger** | 6 | VPS, Web Hosting, Cloud Hosting, WordPress Hosting, WooCommerce Hosting, Business Email |
| **Supabase** | 8 | Postgres, Auth, Storage, Edge Functions, Realtime, Vector (pgvector), GraphQL API, Vault |
| **Total** | **153** | **100% categorizados e validados com links oficiais** |

---

## 🏛️ Galeria de Templates de Arquitetura (`/templates`)

A aplicação conta com 5 templates ilustrativos de referência prontos para uso em reuniões de pré-vendas e discovery:

1. **Aplicação Web Serverless Multicloud:** Cloudflare CDN/WAF + Cloud Run + Cloud SQL.
2. **Analytics sobre Dados AWS e BigQuery:** Amazon S3 + Amazon Athena + BigQuery.
3. **IA Empresarial com RAG:** RAG Gateway + Supabase Postgres (pgvector) + Vertex AI (Gemini).
4. **Backend Gerenciado Moderno:** Cloudflare Workers + Supabase (Postgres, Auth, Storage).
5. **Aplicação Corporativa em OCI:** OCI Load Balancer + Compute Cluster em VCN privada + Oracle Autonomous Database.

Cada template abre como uma cópia desvinculada no IndexedDB sem alterar a matriz original (`RF-12`, `CA-11`).

---

## 📽️ Modo Apresentação 16:9

Pressione **P** ou clique no botão **Apresentar** para entrar no modo limpo para reuniões:
- **Interface 16:9:** Oculta painéis laterais de edição e barras de ferramentas.
- **Roteiro de Cenas:** Navegue por etapas com as setas do teclado (`←` e `→`).
- **Spotlight:** Reduz a opacidade de elementos fora de foco para guiar a atenção do cliente.
- **Animação Conceitual:** Anima arestas ativas com aviso obrigatório: *"Fluxo ilustrativo — não representa tráfego real"*.
- **Notas do Apresentador:** Janela recolhível de notas privadas para orientar a fala sem expor dados internos no compartilhamento de tela.

---

## 📋 Matriz de Verificação dos Requisitos do PRD 2

| Requisito | Descrição | Status | Evidência de Implementação |
|---|---|:---:|---|
| **RF2-01** | Modo Playground anônimo e efêmero (*stateless*) | ✅ Concluído | Rota `/playground`, isolamento de storage no `editor-store.ts`, botão no dashboard, `playground.test.ts` |
| **RF2-02** | Redesign minimalista, compacto e profissional | ✅ Concluído | Dashboard compacto, proporções e alinhamento do editor, espaçamentos em escala 4/8/12/16px |
| **RF2-03** | Expansão para 150+ serviços e ícones específicos | ✅ Concluído | 153 serviços reais em `service-catalog.json`, `ServiceIcon.tsx` com SVGs específicos, `catalog.test.ts` |
| **RF2-04** | Integração da logo e favicon existentes em `/assets` | ✅ Concluído | `BrandLogo.tsx`, `layout.tsx`, `public/logo.png`, `public/favicon.png` |
| **RF2-05** | Remoção de "Notas do Apresentador" dos nós/elementos | ✅ Concluído | `Inspector.tsx` e `editor-store.ts` atualizados, notas exclusivas do roteiro de cenas |

---

## 🎨 PRD 3 — Home Page de Alta Fidelidade Visual

O **PRD 3** implementa o redesign integral do Dashboard/Home em uma estrutura fluida de até **1600px de largura**, reproduzindo a composição visual profissional solicitada em cinco faixas complementares:

1. **Navbar Global:** Logomarca oficial à esquerda (`BrandLogo size="lg"`), abas de navegação ativas (`Início`, `Projetos`, `Templates`) e botão primário `Novo Projeto`.
2. **Hero & Indicadores:** Eyebrow `BEM-VINDO(A) AO`, H1 `MultiCloud Solution Studio`, subtítulo curto e 3 tiles de métricas reativas derivadas dos dados reais (`Projetos`, `Templates`, `Componentes`).
3. **Trio de Ações Rápidas:** Cards horizontais de `Modo Playground` (destaque lavanda/índigo), `Novo Projeto` e `Explorar Templates`.
4. **Seus Projetos:** Título, filtros com contadores reais por provedor (`Todos`, `GCP`, `AWS`, `Azure` etc.), busca em tempo real com escape, alternância Grade/Lista (`LayoutGrid`/`List`), cards com chips de serviços reais (`ServiceIcon`), alternância funcional de favoritos e menu contextual (`Abrir`, `Renomear`, `Duplicar`, `Excluir`).
5. **Zona Inferior Contextual:** Mini-cards de templates arquiteturais de referência com ação direta de uso (`Usar template`) sem duplicar projetos.

### Matriz de Aceite do PRD 3 (CA3-01 a CA3-22)

| ID | Critério | Status | Evidência de Implementação |
|---|---|:---:|---|
| **CA3-01** | Composição em cinco faixas da referência | ✅ OK | Navbar, Hero, Quick Actions, Projetos, Zona Inferior em `src/app/page.tsx` |
| **CA3-02** | Layout fluido em 1672×941 sem coluna estreita central | ✅ OK | Container `max-w-[1600px]`, grid de 4 colunas em telas largas |
| **CA3-03** | Navbar com logo oficial e abas reais sem botões fictícios | ✅ OK | `BrandLogo`, abas Início, Projetos, Templates |
| **CA3-04** | Hero com textos e três indicadores reais | ✅ OK | Tiles Projetos (`length`), Templates (`5`), Componentes (`sum(nodes)`) |
| **CA3-05** | Quick actions acionam fluxos reais na primeira dobra | ✅ OK | Cards Playground (`/playground`), Novo Projeto (`/editor`), Templates (`/templates`) |
| **CA3-06** | Playground não persiste nem afeta contadores | ✅ OK | `playground.test.ts`, isolamento de autosave |
| **CA3-07** | Busca em tempo real e combinação com filtro de provedor | ✅ OK | Filtro composto memoizado em `src/app/page.tsx` |
| **CA3-08** | Chips de provedores com contagens reais | ✅ OK | `providerCounts` derivado dinamicamente dos projetos |
| **CA3-09** | Alternância Grid/Lista funcional | ✅ OK | Toggle `viewMode` com suporte completo a dados e ações |
| **CA3-10** | Card com providers, chips de serviços reais e conexões | ✅ OK | `ServiceIcon`, `p.services`, `formatRelativeDate`, `p.edgeCount` |
| **CA3-11** | Cards abríveis por inteiro com menu contextual separado | ✅ OK | `router.push(/editor?project=...)`, menu `...` isolado |
| **CA3-12** | Favoritar funcional com persistência no IndexedDB | ✅ OK | `projectRepository.toggleFavorite`, campo `isFavorite` |
| **CA3-13** | Templates reais funcionais na zona inferior | ✅ OK | `ARCHITECTURE_TEMPLATES`, criação de cópia independente |
| **CA3-14** | Recentes / Templates adaptativo sem duplicidade | ✅ OK | Zona inferior adaptada sem duplicar projetos |
| **CA3-15** | Layout estável de 0 a 30 projetos | ✅ OK | Grid responsivo com auto-wrap e alinhamento consistente |
| **CA3-16** | Sem overflow horizontal em 1366×768, 768×1024 e 390×844 | ✅ OK | Screenshots e responsividade validados via `agent-browser` |
| **CA3-17** | Logos, favicons e ícones locais carregando no build | ✅ OK | `public/logo.png`, `public/favicon.png`, `ServiceIcon.tsx` |
| **CA3-18** | Compatibilidade de projetos, editor, cenas e exportações | ✅ OK | 31 testes unitários passando em 11 suítes |
| **CA3-19** | Evidências e screenshots em navegador real | ✅ OK | Screenshots capturados em `docs/references/` |
| **CA3-20** | Verificação de types, tests e build via pnpm | ✅ OK | `pnpm typecheck`, `pnpm test`, `pnpm build` com 100% de sucesso |
| **CA3-21** | Sem avatares, notificações ou links fictícios | ✅ OK | Apenas controles reais e funcionais |
| **CA3-22** | Dashboard 100% local-first | ✅ OK | Armazenamento exclusivamente local no navegador |

---

## ⚡ PRD 4 — Redesign de Alta Fidelidade do Editor de Diagramas

O **PRD 4** consolida o estúdio de arquitetura com o nível visual e funcional de uma ferramenta de engenharia premium:

1. **Header do Editor (64px):** Marca oficial ampliada, contexto claro de Playground (`Playground · Temporário`) ou Nome do projeto, status de salvamento real (apenas para projetos persistentes), atalhos de Undo/Redo, Cenas, Exportar e Apresentar (P).
2. **Catálogo Multicloud por Categorias Expansíveis (~355px):** Navegação por accordion de capacidades técnicas (Computação, Contêineres, Armazenamento, Bancos de Dados, Redes, Segurança, Analytics, IA, Integração, Observabilidade, Dev Tools), busca em tempo real com atalho `Ctrl+K`, chips dos 7 provedores e `ServiceIcon` específico em SVG local para cada serviço.
3. **Canvas e Zonas Visuais de Arquitetura:**
   - Zonas de Provedor e Região com cabeçalho semântico, bordas tracejadas e cores suaves (GCP, AWS, Azure, OCI, Cloudflare, Supabase, Hostinger).
   - Movimentação de zonas desloca nós filhos mantendo conexões e posições relativas intactas.
   - Arestas direcionadas com setas nítidas (`sourceToTarget`, `bidirectional`, etc.) e rótulos compactos em cápsula branca.
4. **Inspector Contextual Tipado (~355px):**
   - Formulários específicos e densos para Nós de Serviço, Conexões, Zonas de Provedor/Região e Formas.
   - Zero campos de "Notas do apresentador" nos elementos (preservadas exclusivamente nas cenas de apresentação).
   - Estado sem seleção compacto no topo do painel, sem vazios centrais desproporcionais.
5. **Toolbar Flutuante Centrada:**
   - Posicionamento perfeitamente centrado no canvas com separadores verticais entre famílias (Seleção, Navegação, Caneta, Borracha, Formas, Banco de Dados, Zonas e Viewport).

### Matriz de Aceite do PRD 4 (CA4-01 a CA4-32)

| ID | Critério | Status | Evidência de Implementação |
|---|---|:---:|---|
| **CA4-01** | Composição visual em 1672×941 (Header, Catálogo, Canvas, Inspector, Toolbar) | ✅ OK | `EditorShell.tsx`, `Topbar.tsx`, `CatalogSidebar.tsx`, `Inspector.tsx` |
| **CA4-02** | Auditoria e comparação visual com screenshots em navegador | ✅ OK | Screenshots em `docs/references/prd4-*.png` |
| **CA4-03** | Header exibe marca em tamanho legível e contexto real | ✅ OK | `BrandLogo size="lg"`, badge Playground ou nome do projeto |
| **CA4-04** | Status de salvamento real (nunca salvo em Playground) | ✅ OK | `editor-store.ts`, `playground.test.ts` |
| **CA4-05** | Undo/redo/cenas/exportar/apresentar funcionais com dados reais | ✅ OK | Contagens reais e integrações ativas |
| **CA4-06** | Catálogo por categorias expansíveis e 7 provedores | ✅ OK | Accordion com 11 categorias e filtros combináveis |
| **CA4-07** | Total de serviços exibido é o real do registry (153) | ✅ OK | Contagem dinâmica calculada sem hardcode |
| **CA4-08** | Ícones oficiais específicos em SVG por serviço | ✅ OK | `ServiceIcon.tsx`, mapeamento de 153 serviços |
| **CA4-09** | Sem ícones quebrados, resolução local sem CORS | ✅ OK | SVGs embutidos limpos |
| **CA4-10** | Catálogo com scroll independente sem duplo scrollbar | ✅ OK | Scroll interno na lista com header fixo |
| **CA4-11** | Adicionar serviço por drag/drop e clique nas coordenadas do canvas | ✅ OK | `screenToFlowPosition`, `addServiceNode` |
| **CA4-12** | Canvas com grade discreta, pan/zoom e preservação de posições | ✅ OK | Viewport React Flow e `Background` |
| **CA4-13** | Nós de serviço premium com hierarquia, ícone e handles 4 lados | ✅ OK | `ServiceNode.tsx` com handles z-30 e IDs únicos |
| **CA4-14** | Arestas com direção nítida e rótulos compactos | ✅ OK | `LabeledConnectionEdge.tsx` com markers SVG |
| **CA4-15** | Seleção de edge abre inspector de conexão com tipo/direção | ✅ OK | Inspector tipado para edges |
| **CA4-16** | Zonas com cabeçalho, região, cores suaves e conteúdo movível | ✅ OK | `GroupNode.tsx`, suporte a nesting e drag |
| **CA4-17** | Zonas opcionais sem forçar conversão de projetos antigos | ✅ OK | Compatibilidade retroativa garantida |
| **CA4-18** | Inspector do nó com parâmetros, doc oficial e sem notas de apresentador | ✅ OK | `Inspector.tsx`, ausência de speaker notes |
| **CA4-19** | Sem grande coluna vazia na ausência de seleção | ✅ OK | Resumo compacto no topo |
| **CA4-20** | Inspector alterna entre nó, edge, zona, forma e vazio | ✅ OK | Alternância tipada reativa |
| **CA4-21** | Toolbar flutuante centrada no canvas sem botões decorativos | ✅ OK | `Toolbar.tsx` centrada com separadores |
| **CA4-22** | Caneta, borracha e shapes sincronizados com zoom/pan e undo/redo | ✅ OK | `DrawingOverlay.tsx`, histórico de 20+ ops |
| **CA4-23** | Apresentação e cenas continuam ocultando ferramentas | ✅ OK | `PresentationView.tsx`, atalho P |
| **CA4-24** | Playground mantém estado efêmero sem registro no dashboard | ✅ OK | `/playground`, isolamento de persistência |
| **CA4-25** | Projetos antigos e exportações preservados | ✅ OK | Testes de roundtrip e compatibilidade |
| **CA4-26** | Layout sem overflow em resoluções desktop | ✅ OK | Validado em 1869×1011, 1672×941, 1440×900 e 1366×768 |
| **CA4-27** | Tipografia legível para apresentações Meet | ✅ OK | Rótulos 11-14px com contraste WCAG AA |
| **CA4-28** | Benchmark com 80 nós e 120 conexões validado | ✅ OK | `benchmark-scene.test.ts` passando |
| **CA4-29** | Duas rodadas completas de QA visual documentadas | ✅ OK | Capturas salvas em `docs/references/` |
| **CA4-30** | Testes e builds executados estritamente com pnpm | ✅ OK | `pnpm typecheck`, `pnpm test`, `pnpm build` |
| **CA4-31** | Sem dados inventados ou falsos | ✅ OK | Contagens e serviços reais |
| **CA4-32** | Home (/), Projetos (/projects) e Templates (/templates) sem regressão | ✅ OK | Todas as rotas estáticas ativas |

---

## 🔒 Licença e Isenção de Responsabilidade

Os nomes, marcas e logotipos de provedores de nuvem (Google Cloud, AWS, Microsoft Azure, OCI, Cloudflare, Hostinger, Supabase) pertencem aos seus respectivos proprietários e são utilizados para fins estritamente ilustrativos de arquitetura e compatibilidade técnica.
