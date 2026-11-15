# AGENTS.md — MultiCloud Solution Studio

> Instruções permanentes para assistentes de código que atuam neste repositório.
> Aplicam-se a planejamento, implementação, revisão, testes, documentação e manutenção.
> **Idioma:** comunicar-se com o usuário em português do Brasil; preferir inglês para identificadores de código, nomes de arquivos técnicos, tipos e comentários que precisem ser compartilhados entre desenvolvedores.

## 1. Missão e fonte de verdade

O **MultiCloud Solution Studio** é uma aplicação web **local-first, desktop-first**, usada por Solutions Engineers em reuniões de pré-vendas para **construir, adaptar, explicar e apresentar arquiteturas multicloud ao vivo**.

O produto combina um canvas livre com componentes estruturados de **Google Cloud, AWS, Microsoft Azure, Oracle Cloud Infrastructure (OCI), Cloudflare, Hostinger e Supabase**, além de elementos customizados/on-premises.

A prioridade é uma experiência de apresentação **confiável, rápida, clara e visualmente profissional**. O MVP não é um provisionador de infraestrutura, um validador de segurança de produção ou uma calculadora oficial de preços.

**Fonte principal de requisitos:** `MultiCloud_Solution_Studio_MVP_PRD_v1.md` (PRD v1.0). Se o arquivo estiver em outro local do repositório, localize-o. Leia as seções pertinentes **antes** de alterar comportamento; use os IDs `RF-*` e `CA-*` para rastreabilidade. Se o PRD não estiver disponível, informe essa limitação e não invente requisitos específicos.

**Ordem de prioridade em caso de conflito:** instruções explícitas mais recentes do usuário e instruções superiores da plataforma > este `AGENTS.md` > PRD e ADRs aceitos > convenções existentes. Se houver divergência material entre este arquivo e o PRD, exponha o conflito e proponha a menor correção antes de seguir.

### Escopo obrigatório do MVP (P0)

- Projetos locais: criar, abrir, listar, renomear, duplicar, excluir e importar.
- Canvas com zoom, pan, seleção, drag/drop, conexões, grupos/zonas, elementos livres, atalhos e undo/redo.
- Catálogo declarativo de **44 entradas iniciais** nos sete provedores, conforme PRD, com busca por nome, alias, provedor e categoria.
- Nós de serviço com metadados, propriedades editáveis e referências à documentação oficial.
- Ferramentas genéricas: retângulo, círculo, texto, nota, sistema externo, banco genérico e caneta livre.
- Modo apresentação 16:9 com cenas, viewport salvo, destaque e notas privadas adequadamente protegidas na tela compartilhada.
- Animação **conceitual** dos fluxos selecionados, sempre rotulada como ilustrativa.
- Persistência IndexedDB, import/export `.mcss.json` versionado e exportação PNG.
- Cinco templates ilustrativos, acessibilidade básica e mensagens de erro recuperáveis.

**Não adicionar ao MVP sem solicitação explícita:** IA/copiloto, contas e autenticação, sincronização Google Drive/cloud, colaboração em tempo real, Terraform/provisionamento, cálculo oficial automático de preços, importação de infraestrutura real, telemetria do ambiente do cliente ou simulação quantitativa de carga.

## 2. Regra universal: pnpm é obrigatório

**USE SEMPRE `pnpm` para gerenciar dependências e executar scripts do projeto. Sem exceções silenciosas.**

- Instalar dependências existentes: `pnpm install` (preferir `pnpm install --frozen-lockfile` em CI).
- Adicionar dependência de runtime: `pnpm add <package>`.
- Adicionar dependência de desenvolvimento: `pnpm add -D <package>`.
- Remover dependência: `pnpm remove <package>`.
- Atualizar dependências: `pnpm update <package>` (justificar mudanças relevantes).
- Executar scripts: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test` ou `pnpm <script>` **somente se o script existir**.
- Executar binários locais: `pnpm exec <binary>`; executores temporários, quando necessários e autorizados: `pnpm dlx <package>`.
- Ferramentas que instruem rodar `npx` devem ser adaptadas para `pnpm dlx` ou `pnpm exec`, conforme o caso.

**Proibido:** usar `npm`, `npx`, `yarn` ou `bun` para instalar, remover, atualizar dependências ou executar comandos equivalentes do projeto; gerar ou manter `package-lock.json`, `yarn.lock` ou `bun.lock*`; alterar o gerenciador por conveniência.

**Lockfile canônico:** `pnpm-lock.yaml`. Respeite o campo `packageManager` do `package.json`; não mude sua versão sem necessidade justificada. Se `pnpm` não estiver disponível, informe o bloqueio ou use o mecanismo apropriado para ativá-lo (por exemplo, Corepack), sem migrar para outro gerenciador. Antes de instalar pacotes, verifique se uma solução existente já atende à necessidade; não acrescente dependências sem propósito claro.

## 3. Regra universal: utilizar as skills disponíveis

As skills disponibilizadas pelo usuário fazem parte do fluxo de trabalho. **O agente deve descobrir, consultar e aplicar as skills relevantes antes de executar uma tarefa**, não apenas citá-las na resposta.

### Protocolo obrigatório de skills

1. **No início da sessão ou ao mudar de tipo de trabalho**, procurar e ler a skill `using-agent-skills` (se instalada), seguindo seu método de descoberta e invocação. Para organizar contexto, usar `context-engineering` quando pertinente.
2. Antes de cada tarefa, identificar quais skills da matriz abaixo são relevantes. Localizar a instrução real da skill (`SKILL.md` ou interface disponibilizada pelo ambiente), **ler o conteúdo** e executar seu workflow quando viável.
3. Priorizar skills especializadas em vez de inventar processos paralelos. Combinar apenas as necessárias; não disparar todas em toda mudança.
4. Skills são **orientações de execução**, não autorização para expandir escopo, modificar arquivos fora do pedido, transmitir dados, instalar ferramentas ou ignorar o PRD.
5. Se uma skill não estiver instalada, não puder ser lida ou exigir integração indisponível, **não simular sua execução**: registrar a limitação brevemente e aplicar o processo equivalente disponível.
6. Ao concluir uma tarefa de implementação, mencionar sucintamente **quais skills efetivamente foram utilizadas**, o que foi testado e o que ficou pendente. Nunca alegar testes, leituras ou verificações que não ocorreram.

### Matriz de roteamento (skills fornecidas)

| Contexto / gatilho | Skills prioritárias |
|---|---|
| Início de sessão, regras, contexto e escopo | `using-agent-skills`, `context-engineering`, `spec-driven-development` quando faltar especificação |
| Quebrar PRD em tarefas e entregar incrementos | `planning-and-task-breakdown`, `incremental-implementation` |
| Criar telas, componentes e interações | `frontend-design`, `frontend-ui-engineering`, `design-taste-frontend`, `ui-taste` quando disponível |
| Implementar/otimizar React e Next.js | `vercel-react-best-practices`, `source-driven-development` |
| Componentes shadcn/ui e design system | `shadcn`, `frontend-ui-engineering` |
| Canvas, arraste, zoom, gestos, animação e acessibilidade | `frontend-ui-engineering`, `apple-design` para princípios de movimento/gestos, `web-design-guidelines` para auditoria |
| Contratos TypeScript, schemas, módulos e dados | `api-and-interface-design`, `codebase-design`, `domain-modeling` |
| Alterações de comportamento, reducers, schemas, bugs | `test-driven-development` (ou `tdd` conforme disponível), `debugging-and-error-recovery` |
| Testes reais de navegador, capturas e QA visual | `agent-browser`; `browser-testing-with-devtools` quando o MCP requerido estiver configurado |
| Lentidão, renderizações e canvas extenso | `performance-optimization`, `vercel-react-best-practices` |
| Importação JSON, storage, URLs, pacotes e segurança | `security-and-hardening` |
| Revisão de alterações e simplificação | `code-review-and-quality`, `code-review` quando houver base/diff definido, `code-simplification` quando apropriado |
| Commits, branches e versionamento | `git-workflow-and-versioning` |
| ADRs, mudanças arquiteturais e documentação | `documentation-and-adrs`, `domain-modeling` |
| CI, entrega e critérios de qualidade | `ci-cd-and-automation`, `constraint-driven-development`, `shipping-and-launch` quando aplicáveis |
| Hipóteses arquiteturais arriscadas | `doubt-driven-development`, `prototype` para experimentos descartáveis |

Outras skills da lista (por exemplo, `security-audit`, `deprecation-and-migration`, `observability-and-instrumentation`, `idea-refine`, `interview-me`, `grill-me`, `find-skills`) devem ser consideradas quando o **gatilho real da tarefa** corresponder à descrição. Skills específicas de iOS, React Native ou pesquisa em deep learning não são pertinentes ao MVP web, salvo mudança explícita de escopo.

## 4. Stack e limites de arquitetura

**Stack prevista no PRD** (não trocar sem justificativa técnica e alinhamento):

- Next.js App Router + React + TypeScript com verificação estrita de tipos.
- `@xyflow/react` para nós, arestas, agrupamentos e viewport.
- Tailwind CSS + shadcn/ui + Lucide para interface.
- Zustand para estado interativo; Dexie/IndexedDB para dados persistidos.
- Zod para dados de catálogo, importação e formatos versionados.
- Vitest para testes de lógica e Playwright para testes de fluxo no navegador.
- Exportação PNG por biblioteca/abordagem **validada visualmente** em navegadores reais.

### Fronteiras de módulos

Separar responsabilidades em `features/projects`, `features/canvas`, `features/catalog`, `features/annotations`, `features/presentation` e `features/import-export`, com esquemas/utilitários em `lib/` e catálogo/templates declarativos em `data/`. Componentes genéricos de UI ficam em `components/ui/`.

- **Catálogo ≠ instância do nó:** catálogo contém metadados estáticos; projeto guarda `serviceId`, configuração própria e fallback de exibição para serviços desconhecidos.
- **Persistência ≠ estado efêmero:** seleção, hover, ferramentas e menus não devem disparar gravação do documento a cada frame.
- **Canvas ≠ apresentação:** apresentação reutiliza o mesmo projeto e registra cenas (viewport, destaques, títulos e notas), sem duplicar o grafo.
- **Desenho livre ≠ elemento da tela:** traços usam coordenadas do canvas e permanecem alinhados no zoom/pan.
- **Fluxo animado ≠ tráfego real:** animações não consultam provedores nem inferem métricas de produção.
- **Validação do schema ≠ validação da arquitetura cloud:** uma conexão editável representa intenção lógica, não certificação de compatibilidade ou segurança.

Projetar para a possibilidade de exportação estática e execução local: **não tornar o editor dependente de rotas de servidor, chaves privadas ou serviços externos**. Operações com browser APIs, IndexedDB e fullscreen devem acontecer no cliente, com tratamento do ambiente de execução adequado.

### Modelo de dados essencial

Preservar as entidades e campos previstos no PRD: `Project`, `Node`, `Edge`, `Drawing`, `Scene` e `CatalogService`. Toda exportação `.mcss.json` deve portar `schemaVersion`, ser validada antes de importar e suportar evolução/migração de versões. A importação sempre cria um **novo projeto** e nunca sobrescreve dados existentes sem fluxo explícito de autorização.

## 5. Padrões de implementação

- **TypeScript estrito:** não usar `any`, `@ts-ignore`, `eslint-disable` ou casts inseguros para esconder erros sem justificativa documentada e localizada.
- Componentes e hooks pequenos, coesos e nomeados por responsabilidade; evitar arquivos monolíticos e abstrações prematuras.
- Separar regras de domínio e transformações de documento da renderização React. Preferir funções puras para operações de geometria, serialização, validação e edição.
- Atualizações de grafo devem manter IDs estáveis, referências válidas e agrupamentos consistentes. Histórico deve suportar **ao menos 20 operações** desfazer/refazer sem arestas órfãs.
- Eventos de ponteiro de alta frequência, zoom e animações não devem causar gravação excessiva em storage nem rerenderizar todo o aplicativo desnecessariamente.
- Acessibilidade em controles e painéis: foco visível, teclado, nomes acessíveis, contraste adequado e suporte a `prefers-reduced-motion`.
- Nada de dados reais de clientes em exemplos, commits, logs, screenshots ou fixtures. Usar amostras sintéticas e credenciais fictícias.
- Não copiar indiscriminadamente SVGs/logotipos de fornecedores: documentar fonte, licença/termos de uso e data de revisão antes de empacotar assets.
- Texto do produto voltado ao usuário final em **pt-BR** nesta fase; código e APIs podem usar inglês. Centralizar strings quando isso facilitar manutenção.

### Visual: minimalista, claro e corporativo

Seguir o PRD (seção 6), usando como referências: fundo `#F8FAFC`, canvas/superfícies `#FFFFFF`, texto `#111827`, secundário `#64748B`, bordas `#E5E7EB` e acento `#2563EB`.

- Priorizar legibilidade em apresentação 1920×1080 compartilhada via Google Meet; não depender de hover para informações essenciais.
- Respeitar hierarquia visual, alinhamento, respiro e estados completos: vazio, carregando, erro, sucesso, foco, seleção e desabilitado.
- Evitar dashboards genéricos, gradientes chamativos, glassmorphism, saturação excessiva, animação ornamental e componentes gigantes.
- Ícones de provedores devem manter identidade reconhecível dentro de um layout neutro; conexões, grupos e labels precisam continuar legíveis quando o diagrama cresce.
- Desktop-first, com painéis recolhíveis e mensagens apropriadas para telas pequenas; edição mobile está fora do MVP.
- Antes de considerar uma tela pronta, inspecioná-la **renderizada no navegador** e corrigir quebras, truncamentos e sobreposições.

## 6. Fluxo de trabalho obrigatório por tarefa

### Antes de codificar

1. Ler a solicitação, este `AGENTS.md`, o trecho aplicável do PRD e as convenções reais do repositório.
2. Descobrir e ler as skills pertinentes conforme seção 3.
3. Inspecionar `package.json`, `pnpm-lock.yaml`, scripts, arquivos e testes existentes **sem presumir que o projeto já foi inicializado**.
4. Definir a menor entrega vertical verificável, os critérios `RF-*`/`CA-*` envolvidos e os riscos relevantes.
5. Consultar documentação **oficial e atual** das APIs/bibliotecas antes de depender de comportamento específico; não inventar métodos ou props.
6. Para mudanças amplas, elaborar plano conciso e implementar em fatias; não fazer refatoração não relacionada ao pedido.

### Durante a implementação

1. Criar primeiro ou junto os testes apropriados para regras, schemas e comportamentos (`test-driven-development` quando disponível).
2. Fazer mudanças pequenas, consistentes com os módulos existentes. Preferir corrigir a causa raiz a adicionar workarounds.
3. Ao adicionar bibliotecas, justificar necessidade, compatibilidade, impacto de bundle/licença e usar **exclusivamente pnpm**.
4. Validar estados de UI e operações de editor durante o desenvolvimento, não só no final.
5. Registrar decisões arquiteturais não triviais em ADR (se o projeto adotar `docs/adr/`) e manter documentação sincronizada com comportamento real.

### Ao concluir

1. Executar os comandos de qualidade **existentes** via `pnpm` (lint, typecheck, testes e build conforme `package.json`). Não declarar sucesso de scripts inexistentes.
2. Para mudanças visuais/interativas, abrir o app num navegador real e testar o fluxo relevante, usando skills de browser quando disponíveis; inspecionar console e renderização.
3. Para persistência/importação/exportação, validar os caminhos positivos **e** inválidos, inclusive reload, arquivos malformados e falhas recuperáveis.
4. Revisar o diff contra PRD e padrão de código; não remover testes nem reduzir verificações somente para obter resultado verde.
5. Responder em pt-BR com: **o que mudou**, **skills usadas**, **comandos/testes realmente executados**, **resultado** e **limitações/pendências**. Não afirmar que tudo passou se não foi possível executar.

**Proibido mascarar pendências:** sem mocks apresentados como integração real, números de preço inventados, comentários `TODO` como substitutos de funcionalidade solicitada, testes `skip` para contornar falhas, nem afirmações de “100% funcional” sem evidência.

## 7. Qualidade, segurança e testes de aceitação

Os critérios **CA-01 a CA-18 do PRD** são a definição de aceite do MVP. Não remover, afrouxar ou reescrever critérios para facilitar a implementação. Ao entregar funcionalidades, associar os testes correspondentes.

Verificações especialmente importantes:

- Reproduzir **Cloudflare → Cloud Run → Supabase**, com edição e rotulagem das conexões (`CA-03`).
- Formas, grupos, caneta e arestas sincronizados com zoom/pan (`CA-04`, `CA-05`).
- Histórico íntegro após 20 ações (`CA-06`).
- Salvar, recarregar e restaurar projeto, viewport e cenas (`CA-07`).
- Roundtrip de `.mcss.json` sem sobrescrever projeto; rejeitar entrada inválida sem perder dados (`CA-08`, `CA-09`).
- PNG completo com ícones, textos, traços, grupos e arestas (`CA-10`).
- Cenas e animação estritamente didática, sem alterações indesejadas no desenho (`CA-12`, `CA-13`).
- Apresentação legível a 1920×1080, sem painéis de edição e sem expor notas privadas (`CA-14`).
- Nenhum envio automático de projetos a endpoints externos (`CA-15`).
- Teste de referência de **80 nós e 120 conexões** em Chrome moderno, medindo e documentando eventuais gargalos (`CA-16`).
- Erros de persistência visíveis, sem status falso de `Salvo` (`CA-18`).

**Segurança local:** tratar arquivos importados, labels, URLs e SVGs como não confiáveis. Validar tamanhos/schema, evitar execução de conteúdo ativo e bloquear URLs perigosas; links externos são abertos somente por ação explícita. Não incluir analytics, tracking remoto, serviços de IA ou captura de informações de clientes por padrão.

## 8. Priorização e caminho inicial

A ordem de entrega do PRD é:

1. **Fundação:** app shell, tokens visuais, dashboard, catálogo e nós inteligentes.
2. **Editor confiável:** edges, forms/shapes, grupos, caneta, atalhos, histórico e IndexedDB.
3. **Apresentação:** templates, cenas, spotlight, fullscreen e animação conceitual.
4. **Qualidade:** import/export, PNG, acessibilidade, erros, desempenho e revisão de licenças.

**Primeiro vertical slice recomendado:** adicionar **Cloud Run** → conectar **BigQuery** → editar propriedades → salvar → recarregar → apresentar. Isso valida desenho, modelo de dados e fluxo de apresentação com risco controlado.

**Regra de produto:** estabilidade do editor, confiabilidade dos dados e clareza da apresentação têm prioridade sobre quantidade de efeitos, complexidade de animação ou expansão precoce do catálogo.

---

**Resumo operacional para o agente:** leia o PRD, descubra e aplique as skills relevantes, **use sempre pnpm**, implemente em incrementos verificáveis, valide visualmente num navegador real e nunca confunda arquitetura ilustrativa com infraestrutura validada em produção.
