# MultiCloud Solution Studio

> Estúdio visual desktop-first e local-first para Solutions Engineers e Arquitetos de Soluções desenharem, adaptarem, explicarem e apresentarem arquiteturas tecnológicas multicloud ao vivo durante reuniões (ex: Google Meet).

---

## 🚀 Visão Geral

O **MultiCloud Solution Studio** foi projetado para substituir o atrito de diagramas estáticos por uma experiência fluida, profissional e confiavelmente persistida no navegador. Ele cobre **7 provedores de nuvem** (Google Cloud, AWS, Microsoft Azure, Oracle Cloud Infrastructure, Cloudflare, Hostinger e Supabase) além de elementos on-premises, genéricos e anotações livres.

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

## ☁️ Catálogo Multicloud (44 Serviços Iniciais)

O catálogo declarativo (`src/data/service-catalog.json`) inclui metadados completos, categorias da taxonomia oficial e links para documentações oficiais verificadas:

| Provedor | Qtd | Serviços Principais |
|---|:---:|---|
| **Google Cloud (GCP)** | 8 | Cloud Run, Compute Engine, GKE, Cloud Storage, Cloud SQL, BigQuery, Vertex AI, Cloud Load Balancing |
| **Amazon Web Services (AWS)** | 9 | EC2, Lambda, ECS, Fargate, S3, RDS, Athena, Bedrock, API Gateway |
| **Microsoft Azure** | 7 | Virtual Machines, Functions, App Service, AKS, Blob Storage, Azure SQL Database, Azure Front Door |
| **Oracle Cloud (OCI)** | 6 | OCI Compute, VCN, OKE, Object Storage, Autonomous Database, Load Balancer |
| **Cloudflare** | 6 | Workers, R2, CDN, WAF, DNS, D1 |
| **Hostinger** | 3 | VPS, Web Hosting, Cloud Hosting |
| **Supabase** | 5 | Postgres, Auth, Storage, Edge Functions, Realtime |
| **Total Inicial** | **44** | **100% categorizados e validados com links oficiais** |

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

## 📋 Matriz de Verificação dos Critérios de Aceite (CA-01 a CA-18)

| Critério | Descrição do PRD | Status | Evidência de Implementação |
|---|---|:---:|---|
| **CA-01** | Dashboard com listagem, busca e exclusão com confirmação | ✅ Concluído | `src/app/page.tsx`, modal de confirmação, busca reativa |
| **CA-02** | Catálogo dos 7 provedores com 44 serviços e metadados | ✅ Concluído | `src/data/service-catalog.json`, `src/features/catalog/catalog.test.ts` (44 itens validados) |
| **CA-03** | Adicionar nó, editar label e exibir badge do provedor | ✅ Concluído | `ServiceNode.tsx`, `Inspector.tsx`, `editor-store.test.ts` |
| **CA-04** | Formas genéricas, post-it, texto e caneta sincronizada com zoom/pan | ✅ Concluído | `GenericShapeNode.tsx`, `StickyNoteNode.tsx`, `TextNode.tsx`, `DrawingOverlay.tsx` |
| **CA-05** | Mover agrupamento desloca nós internos preservando posições | ✅ Concluído | `GroupNode.tsx`, suporte a nós filhos no `@xyflow/react` |
| **CA-06** | Histórico de ao menos 20 operações sem arestas órfãs | ✅ Concluído | `src/lib/history/history.test.ts` (teste de 22 operações consecutivas) |
| **CA-07** | Persistência local no IndexedDB com autosave de 1s e reload íntegro | ✅ Concluído | `ProjectRepository.ts`, `storage.test.ts`, `editor-store.test.ts` |
| **CA-08** | Exportar e importar `.mcss.json` preservando metadados | ✅ Concluído | `export-project.ts`, `import-project.ts`, `import-export.test.ts` |
| **CA-09** | Rejeição graciosa de `.mcss.json` malformado sem corromper estado | ✅ Concluído | `import-project.ts` com validação Zod e teste de erro |
| **CA-10** | Exportar imagem PNG em alta resolução com legibilidade de texto | ✅ Concluído | `export-png.ts`, canvas 2x com grid e bounding box de nós |
| **CA-11** | 5 templates disponíveis que abrem como cópias editáveis | ✅ Concluído | `src/data/templates/index.ts`, `templates.test.ts` |
| **CA-12** | Criar cena com enquadramento e spotlight suave | ✅ Concluído | `SceneDrawer.tsx`, `PresentationView.tsx` |
| **CA-13** | Animação em arestas com aviso de fluxo ilustrativo | ✅ Concluído | `PresentationView.tsx`, rodapé/banner obrigatório |
| **CA-14** | Modo apresentação 16:9 limpo sem controles de edição | ✅ Concluído | `PresentationView.tsx`, atalho `P` e Fullscreen API |
| **CA-15** | Links de documentação oficial abrem nova aba com alvo seguro | ✅ Concluído | `Inspector.tsx` com `rel="noopener noreferrer"` |
| **CA-16** | Cenário de estresse com 80 nós e 120 conexões fluido | ✅ Concluído | `src/test/benchmark-scene.test.ts` (gerador e teste de carga) |
| **CA-17** | Foco visível, navegação por teclado e `prefers-reduced-motion` | ✅ Concluído | `globals.css`, `button.tsx`, `canvas.tsx` |
| **CA-18** | Alerta visual explícito em falha de storage com download de emergência | ✅ Concluído | `topbar.tsx`, `ProjectRepository.ts` |

---

## 🔒 Licença e Isenção de Responsabilidade

Os nomes, marcas e logotipos de provedores de nuvem (Google Cloud, AWS, Microsoft Azure, OCI, Cloudflare, Hostinger, Supabase) pertencem aos seus respectivos proprietários e são utilizados para fins estritamente ilustrativos de arquitetura e compatibilidade técnica.
