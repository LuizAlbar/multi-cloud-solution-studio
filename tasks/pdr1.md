# MultiCloud Solution Studio — Especificação funcional e visual do MVP

**Versão:** 1.0 (proposta para aprovação)  
**Data:** 14 de novembro de 2026  
**Status:** Especificação; implementação ainda não iniciada  
**Prioridade de uso:** Pré-vendas técnicas e demonstrações ao vivo  
**Identidade visual:** Minimalista, clara e corporativa  
**Inteligência artificial:** Fora do MVP; prevista para uma fase posterior  
**Formato de execução:** Aplicação Next.js local-first, desktop-first, sem autenticação nem backend obrigatório

---

## 1. Visão do produto

Um estúdio visual multicloud para **construir, explicar e apresentar arquiteturas tecnológicas em tempo real** durante conversas com clientes. Combina a liberdade de um whiteboard com objetos estruturados para serviços de Google Cloud, AWS, Azure, Oracle Cloud Infrastructure, Cloudflare, Hostinger e Supabase.

### 1.1 Proposta de valor

O Solution Engineer deverá conseguir:

1. Abrir um cenário pronto ou iniciar uma arquitetura vazia em segundos.
2. Encontrar serviços por nome, provedor ou capacidade e soltá-los no canvas.
3. Montar conexões explicativas com direção, protocolo e rótulos.
4. Desenhar sistemas legados, notas e caixas livres, inclusive em cenários que não sejam puramente cloud.
5. Alternar do modo de edição para uma apresentação visual focada, sem sair do projeto.
6. Percorrer cenas e animar fluxos *didáticos* para explicar o comportamento da solução.
7. Salvar o projeto localmente e exportar um diagrama para compartilhar após a reunião.

**Não é:** ferramenta que implementa infraestrutura, valida automaticamente sua segurança, calcula preços oficiais em tempo real ou comprova comportamento de produção.

### 1.2 Usuário principal

Solutions Engineer / engenheiro de pré-vendas de uma consultoria ou parceira tecnológica, que apresenta soluções de infraestrutura, dados e inteligência artificial pelo Google Meet. O fluxo também pode servir a arquitetos e consultores técnicos.

### 1.3 Cenário principal de demonstração

Durante uma reunião, um cliente descreve uma aplicação web com Cloudflare, backend no Cloud Run e dados em Supabase ou BigQuery. O SE abre o Studio, busca os componentes, monta a solução, explica a comunicação entre eles, cria uma cena executiva e outra técnica, destaca o fluxo de requisições e exporta a arquitetura.

---

## 2. Limites do MVP

### 2.1 Incluído (P0, obrigatório)

- Dashboard local de projetos: criar, listar, renomear, duplicar, excluir, abrir e importar.
- Editor em canvas infinito: pan, zoom, fit-to-view, seleção simples/múltipla, arrastar, conectar, excluir, duplicar, copiar/colar, desfazer/refazer.
- Catálogo embutido de serviços de **sete provedores**, com busca por nome, sinônimo, provedor e categoria.
- Nós de serviço com ícone, nome, descrição resumida, provedor, categoria, documentação e parâmetros informativos editáveis.
- Formas e elementos genéricos: retângulo, círculo, caixa delimitadora, texto, post-it, sistema externo, banco genérico e anotação livre a caneta.
- Conectores com rótulo, direção, tipo lógico (HTTP/API, dados, eventos, rede, autenticação, genérico) e estilo visual.
- Agrupamentos visuais por ambiente, provedor, rede, região ou domínio lógico.
- Painel de inspeção contextual do elemento selecionado.
- Cinco templates demonstrativos com aviso de que são arquiteturas ilustrativas.
- Modo apresentação 16:9 com interface reduzida, viewport focado, destaque de elementos, sequenciamento de cenas e notas privadas.
- Animação de fluxo visual em conexões escolhidas, explicitamente identificada como representação conceitual, não telemetria real.
- Persistência automática no navegador via IndexedDB, exportação/importação de arquivo próprio versionado (.mcss.json) e exportação de imagem PNG.
- Ajuda rápida de atalhos, indicadores de salvamento e mensagens de erro recuperáveis.

### 2.2 Diferido para V1.1 (P1)

- Comparação lado a lado de arquiteturas; visões executiva/técnica/financeira automáticas; exportação SVG/PDF nativa; layout automático; catálogo gerenciável pela interface; projetos compartilháveis; customização profunda de estilos e animações.

### 2.3 Fora do MVP e sem compromisso nesta versão (P2)

- Copiloto de IA, geração automática de arquitetura a partir de texto, custo oficial em tempo real, simulação quantitativa de carga/desempenho, importação de recursos reais de cloud, provisionamento Terraform, autenticação/SSO, colaboração em tempo real, armazenamento remoto/Drive e gravação de reuniões.

---

## 3. Telas e navegação

### T01 — Projetos / Dashboard (`/`)

**Objetivo:** iniciar ou continuar um trabalho com o mínimo de cliques.

- Header com logo, nome do produto e ação **Novo projeto**.
- Busca por nome de projeto.
- Grid de cartões com nome, provedores presentes, data da última edição e miniatura local quando possível.
- Ações por projeto: abrir, renomear, duplicar, exportar, excluir com confirmação.
- Ação **Começar de um template** e **Importar projeto**.
- Estado vazio com exemplo e CTA claro.

**Fluxo:** Novo projeto → título opcional → editor vazio. Escolher template → cria cópia editável, nunca altera o modelo original.

### T02 — Galeria de templates (`/templates`)

**Objetivo:** selecionar um cenário rapidamente.

- Filtros por caso de uso, provedores e complexidade.
- Cards com título, miniatura, objetivo, principais serviços e aviso de referência.
- Modal de prévia: desenho, premissas, componentes, quando utilizar e pontos ainda a validar.
- CTA **Usar este template**; cria novo projeto baseado em cópia independente.

**Cinco templates iniciais:**

1. Aplicação web serverless — Cloudflare + Cloud Run + Cloud SQL.
2. Analytics sobre dados AWS — S3 + Glue/Athena + serviço de integração Cloud Run + BigQuery *opcional*, com o uso de cada componente claramente rotulado.
3. IA empresarial com RAG — aplicação + serviços de armazenamento/recuperação + Vertex AI, com restrições e integrações descritas.
4. Aplicação web com backend gerenciado — Cloudflare Workers + Supabase Postgres/Auth/Storage (ilustrativo).
5. Aplicação corporativa em OCI — Load Balancer + Compute + Autonomous Database (ilustrativo).

### T03 — Editor de arquitetura (`/editor`)

**Objetivo:** desenhar e explicar ao vivo.

**Zonas:**

- **Topo (56–64 px):** nome editável do projeto, status de salvamento, desfazer/refazer, alternar para apresentação, exportar.
- **Esquerda (260 px recolhível):** busca de serviços, abas **Serviços / Formas / Templates**, filtros por provedor e capacidade, itens arrastáveis.
- **Centro (flexível):** canvas com grade pontilhada discreta, zoom/pan, conexões, seleção, zonas e anotações.
- **Direita (304–328 px recolhível):** inspector contextual. Quando nada estiver selecionado, exibir informações do projeto e dicas úteis.
- **Barra flutuante inferior:** seleção, mão, conector, retângulo, elipse, texto, nota, caneta, borracha, fit-to-view.
- **Indicadores inferiores:** percentual de zoom, quantidade de nós/conexões e modo em uso.

**Modos de ferramenta mutuamente exclusivos:** Select, Pan, Connect, Shape, Text, Sticky, Pen e Eraser. ESC retorna a Select; alterações de ferramenta não alteram conteúdo existente.

### T04 — Apresentação (`/editor` em estado `presentation`)

**Objetivo:** remover ruído da interface e conduzir uma narrativa durante o compartilhamento no Meet.

- Canvas em 16:9, com layout limpo e texto legível.
- Navegação entre cenas por setas e controles discretos.
- Cena guarda `viewport`, conjunto de IDs em destaque, título curto, mensagem para o cliente e notas privadas.
- Elementos fora de foco recebem opacidade reduzida, sem ocultar relações indispensáveis.
- Modo **Apresentação em tela cheia** usando Fullscreen API quando disponível.
- Alternar animação de fluxo em conexões explicitamente marcadas para cada cena.
- Botão/atalho para voltar ao editor preservando o projeto.
- Notas privadas só aparecem em painel do apresentador não incluído no canvas compartilhado; por padrão, ficam ocultas no modo tela cheia. Não prometer privacidade de notas se a tela toda estiver sendo compartilhada.
- Rodapé discreto: **“Fluxo ilustrativo — não representa tráfego real”** quando houver animação.

**Criação de cenas:** no editor, usuário posiciona viewport, seleciona destaques, clica em **Adicionar cena**, preenche título e descrição. Pode reorganizar e excluir cenas; mínimo de 1 cena possível.

### T05 — Exportar / Importar (modais)

**Exportação:**

- **Projeto editável** `.mcss.json` (preserva nós, arestas, propriedades, anotações, viewport, cenas, metadados e `schemaVersion`).
- **PNG** com opção `conteúdo inteiro` ou `área visível`, fundo branco e escala de exportação selecionável.
- Nome padronizado `projeto-YYYY-MM-DD` editável antes da exportação.

**Importação:** selecionar arquivo `.mcss.json`, validar schema, tamanho e conteúdo, apresentar confirmação; importar como **novo projeto**, sem sobrescrever o aberto. Erros claros em arquivo malformado ou incompatível.

### T06 — Sobre, atalhos e preferências (drawer/modal)

- Atalhos do editor, versão do app, avisos de que dados são locais, aviso de backup e botão de baixar cópia de projeto.
- Preferências simples: snap-to-grid, exibir grade e animações reduzidas.
- Sem tela de conta/login.

---

## 4. Catálogo multicloud

### 4.1 Taxonomia de categorias

**Compute / Containers, Storage, Databases, Networking / Edge, Data / Analytics, AI / ML, Identity / Security, Integration / Messaging, Custom / On-Premises.** Um serviço pode ter uma categoria primária e tags secundárias.

### 4.2 Cobertura inicial proposta (44 itens de referência, sujeito a revisão de nomenclatura)

| Provedor | Serviços iniciais |
|---|---|
| Google Cloud | Cloud Run, Compute Engine, GKE, Cloud Storage, Cloud SQL, BigQuery, Vertex AI, Cloud Load Balancing |
| AWS | EC2, Lambda, ECS, Fargate, S3, RDS, Athena, Bedrock, API Gateway |
| Azure | Virtual Machines, Functions, App Service, AKS, Blob Storage, Azure SQL Database, Azure Front Door |
| Oracle Cloud Infrastructure | Compute, VCN, OKE, Object Storage, Autonomous Database, Load Balancer |
| Cloudflare | Workers, R2, CDN, WAF, DNS, D1 |
| Hostinger | VPS, Web Hosting, Cloud Hosting |
| Supabase | Postgres, Auth, Storage, Edge Functions, Realtime |

Total: **44 entradas** na lista acima (8+9+7+6+6+3+5). O catálogo é inicial e não pretende cobrir todas as capacidades de cada fornecedor. Fargate é um modelo de computação associado a serviços como ECS e não um substituto exato de uma plataforma serverless qualquer. Termos comerciais e serviços disponíveis devem ser conferidos com a documentação atual antes do empacotamento final.

### 4.3 Modelo de entrada do catálogo

- `serviceId` estável; `providerId`; `displayName`; `aliases[]` (busca); `category`; `tags[]`.
- `iconKey` e `assetLicense`; `shortDescription`; `officialDocsUrl`; `lastReviewedAt`.
- `propertiesSchema` para campos informativos — exemplos: região, ambiente, runtime, banco, capacidade esperada, observações.
- `connectionHints` opcionais: tipos de comunicação frequentes, *não* garantias de compatibilidade.
- `limitationsNotes` opcionais e advertências de dependências.

**Princípios:** dados do catálogo são declarativos e versionados; novos serviços não exigem alterações no motor do canvas; as URLs oficiais só são abertas sob ação do usuário. Ícones oficiais são empacotados apenas após verificação dos termos aplicáveis.

---

## 5. Comportamentos e interações

| ID | Requisito funcional (P0) | Regra esperada |
|---|---|---|
| RF-01 | Criar/abrir/renomear/excluir projeto | Exclusão exige confirmação; alterações salvas localmente |
| RF-02 | Busca global de componentes | Busca por nome, apelido, provedor e categoria; estado vazio claro |
| RF-03 | Adicionar componente | Drag/drop ou clique adiciona no centro do viewport visível |
| RF-04 | Selecionar e mover | Seleção simples/múltipla, alinhamento aproximado à grade opcional |
| RF-05 | Conectar componentes | Usuário escolhe origens/destinos; aresta guarda tipo, direção e texto |
| RF-06 | Editar componente | Inspector muda título, notas e propriedades do objeto selecionado |
| RF-07 | Elementos genéricos | Formas, texto, notas e sistema customizado se comportam como objetos editáveis |
| RF-08 | Desenho livre | Traço de caneta armazenado em coordenadas do canvas e acompanha zoom/pan |
| RF-09 | Grupos e zonas | Mover grupo preserva posição relativa dos seus filhos |
| RF-10 | Edição segura | Undo/redo mínimo de 20 ações; atalhos não são acionados enquanto usuário digita |
| RF-11 | Autosave | Debounce após edição, indicador `Salvando / Salvo / Erro`; reabrir mantém estado |
| RF-12 | Templates | Abrir cria cópia independente; modelos base não são alterados |
| RF-13 | Criar cenas | Salva zoom, posição, destaques e conteúdo explicativo |
| RF-14 | Apresentação | Oculta edição, navega cenas e retorna ao editor preservando alterações |
| RF-15 | Animação conceitual | Anima apenas arestas selecionadas; nenhum dado de produção é inferido |
| RF-16 | Exportar/importar projeto | JSON versionado, validação de conteúdo e importação sem sobrescrever |
| RF-17 | Exportar PNG | Renderiza fundo, ícones, textos, caixas, anotações e arestas |
| RF-18 | Documentação oficial | Serviço exibe link oficial verificado e data de revisão do catálogo |
| RF-19 | Acessibilidade | Contraste, foco visível, navegação por teclado nos painéis e opção reduzir movimento |

### 5.1 Atalhos padrão

- `Ctrl/Cmd + K`: buscar serviços (palette).
- `Ctrl/Cmd + Z` / `Ctrl/Cmd + Shift + Z`: desfazer/refazer.
- `Ctrl/Cmd + C` / `Ctrl/Cmd + V`: copiar/colar seleção.
- `Delete/Backspace`: excluir seleção (fora de editores de texto).
- `Esc`: sair de ferramenta/fechar menu; segunda vez retorna a Select.
- `Space + arrastar`: pan temporário, quando não estiver editando texto.
- `F`: fit-to-view, quando o foco não estiver em campo de texto.
- `P`: apresentação, quando não houver foco em campo de texto.
- `Setas`: avançar/voltar cena no modo apresentação.

### 5.2 Comportamento do inspector

**Serviço cloud:** título editável, provedor (somente leitura), categoria, documentação, propriedades definidas pelo schema, notas técnicas, notas de apresentação e botão duplicar.

**Conexão:** origem/destino, tipo, direção, nome/legenda, animação e estilo (normal/pontilhado).

**Grupo/zona:** título, tipo de limite, borda, preenchimento suave, posição e dimensões.

**Anotação:** texto, cor neutra/acento, tamanho, largura/altura quando aplicável.

---

## 6. Design system e regras visuais

### 6.1 Direção

**Light minimal / corporate / calm**: superfícies brancas, respiro, hierarquia clara, poucos elementos na tela, bordas leves e sombras discretas. A cor forte aparece apenas em seleção, ação primária e indicadores específicos; identidades dos provedores ficam principalmente nos ícones.

| Token | Valor inicial proposto |
|---|---|
| Fundo do app | `#F8FAFC` |
| Canvas | `#FFFFFF` |
| Superfície de painel | `#FFFFFF` |
| Texto principal | `#111827` |
| Texto secundário | `#64748B` |
| Bordas | `#E5E7EB` |
| Ação primária / seleção | `#2563EB` |
| Destaque suave | `#EFF6FF` |
| Grade do canvas | `#E9EDF3` |
| Raio de cards | `10–12px` |
| Raio de botões | `8px` |
| Ritmo de espaçamento | múltiplos de 4px; preferir 8px |
| Fonte | system-ui/Inter se licenciada e empacotada; corpo 14px; labels do canvas legíveis em 1080p |

### 6.2 Nós

**Modo compacto:** ícone 28px, nome em 13–14px, badge discreto com provedor somente quando necessário. Largura típica 150–190px, altura 84–104px. Evitar cards gigantes ou cor saturada.

**Selecionado:** contorno azul 2px; handles aparecem no hover/seleção; foco por teclado não depende somente de cor. **Containers:** borda suave e pequeno título superior.

**Arestas:** curvatura consistente, direção indicada por seta, rótulo central opcional. Animação discreta com preferência por movimento reduzido.

### 6.3 Responsividade e apresentação

- Foco em desktop 1366×768 ou superior; tela ideal 1920×1080.
- Painéis laterais recolhíveis; no modo apresentação, nenhum painel de edição fica visível.
- Projetar para leitura durante compartilhamento de Google Meet: títulos legíveis, não depender de tooltips e evitar blocos densos.
- Sem suporte de edição mobile no MVP; exibir mensagem informativa em telas estreitas.

---

## 7. Modelo de dados persistente

### 7.1 Entidades

- **Project:** `id`, `title`, `createdAt`, `updatedAt`, `schemaVersion`, `catalogVersion`, `viewport`, `nodes`, `edges`, `drawings`, `scenes`, `settings`.
- **Node:** `id`, `kind` (`service|generic|group|shape|note|text`), `serviceId?`, `label`, `position`, `size?`, `parentId?`, `properties`, `notes`, `style?`.
- **Edge:** `id`, `sourceId`, `targetId`, `sourceHandle?`, `targetHandle?`, `direction`, `flowType`, `label?`, `animated?`, `style?`.
- **Drawing:** `id`, `points[]` em coordenadas mundiais, `strokeWidth`, `color`, `layer`.
- **Scene:** `id`, `order`, `title`, `description?`, `speakerNotes?`, `viewport`, `highlightNodeIds[]`, `highlightEdgeIds[]`, `animatedEdgeIds[]`.
- **CatalogService:** modelo declarativo da seção 4.3; catalogado em recurso estático versionado, não embutido integralmente nos projetos.

### 7.2 Padrões de persistência

- Projetos e thumbnails: IndexedDB via Dexie.
- Estado interativo temporário: Zustand; gravar em IndexedDB por serviço de persistência com debounce.
- Preferências pequenas: localStorage ou IndexedDB.
- Exportação/importação `.mcss.json` com campo obrigatório `schemaVersion`, validação Zod, limite configurável de tamanho e migrações versionadas.
- Imports não podem executar código arbitrário nem baixar recursos externos sem aprovação.
- Alterações do catálogo não devem apagar serviços de projetos antigos: preservar nome/ícone de fallback para `serviceId` desconhecido.
- Falha do storage deve ser visível e oferecer backup por arquivo quando possível.
- Armazenamento do navegador **não equivale a backup**; informar claramente que limpeza do perfil/browser pode eliminar projetos locais.

---

## 8. Arquitetura técnica

### 8.1 Stack sugerida

| Camada | Tecnologia | Motivo |
|---|---|---|
| App | Next.js (App Router) + TypeScript | Organização de rotas e componentes, possibilidade de export estático |
| Canvas | `@xyflow/react` (React Flow) | Nós customizados, handles, edges, zoom, pan, grupos e seleção |
| UI | Tailwind CSS + shadcn/ui + Lucide | Composição rápida e design system claro |
| Estado em memória | Zustand | Editor, seleção, ferramentas e histórico |
| Persistência local | IndexedDB + Dexie | Vários projetos e dados estruturados sem backend |
| Validação | Zod | Importação, catálogo e schemas internos versionados |
| Exportação PNG | `html-to-image` ou abordagem equivalente validada | Captura do canvas; testar versões/compatibilidade e imagens locais |
| Testes unitários | Vitest | Catálogo, schemas, reducers, histórico |
| Testes E2E | Playwright | Fluxos principais em navegador real |

A versão exata de cada dependência deverá ser fixada em lockfile após validação de compatibilidade; evitar pressupor que a versão mais recente de `html-to-image` esteja funcional com React Flow.

**Estratégia de execução:** no desenvolvimento, `pnpm dev` local; para distribuição do MVP, considerar export estático (`output: 'export'`) servido por servidor local ou hospedagem estática. Não usar recursos exclusivos de servidor no core do editor. O modo sem rede deve funcionar **após os assets terem sido disponibilizados localmente**; isso não promete cache/offline automático em qualquer URL.

### 8.2 Separação de módulos

```text
src/
  app/
    page.tsx                 # Dashboard
    templates/page.tsx
    editor/page.tsx          # Projeto identificado por query/local state
  components/
    app-shell/
    editor/
      canvas/
      nodes/
      edges/
      toolbar/
      inspector/
      catalog/
    presentation/
    projects/
    templates/
    ui/
  features/
    projects/
    canvas/
    catalog/
    annotations/
    presentation/
    import-export/
  lib/
    storage/
    schemas/
    geometry/
    history/
    assets/
  data/
    providers/
    service-catalog.json
    templates/
  tests/
    unit/
    e2e/
```

### 8.3 Decisões de desenho

- React Flow é a fonte gráfica para serviços, conexões e grupos. A camada de caneta livre deve compartilhar as mesmas coordenadas e transformações de viewport, de modo que zoom/pan não desalinhem o traço.
- Nós do canvas fazem referência a IDs do catálogo; dados estáticos do serviço ficam num registro separado.
- Store distingue estado persistido de estado efêmero (hover, ferramenta ativa, menus) para reduzir gravações.
- Histórico do editor deve registrar comandos/patches ou snapshots limitados, evitando salvar eventos de mouse a cada frame.
- A camada de apresentação lê o mesmo projeto e suas cenas; não cria outro documento concorrente.
- Animação é uma propriedade visual de edges, sem chamadas a provedores cloud.

### 8.4 Fontes técnicas verificadas

- React Flow — nós personalizados e handles: https://reactflow.dev/learn/customization/custom-nodes e https://reactflow.dev/learn/customization/handles
- React Flow — salvar/restaurar: https://reactflow.dev/examples/interaction/save-and-restore
- React Flow — exportar imagem: https://reactflow.dev/examples/misc/download-image
- Next.js — App Router e export estático: https://nextjs.org/docs/app e https://nextjs.org/docs/app/guides/static-exports
- Dexie — IndexedDB: https://dexie.org/docs/index
- Ícones oficiais: https://cloud.google.com/icons ; https://aws.amazon.com/architecture/icons/ ; https://learn.microsoft.com/en-us/azure/architecture/icons/ ; https://docs.oracle.com/en-us/iaas/Content/General/Reference/graphicsfordiagrams.htm

---

## 9. Critérios de aceite (Definition of Done do MVP)

### CA-01 — Novo projeto

**Dado** um navegador sem projetos, **quando** clicar em Novo projeto, **então** devo ser levado a um canvas vazio, com nome editável, catálogo e ferramenta de seleção ativa.

### CA-02 — Sete provedores

**Dado** o catálogo carregado, **quando** pesquisar cada um dos sete provedores, **então** devo encontrar ao menos uma entrada válida daquele provedor e conseguir inseri-la no canvas. A lista definida na seção 4.2 deve estar disponível no release.

### CA-03 — Montagem de arquitetura

**Dado** um projeto vazio, **quando** adicionar Cloudflare, Cloud Run e Supabase, **então** devo poder posicionar os três componentes, conectá-los, rotular as conexões e editar nomes/propriedades sem travamentos.

### CA-04 — Whiteboard

**Dado** um canvas, **quando** inserir retângulo, texto e traço livre, **então** tudo deve manter posição correta durante zoom/pan e permanecer editável/removível conforme seu tipo.

### CA-05 — Agrupamento

**Dado** dois componentes em uma zona, **quando** mover o grupo, **então** seus componentes acompanham o deslocamento sem desordenar conexões.

### CA-06 — Histórico

**Dado** ao menos 20 operações de edição, **quando** desfazer e refazer, **então** o estado deve retornar corretamente, sem duplicações ou conexões órfãs.

### CA-07 — Autosave e restauração

**Dado** um projeto com nós, conexões, textos e uma cena, **quando** recarregar a página ou reabrir o projeto, **então** todas as alterações salvas devem persistir, incluindo viewport e cena.

### CA-08 — Import/export editável

**Dado** um projeto exportado, **quando** importá-lo como novo projeto no mesmo app, **então** nós, posições, conexões, propriedades, anotações e cenas devem ser equivalentes; projeto original não pode ser substituído.

### CA-09 — Import inválido

**Dado** um arquivo JSON incorreto, **quando** tentar importá-lo, **então** o app deve recusar o arquivo, explicar o motivo e manter dados existentes intactos.

### CA-10 — Exportação PNG

**Dado** uma arquitetura com ícones, formas, textos e arestas, **quando** exportar o conteúdo inteiro para PNG, **então** o arquivo deve incluir todos os elementos sem recortes inesperados ou ícones ausentes, em fundo claro.

### CA-11 — Templates

**Dado** um template oficial do app, **quando** escolhê-lo, **então** deve ser criada uma cópia editável e o template original deve permanecer inalterado.

### CA-12 — Cenas

**Dado** um projeto com ao menos três cenas, **quando** entrar em apresentação e navegar por elas, **então** o viewport, destaques e textos da cena devem mudar corretamente, sem alterar o desenho original.

### CA-13 — Fluxo animado

**Dado** arestas selecionadas para a cena, **quando** ativar a animação, **então** somente essas arestas devem apresentar movimento e uma mensagem visível deve esclarecer que o fluxo é conceitual.

### CA-14 — Compartilhamento no Google Meet

**Dado** tela 1920×1080, **quando** entrar em apresentação, **então** a arquitetura deve ocupar a maior área possível, sem painéis de edição, com textos importantes legíveis sem depender de hover.

### CA-15 — Segurança local

**Dado** o editor funcionando em modo local, **quando** criar e editar projetos, **então** o app não deve enviar o conteúdo para endpoints externos. Links de documentação abrem apenas mediante interação explícita.

### CA-16 — Desempenho de referência

**Dado** um laptop de desenvolvimento e Chrome moderno, **quando** manipular um cenário de teste com até 80 nós e 120 arestas, **então** zoom, pan, seleção e apresentação devem continuar responsivos, sem congelamentos perceptíveis recorrentes; quaisquer gargalos identificados devem ser medidos e documentados. Meta de qualidade a ser aferida, não benchmark previamente comprovado.

### CA-17 — Acessibilidade básica

**Dado** uso apenas com teclado nos controles principais, **quando** navegar por painel, pesquisa, inspector e modo apresentação, **então** controles devem ter foco visível e descrições acessíveis. A opção reduzir movimento deve desativar animações não essenciais.

### CA-18 — Falha de gravação

**Dado** falha de quota/armazenamento, **quando** tentar salvar, **então** o estado do app deve avisar claramente, sem falsamente exibir `Salvo`, e oferecer exportação manual quando tecnicamente possível.

---

## 10. Roadmap de entrega recomendado

**Etapa 1 — Base visual e catálogo:** App Shell, design tokens, roteamento, catálogo e nós inteligentes. Evidência: arquitetura simples desenhada.

**Etapa 2 — Editor confiável:** Conexões, shapes, anotações, grupos, atalhos, histórico, persistência. Evidência: desenho completo recuperável após reinício.

**Etapa 3 — Experiência de apresentação:** Templates, cenas, destaques, fullscreen e fluxo animado. Evidência: apresentação demonstrativa completa sem sair do Studio.

**Etapa 4 — Qualidade de entrega:** Exportação/importação, PNG, erros, testes, performance e revisão de ícones/licenças. Evidência: CA-01 a CA-18 aprovados.

**Prioridade para conter escopo:** a qualidade do editor, a clareza visual e a confiabilidade da apresentação vencem quantidade de serviços, animações complexas e recursos de IA.

---

## 11. Riscos e decisões a acompanhar

1. **Licenças e ícones:** reutilização em diagramas nem sempre implica redistribuição irrestrita num produto. Guardar fonte/licença e revisar antes de distribuir.
2. **Experiência de caneta no React Flow:** overlay exige sincronização de coordenadas, eventos do ponteiro e z-index; fazer prova de conceito cedo.
3. **Exportação PNG:** bibliotecas de captura de DOM podem apresentar defeitos com SVG, fontes e imagens; usar assets locais e incluir teste E2E.
4. **Persistência local:** IndexedDB pode ser perdido ao limpar dados do navegador; backup JSON deve estar disponível e explicado.
5. **Catálogo desatualizado:** nomes e ofertas cloud mudam. Cada registro deve guardar `lastReviewedAt` e link oficial.
6. **Complexidade dos templates:** diagrama de referência não substitui avaliação técnica da topologia, dos limites ou da segurança reais.
7. **Privacidade no Meet:** não exibir notas internas nem identificadores sensíveis na janela compartilhada; não prometer área privada se a tela inteira estiver visível.
8. **Acesso offline:** assets devem ser servidos localmente ou estar em cache sob uma estratégia explícita; Next.js por si só não garante offline total.

---

## 12. Critério de sucesso de produto

O MVP estará pronto para uso em pré-vendas quando o SE conseguir realizar, sem sair do aplicativo, a seguinte demonstração:

1. Abrir o Studio e escolher um template.
2. Adaptar uma arquitetura multicloud incluindo serviços de dois ou mais provedores.
3. Adicionar um componente customizado para representar um sistema legado.
4. Criar duas cenas: uma visão geral e um fluxo técnico.
5. Apresentar a arquitetura com destaque e animação conceitual.
6. Exportar o diagrama em PNG e o projeto em JSON editável.
7. Reabrir a arquitetura em outro momento sem perda de informações.

**Decisão recomendada:** após aprovar esta especificação, iniciar pela fundação do editor (T03 + catálogo + persistência), com um vertical slice completo de **adicionar Cloud Run → conectar BigQuery → salvar → reabrir → apresentar**.
