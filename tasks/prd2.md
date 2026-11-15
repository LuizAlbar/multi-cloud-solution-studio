# PRD 2 — Evolução visual e funcional do MultiCloud Solution Studio

**Tipo:** especificação incremental de produto / solicitação de evolução da aplicação já existente  
**Base:** `MultiCloud_Solution_Studio_MVP_PRD_v1.md` (ou o PRD v1 disponível no repositório) e `AGENTS.md`  
**Prioridade:** pré-vendas técnicas e apresentações ao vivo em desktop  
**Identidade:** minimalista clara, precisa, profissional, compacta, sem elementos decorativos sem função  
**Regra de precedência:** este documento complementa o PRD v1; em conflito pontual nas áreas aqui tratadas, prevalece o PRD 2. Preserve as demais funcionalidades e dados existentes.

## 1. Contexto e objetivo

A primeira versão do MultiCloud Solution Studio já possui dashboard de projetos, editor visual, catálogo inicial de 44 serviços, nós e conexões, cenas, exportação e apresentação. A aplicação funciona, mas a interface está excessivamente espaçada, a biblioteca de serviços é limitada e a identidade gráfica ainda precisa ser aplicada de forma consistente.

**Objetivo da evolução:** transformar a aplicação existente em uma ferramenta de engenharia de soluções mais madura, rápida e confiável para reuniões com clientes, sem inflar a UI com textos, cards, contadores, botões ou seções que não atendam a uma necessidade real.

**Mudanças solicitadas:**
1. Adicionar um **Modo Playground** anônimo, efêmero (*stateless* entre sessões), sem criar ou salvar projeto.
2. Refinar profundamente a UI/UX do dashboard, catálogo, editor e inspector, mantendo minimalismo claro e aumentando a densidade útil.
3. Aplicar **ícones oficiais específicos dos serviços**, e ampliar significativamente a cobertura dos sete provedores: Google Cloud, AWS, Microsoft Azure, Oracle Cloud Infrastructure, Cloudflare, Hostinger e Supabase.
4. Integrar ao aplicativo a **logo e o favicon já existentes na pasta `/assets` do repositório**.
5. **Remover o campo “Notas do apresentador” dos elementos/nós** e de qualquer formulário de edição de elementos.

## 2. Instruções obrigatórias para o agente desenvolvedor

Antes de alterar o código:
- Leia `AGENTS.md`, o PRD v1, este `prd2.md` e a estrutura do repositório.
- Identifique os componentes existentes, as rotas, schemas de projeto, dados de catálogo, estratégia de persistência, bibliotecas e a localização **real** dos assets.
- Use as **skills efetivamente disponíveis**, escolhendo as aplicáveis ao trabalho (ex.: `using-agent-skills`, `frontend-design`, `frontend-ui-engineering`, `shadcn`, `vercel-react-best-practices`, `source-driven-development`, `incremental-implementation`, `test-driven-development`, `agent-browser`, `code-review-and-quality`). Leia suas instruções quando acessíveis; não simule o uso de skills ausentes.
- **Use exclusivamente `pnpm`** para dependências e scripts (`pnpm install`, `pnpm add`, `pnpm remove`, `pnpm exec`, `pnpm build`, `pnpm test`, conforme scripts existentes). Preserve `pnpm-lock.yaml` e não gere lockfiles de npm/yarn/bun.
- Não refatore tudo do zero, não quebre projetos existentes, cenas, exportações ou o histórico. Execute a evolução em incrementos testáveis.
- Consulte documentação atual e fontes oficiais ao determinar nomenclatura de serviços, bibliotecas de ícones e direitos de uso. Não invente serviços, logos, URLs ou contagens.

## 3. RF2-01 — Playground anônimo e sem persistência

### Experiência
- Exibir uma ação visível **“Playground”** no dashboard, separada de **“Novo projeto”**.
- Ao clicar, abrir imediatamente o editor vazio em uma rota ou modo próprio (preferencialmente `/playground`), sem modal de nome, sem criação de registro de projeto e sem autenticação.
- No header do editor mostrar indicador discreto **“Playground · Não salvo”**, com linguagem honesta e sem um status “Salvo”.
- Disponibilizar os mesmos recursos de desenho de projeto: serviços, formas, grupos, conexões, undo/redo, inspector, apresentação e exportação manual.

### Semântica de *stateless*
- O desenho do Playground vive **somente na memória da aba**, enquanto ela estiver aberta.
- **Não gravar** o conteúdo em IndexedDB, localStorage, sessionStorage, autosave, backups implícitos ou listas de projetos; não ressuscitar o desenho ao atualizar a página.
- Recarregar a página ou abrir uma nova sessão deve começar com canvas vazio.
- O Playground **não deve aparecer** no dashboard, na busca de projetos, em “Recentes” ou nos contadores de projetos.
- Se o usuário tentar fechar/recarregar/navegar com alterações não exportadas, utilizar aviso de perda de trabalho **quando tecnicamente possível e sem bloquear ações indevidamente**. Não prometer que todos os navegadores permitem mensagens personalizadas ao fechar a aba.
- Permitir **Exportar PNG** e **Exportar diagrama JSON** de forma explícita e manual. Caso exista a opção “Salvar como projeto”, ela deve ser uma ação opt-in bem identificada que cria um novo projeto apenas após confirmação do usuário; nunca uma persistência automática.
- Isolar o storage por modo: o autosave dos projetos deve continuar funcionando normalmente, mas nunca ser disparado para o Playground.

### Critérios de aceite
- Abrir Playground a partir do dashboard em um clique e adicionar serviços de pelo menos dois provedores.
- Confirmar por inspeção de storage que nenhum projeto ou artefato é persistido implicitamente.
- Atualizar a página: o canvas volta vazio.
- Voltar ao dashboard: o número de projetos e a lista não se alteram.
- Exportar manualmente PNG/JSON sem criar projeto.
- Projetos salvos continuam com autosave e recuperação intactos.

## 4. RF2-02 — Redesign minimalista, compacto e profissional

### Princípio visual
**Melhorar hierarquia, distribuição e densidade de informação — não preencher espaço vazio por decoração.** Os mockups de referência são inspiração visual, não especificação literal: não copiar números fictícios, cards simulados, serviços não verificados, notificações, avatares, gráficos ou seções que não existem no produto.

### Dashboard
- Substituir a sensação de “duas caixas perdidas em um enorme vazio” por um layout alinhado e equilibrado, com largura de conteúdo controlada, margens consistentes, títulos e ações próximos do conteúdo a que pertencem.
- No início, dar destaque funcional a **Playground**, **Novo projeto** e, quando disponível, **Templates**; não repetir CTAs equivalentes em várias regiões.
- Projetos reais ficam em grid responsivo de cards compactos ou lista, com título, provedores efetivamente presentes, total real de nós/conexões, atualização e ações em menu contextual.
- Busca e filtros devem ocupar o mesmo contexto visual da lista; não adicionar filtros sem utilidade quando houver poucos projetos.
- Quando houver somente dois projetos, apresentar **apenas esses dois**, sem inventar outros cards ou indicadores para ocupar o restante da página.
- Remover métricas de vaidade e blocos redundantes. Uma seção “Recentes” só existe se tiver valor distinto da lista principal e dados reais.
- Mostrar estados vazios úteis, curtos e com uma única ação primária.

### Editor
- Preservar header, painel esquerdo de catálogo, canvas central e inspector contextual à direita, mas melhorar alinhamento e proporções.
- Reduzir preenchimentos excessivos e lacunas verticais em listas, nós, filtros, painéis e formulários. Usar escala de espaçamento coerente (4/8/12/16/24 px), sem esmagar alvos clicáveis.
- Referências iniciais, ajustáveis após teste visual: header ~56–60 px; catálogo ~248–280 px; inspector ~288–320 px; texto de UI ~13–14 px; ícones de serviços ~20–28 px.
- Painéis laterais recolhíveis, com animação discreta e sem alterar ou perder o diagrama.
- Melhorar catálogo: busca no topo, filtros claros por provedor/categoria, lista densa e legível, sem múltiplas áreas de rolagem aninhadas competindo entre si.
- Nós no canvas: altura proporcional ao conteúdo, ícone específico, nome legível, provedor de forma discreta; seleção clara, conectores/hit-areas operáveis, sem sombras pesadas ou badges duplicados.
- Painel inspector contextual com grupos de propriedades relevantes e campos compactos. Esconder grupos vazios e evitar repetir provedor/categoria em três lugares.
- Preservar toolbar flutuante do editor, cenários, apresentação, zoom, pan, atalhos, conexão e exportação; reorganizar somente para reduzir esforço cognitivo.
- Estado sem seleção: recolher ou usar inspector minimalista, sem texto de preenchimento desnecessário.
- Em modo apresentação, esconder os controles de edição e manter texto do diagrama legível durante compartilhamento de tela no Google Meet.

### Design system
- Predominantemente **claro**: branco, cinzas neutros, bordas discretas, tipografia precisa e um acento roxo/índigo coerente com a nova marca.
- Evitar gradientes no plano de fundo, hero gigante, slogans, cards ornamentais, contadores fictícios, badges desnecessários e navegação que leva a funcionalidades inexistentes.
- Garantir contraste, foco visível, uso por teclado e respeito a `prefers-reduced-motion`.
- Priorizar layout desktop em 1366×768 e 1920×1080; verificar que a interface não exige rolagem vertical involuntária no editor.

### Critérios de aceite
- Dashboard correto com 0, 1, 2 e muitos projetos, sem dados falsos e sem áreas redundantes.
- UI legível em 1366×768 e 1920×1080, com canvas preservando área útil adequada.
- Nenhum botão novo sem ação real; nenhuma seção acrescentada só para preencher espaço.
- Testar telas e estados reais no navegador, registrar screenshots de antes/depois e corrigir problemas visuais identificados.

## 5. RF2-03 — Expansão do catálogo e ícones oficiais por serviço

### Objetivo
Ir muito além das 44 entradas existentes, priorizando a cobertura prática dos **principais serviços** que um Solutions Engineer precisa representar em arquiteturas de infraestrutura, redes, bancos, dados, segurança, IA e integração.

### Cobertura por provedor
- **Google Cloud:** computação, serverless, containers, storage, bancos, BigQuery/analytics, redes, segurança, IAM, operações, Vertex AI e produtos de IA empresariais relevantes.
- **AWS:** EC2, Lambda, ECS/EKS/Fargate, S3, bancos, redes, IAM/segurança, monitoramento, integração, analytics, Bedrock e serviços arquiteturais importantes.
- **Microsoft Azure:** VMs, App Service, Functions, AKS, bancos, storage, rede, identidade, segurança, observabilidade, dados e Azure AI.
- **OCI:** compute, containers, bancos, object/block storage, rede, IAM/security, dados/analytics, observabilidade e IA disponibilizada pelo provedor.
- **Cloudflare:** Workers, CDN, WAF, DNS, R2, D1, KV, Durable Objects, Queues e demais produtos centrais pertinentes.
- **Hostinger:** apenas produtos efetivamente oferecidos e diagramáveis (ex.: VPS, hospedagem/cloud hosting e demais ofertas relevantes verificadas); não fabricar equivalentes de serviços hyperscaler.
- **Supabase:** Postgres, Auth, Storage, Edge Functions, Realtime, Vector e outras capacidades oficiais pertinentes, com distinção entre produto e feature.

### Implementação do catálogo
- Inventariar a lista atual; preservar IDs estáveis e compatibilidade com nós de projetos já salvos.
- Usar manifesto declarativo versionado: `serviceId`, `providerId`, nome oficial, aliases, categoria, tags, descrição sucinta, documentação oficial, chave do ícone, fonte do ícone, restrições de uso e data de revisão.
- Criar taxonomia consistente de categorias: Compute, Containers, Storage, Databases, Network/Edge, IAM/Security, Data/Analytics, AI/ML, Messaging/Integration, Observability/DevTools e Custom/On-prem, conforme necessidade real.
- Implementar busca por nome oficial, aliases, provedor e categoria; filtros devem funcionar em conjunto e mostrar contagens calculadas dos dados reais.
- **Não usar a logo genérica do provedor para representar todo serviço.** Ex.: cada item deve mostrar, quando permitido/disponível, o ícone específico de Cloud Run, BigQuery, EC2, S3, Azure Functions etc.
- Utilizar bibliotecas de arquitetura/ícones **oficiais** dos provedores, verificando direitos de uso e redistribuição. Não baixar ícones de sites aleatórios nem usar uma representação oficial inventada.
- Quando o provedor não oferecer ícone específico redistribuível, usar fallback **genérico e claramente diferenciado**, com marca do provedor secundária se permitida; documentar o motivo.
- Preferir assets locais otimizados, sem chamadas de rede para carregar ícones durante a apresentação. Não expor links quebrados.
- Validar nomes e status dos serviços na documentação atual; não criar itens obsoletos como se fossem ofertas correntes sem sinalização.
- A ampliação não deve ser apenas cosmética: cobertura real e útil, representativa de todas as categorias essenciais, com aumento substancial em relação aos 44 itens iniciais. Criar relatório de cobertura por provedor/categoria, lacunas e fontes. **Não alcançar contagem artificial adicionando entradas inventadas ou duplicatas.**
- Como meta de planejamento, perseguir **150+ entradas válidas**, distribuídas conforme a profundidade real de cada portfólio; se houver limitações documentais ou de licenciamento, explicitar as lacunas em vez de falsificar a completude.

### Critérios de aceite
- Cada um dos sete provedores possui catálogo significativo e verificável para seu portfólio real.
- Em amostragem de serviços conhecidos, o catálogo apresenta **ícone do serviço** e não a mesma logo do provedor repetida.
- Busca por `Cloud Run`, `BigQuery`, `EC2`, `S3`, `Azure Functions`, `Autonomous Database`, `Workers` e `Supabase Auth` retorna entradas corretas.
- Contagem apresentada corresponde exatamente ao manifesto carregado.
- Projetos que utilizam os 44 serviços antigos continuam abrindo sem perdas nem nós órfãos.
- Sem dependência de rede externa para renderizar os ícones já empacotados.

## 6. RF2-04 — Integração da logo e favicon existentes em `/assets`

**Os arquivos de logo e favicon JÁ foram colocados pelo usuário em `/assets` no código.** Não solicitar sua geração novamente, não criar outra identidade e não inventar nomes de arquivos.

### Passos obrigatórios
1. Inspecionar a estrutura **real** do repositório e localizar as duas imagens em `/assets` (ou verificar se a localização efetiva é `public/assets`, `src/assets` etc.). Registrar quais arquivos são logo e favicon pela inspeção de nome e conteúdo.
2. Integrar a **logo existente** ao header do dashboard e do editor, respeitando proporção, legibilidade e alinhamento; usar o ícone sozinho em espaços compactos quando fizer sentido.
3. Integrar o **favicon existente** à configuração correta do Next.js App Router (`metadata.icons`, arquivos especiais do `app/`, ou mecanismo apropriado à versão instalada). Ajustar caminho público ou importar assets conforme o projeto, sem links quebrados.
4. Quando necessário, derivar tamanhos de favicon do arquivo fornecido (ex.: 16, 32, 48 px) e ícone de atalho, **sem alterar o conceito visual**; não substituir os originais por ícones genéricos.
5. Se algum asset não estiver acessível ou for ambíguo, registrar o bloqueio e os caminhos encontrados; não afirmar que a integração foi concluída sem testá-la.
6. Verificar apresentação em fundo claro, proporção na navbar e carregamento real do favicon na aba do navegador, sem warnings, 404 ou distorções.

### Critérios de aceite
- Dashboard e editor usam o mesmo branding visual.
- Browser mostra o favicon fornecido após hard reload ou limpeza de cache pertinente.
- Assets são carregados por caminhos estáveis no build e na execução local.

## 7. RF2-05 — Remover “Notas do apresentador” dos elementos

- Remover o campo com rótulo **“Notas do apresentador”** do inspector de nós cloud, nós genéricos e formulários de edição de elementos; remover também qualquer affordance redundante associada diretamente a elementos.
- **Manter “Observações” ou notas técnicas comuns apenas quando acrescentarem contexto de arquitetura**; não renomear “Notas do apresentador” para “Observações” sem ajustar corretamente sua finalidade.
- Se o modelo de dados tiver `presenterNotes`/`speakerNotes` em **nós**, descontinuar seu uso no editor e planejar uma migração compatível para documentos antigos; não apagar sem necessidade outros dados do nó.
- O PRD v1 prevê `speakerNotes` nas **cenas de apresentação**. Isso é uma entidade diferente: não remover automaticamente campos de cena sem solicitação; garantir que notas privadas de cena não apareçam no canvas compartilhado.
- Ajustar tipagem, formulário, serialização, import/export e testes onde necessário.

### Critérios de aceite
- Nenhum elemento apresenta o campo “Notas do apresentador”.
- Importar/abrir projetos antigos não causa crash por campos legados.
- Notas técnicas e dados de cenas previamente existentes são preservados segundo a política de migração definida.

## 8. Plano de implementação sugerido

**Fatia A — Base e identidade:** auditar repositório/assets, aplicar logo/favicon, definir tokens, corrigir espaçamentos mais críticos, verificar screenshots.

**Fatia B — Playground:** criar modo de estado efêmero, isolar persistência, implementar entrada no dashboard, exportação e testes de refresh/storage.

**Fatia C — Editor e dashboard:** refinar layout, catálogo, inspector, estados vazios, toolbar e acessibilidade; remover Notas do apresentador dos elementos.

**Fatia D — Catálogo:** inventário, fontes oficiais/licenciamento, novos dados declarativos, ícones individuais, filtros e migrações.

**Fatia E — QA e regressão:** testar fluxo de projeto salvo, Playground, import/export, cenas, apresentação, undo/redo, favicon e responsividade desktop.

A ordem pode ser ajustada conforme dependências reais. Em cada fatia, entregar código funcional e testes — evitar reescrita maciça sem validação intermediária.

## 9. Não objetivos e guardrails

- Não adicionar IA, backend, login, Google Drive, provisionamento, estimativa automática de preços ou funcionalidades fora do escopo.
- Não criar dados falsos para reproduzir mockups bonitos: projetos, datas, números, contagens e cards devem vir de dados reais; fixtures só em testes/demonstração claramente identificadas.
- Não copiar layouts dos mockups de maneira literal quando eles sugerirem seções sem propósito, números inventados ou serviços inexistentes.
- Não alterar o gerenciador de pacotes (`pnpm`), stack principal ou regras do `AGENTS.md` sem justificativa e autorização.
- Não comprometer o armazenamento de projetos existentes, seus serviços, IDs, cenas e imagens exportadas.
- Não declarar compatibilidade técnica entre serviços só porque conectores podem ser desenhados entre eles.
- Não afirmar conformidade de marca oficial sem verificar os termos do respectivo provedor.

## 10. Definição de pronto — DoD

Considerar o PRD 2 concluído somente quando:

1. Playground funciona sem criar projeto e sem persistência automática, confirmado por teste de refresh/storage.
2. Dashboard e editor foram refinados e validados em navegador nas resoluções-alvo, sem componentes decorativos desnecessários.
3. Logo e favicon dos **arquivos fornecidos** aparecem corretamente em execução e build.
4. O catálogo foi expandido de modo substancial, com cobertura verificada, contagens reais e ícones específicos por serviço quando disponíveis/licenciados.
5. “Notas do apresentador” não existe mais no inspector de elementos; compatibilidade de arquivos antigos foi preservada.
6. Projetos salvos, import/export, apresentação, cenas, seleção, pan/zoom e undo/redo continuam funcionando.
7. Testes, typecheck, lint e build existentes no repositório executam com `pnpm` ou falhas são explicitamente relatadas.
8. O agente entrega um resumo de alterações, arquivos modificados, fontes oficiais dos ícones, testes executados, screenshots de validação e pendências comprovadas — sem alegar sucesso em verificações não executadas.

---

**Resultado esperado:** um MultiCloud Solution Studio que continua simples de usar, mas é mais profissional, compacto e robusto; tem um Playground realmente efêmero; cobre os principais serviços dos sete provedores com iconografia legítima; utiliza o branding já entregue pelo usuário; e não exibe “Notas do apresentador” nos elementos.
