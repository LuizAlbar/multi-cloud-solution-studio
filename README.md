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

## 🔒 Licença e Isenção de Responsabilidade

Os nomes, marcas e logotipos de provedores de nuvem (Google Cloud, AWS, Microsoft Azure, OCI, Cloudflare, Hostinger, Supabase) pertencem aos seus respectivos proprietários e são utilizados para fins estritamente ilustrativos de arquitetura e compatibilidade técnica.
