# PRD 4 — Editor de diagramas: redesign de alta fidelidade visual e funcional

**Produto:** MultiCloud Solution Studio  
**Versão:** PRD 4.0 — evolução incremental do editor existente  
**Status:** especificação pronta para desenvolvimento e validação  
**Idioma:** português brasileiro (pt-BR)  
**Escopo prioritário:** tela de edição de diagramas, catálogo de serviços, canvas, nós, conexões, zonas, inspector, toolbar e integração com modo Playground/projetos  
**Prioridade:** P0 para fidelidade visual, usabilidade e preservação de dados; P1 para aprimoramentos de interação descritos adiante  
**Imagem de referência obrigatória:** `docs/references/prd4-editor-target.png` (segunda imagem enviada) — 1672×941 px  
**Imagem de diagnóstico do estado atual:** `docs/references/prd4-editor-before.png` (primeira imagem enviada) — 1869×1011 px

> **ORDEM PARA O AGENTE:** reproduzir com rigor a **experiência visual e a composição da segunda imagem** sem converter o produto em um mockup estático. A primeira imagem serve apenas para identificar diferenças do editor existente. Antes de codificar, abra ambas as imagens, faça a auditoria visual da implementação atual e leia `AGENTS.md`, o PRD inicial, `prd2.md`, `prd3.md` e este documento. Caso uma funcionalidade já exista, evolua-a, não a reimplemente em paralelo.

> **PROIBIDO INVENTAR DADOS PARA COPIAR A IMAGEM:** o `437 serviços` da referência visual, a arquitetura multicloud exemplificativa e os valores dos inputs do inspector são demonstrativos. O catálogo exibido na imagem atual contém **153 de 153 serviços**; não substituir esse total por `437` sem haver 437 definições válidas realmente cadastradas. Não preencher projetos existentes com os nós do mockup. Use fixtures apenas em testes, Storybook ou ambiente explicitamente isolado de demonstração.

---

## 1. Visão de produto e definição de sucesso

### 1.1 Meta deste PRD

Transformar o editor atual, funcional porém visualmente simples, em uma experiência de arquitetura **profissional, clara, compacta, consistente e preparada para ser compartilhada durante uma reunião comercial/técnica**. Seu diferencial deve vir da combinação de:

1. Catálogo multicloud navegável por categorias, com iconografia fiel aos serviços.
2. Canvas central amplo e elegante, com diagramas fáceis de ler a 100% de zoom.
3. Nós com hierarquia visual clara, conexões dirigidas e rótulos legíveis.
4. Zonas/grupos de provedor, região e ambiente, sem transformar o desenho em um documento rígido.
5. Inspector contextual útil e denso, sem espaços gigantes nem campos irrelevantes.
6. Toolbar de desenho discreta, modos de edição, apresentação e Playground preservados.
7. Dados reais, controles funcionais, acessibilidade e ausência de regressões.

### 1.2 Diagnóstico visual da primeira imagem

Na primeira imagem, observam-se:

- Header de projeto e ações úteis, porém marca muito pequena; predominância de UI genérica.
- Catálogo lateral com busca, filtros por provedor e lista plana de serviços; pouco agrupamento por capacidade e muita repetição visual.
- Cerca de 153 itens de catálogo carregados; alguns ícones de produto são genéricos e repetidos.
- Canvas com poucos nós isolados em uma área muito grande; linhas curvas roxas, rótulos HTTP e toolbar inferior funcional.
- Nós com proporções razoáveis, mas baixa expressividade visual e pouca distinção entre serviços/provedores.
- Coluna direita sempre aberta com `VISÃO DO PROJETO` e grande espaço vazio quando nada está selecionado.
- Falta uma linguagem visual uniforme entre catálogo, canvas, nós, conexões e inspector.

**Problema principal:** as informações existem, mas a interface ainda não as apresenta como uma ferramenta premium de engenharia de soluções. A correção deve melhorar densidade, hierarquia, organização e comportamento contextual — **não adicionar dados decorativos ou botões inúteis**.

### 1.3 Características observáveis do resultado-alvo (segunda imagem)

A referência usa:

- Header claro e compacto, com logo mais visível, contexto de `Playground` e ações alinhadas à direita.
- Catálogo lateral de aproximadamente 350–365 px, busca, **sete provedores visíveis** e **seções por categoria** expansíveis.
- Canvas central com grade pontilhada muito discreta, nós mais refinados, ícones dos serviços, conexões direcionais e rótulos compactos.
- Zonas com bordas tracejadas e leves tonalidades por provedor, cada uma com título e região.
- Inspector à direita de aproximadamente 350–365 px, com cabeçalho do item selecionado e propriedades organizadas.
- Toolbar flutuante centrada na base do canvas, com ferramentas agrupadas e ação ativa evidente.
- Uso contido do roxo como cor de seleção, conexão e ação primária; marcas de provedores mantêm sua identidade.

### 1.4 Métricas de qualidade

- Fidelidade perceptível à composição da imagem-alvo em **1672×941** e boa utilização em **1869×1011**, **1440×900** e **1366×768**.
- 0 sobreposições indesejadas entre toolbar, nós, inspector e cabeçalho.
- Projetos existentes abrem com os mesmos nós, edges, labels, cenas, configurações e zoom (quando armazenados).
- Nenhuma alteração de catálogo, propriedades ou modo de apresentação provoca perda silenciosa de dados.
- Interface operável por mouse e teclado, com foco, hover, estados selecionados e modo de movimento reduzido.
- Capturas e evidências de ao menos **duas rodadas completas de comparação visual**.

### 1.5 Não objetivos

- Não redesenhar novamente a Home (concluída/definida pelo PRD 3).
- Não criar integração com contas AWS/GCP/Azure/OCI, observabilidade real, execução de infraestrutura ou cálculo de preços.
- Não adicionar chat, copiloto de IA, login, colaboração ou notificações.
- Não implementar todos os serviços que não estão no catálogo apenas para reproduzir a contagem `437` da referência.
- Não transformar animações didáticas em alegações de fluxo real de rede.
- Não obrigar que todo projeto existente use zonas, regiões ou layout automático.

---

## 2. Regras obrigatórias para o agente implementador

1. **Ler os documentos:** `AGENTS.md`, PRD v1, `prd2.md`, `prd3.md`, `prd4.md` e as duas referências visuais; verificar se há instruções mais específicas nos diretórios existentes.
2. **Auditar o código:** mapear rotas do editor, React Flow, componentes, stores, catálogos, persistência Dexie/IndexedDB, importação/exportação, cenas, Playground, assets e testes antes de modificar.
3. **Usar somente `pnpm`:** `pnpm add`, `pnpm remove`, `pnpm exec`, `pnpm run`, `pnpm dlx` quando estritamente necessário. Não usar npm, yarn ou bun para instalar/manipular/executar dependências. Preservar `pnpm-lock.yaml`.
4. **Utilizar as skills realmente disponíveis:** começar por `using-agent-skills`; para design usar `frontend-design`, `frontend-ui-engineering`, `design-taste-frontend`/`ui-taste`, `shadcn` e `web-design-guidelines`; para implementação `incremental-implementation`, `test-driven-development`, `vercel-react-best-practices`, `source-driven-development`; para QA `agent-browser` ou `browser-testing-with-devtools`, e `code-review-and-quality`. Consultar o conteúdo da skill, não apenas citar o nome. Se não existir no ambiente, registrar a indisponibilidade e continuar com equivalente.
5. **Reutilizar a base existente:** não criar uma segunda store de diagramas, segunda engine de canvas, outro design system ou substituição global desnecessária do React Flow.
6. **Separar visual de semântica:** não usar CSS para ocultar erros do modelo de dados. O que é propriedade de serviço, instância, conexão, grupo ou projeto deve ficar no domínio correto.
7. **Preservar dados existentes:** nenhuma migração destrutiva. Se for preciso introduzir novos campos, criar defaults, migração versionada e testes com projetos antigos.
8. **Validar no browser real:** screenshot, navegação, seleções, zoom/pan, console, rede de assets, keyboard, toque quando aplicável; `pnpm build` sozinho não prova qualidade visual.
9. **Não adicionar elementos inertes:** botão, chip, dropdown, ícone interativo ou badge clicável só se sua ação/estado estiver implementado.
10. **Prioridade de conflito:** PRD4 governa a tela de editor; PRD3 continua governando Home; PRD2 mantém regras de Playground, assets e catálogo; AGENTS.md rege execução, qualidade e dependências.

---

## 3. Layout de referência e especificações espaciais

### 3.1 Áreas da interface

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO + NOME] │ [PROJETO OU PLAYGROUND + CONTEXTO]    [↶ ↷] [CENAS] [EXPORT] [▶]│
├───────────────────┬──────────────────────────────────────────┬───────────────────┤
│ CATÁLOGO          │                 CANVAS                   │ INSPECTOR         │
│ Busca             │   [ZONA GCP]       [ZONA AWS]           │ Cabeçalho do nó   │
│ [provedores]      │   [serviço]        [serviços ligados]    │ Campos relevantes │
│ ─ categorias ─    │                                          │ Configurações     │
│ Compute           │   [ZONA OCI]       [ZONA Azure]         │ Observações       │
│ Containers        │          ↘ linhas com labels ↙          │ Documentação      │
│ Storage           │   [serviço/integração/usuários]          │                   │
│ Network           │                                          │                   │
│ Security          │   [pointer pan draw shapes text ...]    │                   │
└───────────────────┴──────────────────────────────────────────┴───────────────────┘
```

A distribuição dos elementos **deve ser conferida visualmente na imagem**, não inferida somente do ASCII.

### 3.2 Dimensões-alvo (viewport 1672×941)

| Área | Medida/posição de partida | Regra adaptativa |
|---|---|---|
| Header | 62–66 px de altura, 100% da viewport | Sem linha adicional acima dele |
| Catálogo à esquerda | ~350–365 px | Redimensionável/recolhível entre ~285 e 420 px |
| Inspector à direita | ~345–365 px | Recolhível; não forçar se sem seleção |
| Canvas | O espaço restante, aprox. 940–975 px na referência | `min-width: 0`, sem overflow horizontal da página |
| Barra flutuante | ~550–575 px de largura conforme ferramentas reais; ~48–54 px altura | Sempre dentro do canvas, fixa ~18–28 px acima da borda inferior |
| Busca no catálogo | Altura ~36–40 px | Largura completa menos gutters |
| Seletor de provedor | Chips ~28–32 px de altura | Quebra de linha controlada; não cortar opções |
| Item de serviço | ~42–52 px de altura, conforme densidade | Nome com truncamento + tooltip; sem corte de ícone |
| Header do inspector | ~80–95 px com ícone, nome, subtítulo e fechar | Cabeçalho fixo, conteúdo interno rolável |
| Campo no inspector | Input ~34–40 px | Layout de uma coluna, labels acima |
| Zonas no canvas | Auto-sized, padding ~16–22 px | Agrupáveis sem afetar nós existentes |
| Nó de serviço | Componente visual ~170–210 px largura, altura variável 56–76 px | Mínimo legível no zoom de referência |

**Importantíssimo:** a imagem atual foi capturada em **1869×1011**, a referência em **1672×941**. Não compare pixels absolutos de imagens com resoluções diferentes. Gere captura de implementação em 1672×941 para auditar equivalência e também teste a resolução atual do usuário.

### 3.3 Modelo de responsividade

- **Desktop grande (≥1440 px):** três colunas abertas; conteúdo do inspector com scroll independente.
- **Desktop intermediário (1280–1439 px):** catálogo e inspector podem ter largura compacta; centro continua utilizável; permitir recolher um painel.
- **Notebook (1024–1279 px):** catálogo ou inspector como painel colapsável; não reduzir canvas para largura absurda; esconder texto secundário quando necessário, não ações fundamentais.
- **Tablet (<1024 px):** catálogo/inspector como drawer sobre canvas quando aberto; toolbar adaptada.
- **Mobile:** não exigir editor completo equivalente ao desktop se MVP foi projetado desktop-first, mas evitar quebra grave e oferecer mensagem de uso recomendado e/ou navegação possível.
- **Sempre:** scroll interno das colunas; nenhum painel deve aumentar a altura da página inteira; header fixo no contexto.

---

## 4. Sistema visual do editor

### 4.1 Direção estética

**Minimalista claro, técnico, denso na medida certa e premium.** A tela deve lembrar um editor de software profissional, não um dashboard comercial nem um gerador de diagramas infantil.

- Branco e `#F8FAFC` como superfícies; azul-cinza claro em divisórias.
- Cor principal roxo/índigo ligada à marca já criada (usar token do projeto, não um hex isolado replicado dezenas de vezes).
- Cinza muito sutil em grade de pontos e componentes desativados.
- Bordas 1 px, raio uniforme de 10–12 px, sombras de profundidade discreta apenas quando úteis.
- Tipografia existente, preferencialmente Inter ou equivalente. Nome de nó de 13–14 px; labels de edge 11–12 px; heading de painel ~15–16 px.
- Evitar textos com menos de 11 px no layout real; legibilidade durante Meet é um critério de produto.
- Não adicionar gradientes, brilhos, halos e ornamentos em excesso. Usar cores de provedores principalmente em logotipos, grupos e pontos de destaque.
- A posição e intensidade visual do roxo devem ser consistentes: seleção, conexões, ferramenta ativa e ação primária.

### 4.2 Tokens sugeridos (adaptar aos existentes)

```css
:root {
  --editor-surface: #ffffff;
  --editor-background: #f8fafc;
  --editor-text: #0f172a;
  --editor-muted: #64748b;
  --editor-border: #e2e8f0;
  --editor-primary: #5b21e6;
  --editor-primary-subtle: #f3efff;
  --editor-canvas-dot: #e8edf5;
  --editor-shadow-floating: 0 3px 14px rgb(15 23 42 / 0.10);
  --editor-radius-sm: 8px;
  --editor-radius-md: 10px;
  --editor-radius-lg: 12px;
}
```

Estes são **pontos de partida**, não licença para sobrescrever o design system já existente. Fazer ajuste visual contra a referência.

### 4.3 Regras de densidade

- Reduzir padding excessivo, especialmente listas, headers e inspector.
- Evitar longos vazios dentro de painéis quando existir informação útil.
- **Não preencher canvas sem demanda**: espaço livre é necessário para desenhar. O objetivo é tornar a UI mais equilibrada, não ocupar cada área do diagrama.
- Toolbar e labels não podem esconder nós importantes; ter pan/zoom/fit para ajuste.
- Numa reunião, iconografia e hierarquia devem comunicar a arquitetura antes de o usuário ler cada label.

---

## 5. RF4-01 — Header: branding, contexto do diagrama e ações

### 5.1 Branding

- Usar a logo já instalada em `/assets` (ou caminho real do repositório). Não gerar uma nova logo.
- Na referência, logo é legível, com ícone ~36–42 px e nome completo visível no desktop amplo.
- Clique na logo leva à Home, respeitando aviso de perda de estado quando pertinente (Playground).
- Não mostrar indicadores de salvamento falsos em Playground.

### 5.2 Contexto: projeto persistente versus Playground

**Em projeto salvo:** mostrar nome real e status de persistência (`Salvando…`, `Salvo`, `Falha ao salvar`) somente se suportado por persistência observável. O nome pode ser editado por controle existente, preservando dados. **Não trocar arbitrariamente o nome do projeto por `Playground` apenas para imitar o mockup.**

**Em Playground:** mostrar badge/contexto `Playground` em destaque leve, com descrição curta `Diagrama temporário` ou similar. Sem id de projeto persistente, sem autosave, sem registro no dashboard. Não declarar `salvo`. Oferta explícita de `Exportar` funciona sem gravar no banco local.

A legenda `Diagrama livre e sem estado • Não requer criação de projeto` da imagem pode ser encurtada para caber, preservando o sentido.

### 5.3 Ações do header

- Undo e redo agrupados, com estados enabled/disabled reais.
- `Cenas (N)` com contagem derivada das cenas do diagrama aberto, não hardcoded.
- `Exportar` abre fluxo existente com formatos realmente disponíveis; PNG/JSON conforme implementação.
- `Apresentar (P)` usa atalho somente se este estiver implementado e não conflitar com digitação.
- Espaçamentos, ícones, outlines e alturas semelhantes à referência; esconder o texto de ações secundárias em larguras menores se necessário.
- Todos os botões com tooltip e foco visível.

### 5.4 Critérios específicos

- [ ] Header não altera projeto ao abrir Playground.
- [ ] Status `Salvo` só aparece depois de confirmação da persistência.
- [ ] Não existem duas barras concorrentes de edição/apresentação.
- [ ] Logo/nome legíveis e integrados ao design da Home.

---

## 6. RF4-02 — Catálogo multicloud: navegação por capacidade

### 6.1 Organização-alvo

O catálogo deve evoluir de **lista plana** para um explorador de serviços. Ordem interna:

1. Header `Catálogo Multicloud` + total de resultados reais + recolher painel.
2. Campo `Buscar serviços… (Ctrl+K)` com ícone e limpar quando preenchido.
3. Filtros em chips dos sete provedores (Todos, Google Cloud, AWS, Microsoft Azure, Oracle Cloud/OCI, Cloudflare, Hostinger, Supabase).
4. Separador leve.
5. **Categorias expansíveis**: Computação, Contêineres, Armazenamento, Bancos de Dados, Redes e Entrega, Segurança e Identidade, Dados e Analytics, IA e Machine Learning, Integração e Mensageria, Dev Tools e outras existentes de acordo com taxonomia real.
6. Itens de serviço, visíveis quando categoria expandida, exibindo ícone específico quando disponível, nome e identificação do provedor de modo não redundante.

### 6.2 Taxonomia e dados

Criar um conjunto **central de categorias normalizadas**, com IDs estáveis e traduções pt-BR. Serviços devem referenciar `categoryId`. Provedores permanecem entidades estáveis com IDs como `gcp`, `aws`, `azure`, `oci`, `cloudflare`, `hostinger`, `supabase`.

- O total do catálogo e os números entre parênteses devem ser **calculados a partir da base atual** e respeitar filtro e busca.
- O mockup mostra `437 serviços`: **não é uma ordem para adicionar serviços**. Mostrar `153 serviços`, ou outro total real conforme o repositório no momento da entrega.
- Evitar a duplicação de um mesmo serviço em múltiplas categorias, salvo quando existir decisão explícita de múltipla classificação e a contagem distinta estiver correta.
- Filtragem por provedor e busca devem funcionar conjuntamente.
- Busca deve reconhecer nome, aliases razoáveis e categoria, com comparação sem acento e sem distinção maiúsculas/minúsculas.
- Pesquisas sem resultados mostram vazio útil com opção de limpar, não uma categoria fantasma.
- A categoria aberta/fechada pode persistir como **preferência de UI**, mas não deve alterar projeto ou criar registros do Playground.
- Identificar o item com provider badge apenas quando isso agregar informação; quando filtrado por um único provedor, evitar redundâncias visuais.

### 6.3 Ícones oficiais de serviço

- Inspecionar assets existentes e fontes permitidas por cada provedor. Preferir ícones **específicos de serviço** licenciados/autorizados: BigQuery, Cloud Run, EC2, S3 etc., e não um ícone genérico de CPU para cada produto.
- Não confundir logo do provedor com ícone do serviço. Ícone de marca do provedor pode aparecer na tag de provedor/grupo, mas no nó de BigQuery deve haver ícone de BigQuery quando disponível.
- Centralizar o mapeamento `serviceId → asset` em registry tipado. Evitar strings de paths espalhadas por JSX.
- Não copiar assets de fontes sem permissão e não embutir hotlinks frágeis de sites terceiros.
- SVG sanitizado/local preferencial quando permitido; fallback semântico consistente, acessível e registrado quando não houver asset oficial.
- Se não existir ícone válido, o service name nunca deve desaparecer; **não declarar como oficial uma aproximação inventada**.
- Validar tamanho visual e contraste em listas e no canvas.
- Não bloquear carregamento ou exportação do diagrama por causa de um único ícone ausente.

### 6.4 Estados do catálogo

- Busca vazia, busca ativa, sem resultados e erro de dados.
- Categoria recolhida/expandida, provedores filtrados, rolagem longa e painel recolhido.
- Drag-and-drop de serviço para canvas e clique para adicionar quando já previsto.
- Opção por teclado: foco, Enter/Space para acionar e caminho equivalente para adicionar serviço.
- Scroll da lista separado do scroll da página e do canvas; evitar dois scrollbars concêntricos na mesma pequena região como o estado atual sugere.

### 6.5 Performance

- 150–500+ serviços não devem gerar travamentos durante filtro/scroll.
- Usar memoização e/ou virtualização apenas se profiling demonstrar necessidade; se virtualizar, garantir keyboard e DnD corretos.
- A busca não deve recalcular e remontar o grafo React Flow inteiro.

---

## 7. RF4-03 — Canvas e experiência de edição

### 7.1 Layout e fundo

- Canvas ocupa toda região central remanescente entre catálogo e inspector.
- Fundo branco/quase branco com grade pontilhada muito sutil (`Background` do React Flow ou equivalente); não competir com edges.
- `fitView` com padding intencional quando diagrama for aberto pela primeira vez, preservando viewport salvo quando disponível.
- Pan e zoom fluidos sem desalinhamento de shapes, anotações, edges ou grupos.
- Botões de expandir/recolher painéis não podem deslocar posições salvas dos nós em coordenadas do grafo; apenas recalcular viewport.
- Respeitar `prefers-reduced-motion`, limitar transições em alterações de viewport e modo apresentação.

### 7.2 Estados do diagrama

- **Projeto com conteúdo:** renderizar dados salvos, sem acrescentar automaticamente os componentes do mockup.
- **Projeto vazio:** instrução curta e útil no centro (`Arraste um serviço para começar`) apenas quando não existem nós/elementos; desaparece quando houver conteúdo.
- **Playground vazio:** mesma experiência do canvas, porém estado inteiramente efêmero.
- **Durante carregamento:** feedback discreto e real, sem flash de diagrama vazio seguido por conteúdo.
- **Erro:** exibir motivo acessível e ações de recuperação, sem apagar registros.

### 7.3 Fluxo de adição

- Arrastar item da lista para posição da tela e converter corretamente para coordenadas do grafo.
- Clique em item adiciona perto do centro visível, sem sobreposição sempre no mesmo pixel se repetido.
- Nó adicionado deve estar selecionável imediatamente e aparecer no inspector.
- A inclusão de nós/edges customizados deve respeitar undo/redo e persistência conforme modo.

### 7.4 Ferramentas livres

Preservar ponteiro, mover/pan, desenho livre, borracha (se existente), retângulo, círculo, texto, nota/formato customizado, conectores, agrupamentos e operações de zoom. Não remover ferramentas existentes para simplificar o visual.

- Todas as ferramentas vivem no **mesmo sistema de coordenadas do canvas**, independentemente do zoom.
- UI de estado ativo persistente visualmente até mudança de ferramenta.
- Atalhos podem ter legenda contextual em tooltip, não texto fixo extenso.
- Fazer distinção de seleção de nós, desenho de formas e panning para evitar ações acidentais.

---

## 8. RF4-04 — Nós de serviço premium e padronizados

### 8.1 Anatomia do nó

Reproduzir da referência um cartão compacto, confortável e alinhado:

- Contêiner branco, raio ~10–12 px, borda cinza-claro, sombra leve opcional.
- Ícone oficial do **serviço** visível à esquerda (ou à frente da informação principal), respeitando cor oficial.
- Título em peso semibold e truncamento com tooltip quando necessário.
- Microidentificação de provedor ou função com menos peso que o título.
- Handles de conexão discretos, visíveis/mais destacados em hover, seleção ou modo conexão.
- Seleção com outline/anel roxo claramente perceptível, **sem deslocar layout**.
- Variações `compact`/`default` somente se úteis; não multiplicar variantes sem necessidade.

### 8.2 Coerência de marca

O mockup mostra AWS ELB, EC2, S3, GCP BigQuery, Azure Database for PostgreSQL, OCI Object Storage, Supabase e Hostinger com representações distinguíveis. A implementação deve alcançar essa **distinção semântica real** nos serviços cadastrados, não copiar com exatidão a arte gerada por IA.

### 8.3 Rótulos e propriedades

- Nome do produto conforme catálogo, e label customizado da instância quando o usuário editar.
- `role`/finalidade opcional (ex.: `API de produção`) pode ser exibido como subtítulo quando já suportado pelo modelo; não criar subtítulo falso.
- Região ou ambiente podem aparecer em grupos/inspector em vez de duplicados em cada nó.
- Não transformar provider/categoria padrão do catálogo em campos de projeto editáveis arbitrários que alterem a identidade do serviço.

### 8.4 Estados de interação

Padrão, hover, selecionado, multiseleção, drag, focado por teclado, disabled (quando necessário). Selecionar, arrastar e fazer multi-select não deve abrir, salvar ou alterar conteúdo inesperadamente.

---

## 9. RF4-05 — Conexões, labels e animação

### 9.1 Visualização

- Conexões com stroke roxo de espessura ~1.5–2 px, arredondadas onde apropriado.
- Utilizar roteamento/caminho adequado ao contexto (`bezier`, `smoothstep` ou custom) **sem cruzamentos desnecessários**; não prometer roteamento perfeito em qualquer grafo.
- Exibir **setas de direção** onde a relação efetivamente tem direção; não aplicar seta unilateral automaticamente em relação bidirecional.
- Labels em cápsula branca com borda leve e tipografia 11–12 px; ex.: HTTPS, ETL, JDBC. Rótulos são dados da edge, não hardcodes.
- Selecionar linha e abrir inspector de **conexão**, com origem, destino, protocolo/tipo, label e direção.
- Labels não devem bloquear clique do usuário em nós adjacentes nem aparecer sobre os handles.

### 9.2 Modelo semântico

Não confundir `connectionType` de uma edge com configuração do nó. No mockup, `Tipo de conexão` aparece no inspector de EC2; **na implementação correta, deve residir preferencialmente no inspector da conexão selecionada**. Se o domínio existente usa tal campo em node, preservar compatibilidade e migrar/ajustar sem perda, mas corrigir a hierarquia visual.

- Tipos de conexão podem incluir `HTTPS`, `HTTP`, `TCP`, `VPN`, `Evento`, `ETL`, `Replicação`, `Lógico` e `Custom`, quando houver real uso no projeto.
- Permitir label livre, inclusive `JDBC` e `Dados e arquivos`.
- Definir relação orientada ou bidirecional com controles próprios; não inferir segurança, viabilidade ou performance de uma linha desenhada.
- Não abrir validação de rede obrigatória que impeça esboços conceptuais durante discovery.

### 9.3 Flow simulation

Se já implementada, preservar; animação permanece **didática**, ativada pelo usuário. Não executar tráfego real nem apresentar resultados simulados como telemetria.

---

## 10. RF4-06 — Zonas visuais (provedor, região, ambiente)

### 10.1 Por que importam

A referência visual ganha boa parte da expressividade com áreas contendo nós, bordas tracejadas e cabeçalho de provedor/região. Essas áreas tornam projetos multicloud legíveis em uma apresentação.

### 10.2 Tipos de zonas

- **Zona de provedor:** AWS, Google Cloud, Azure, OCI, Cloudflare, Hostinger, Supabase.
- **Zona de região:** anotação semântica de região associada a provedor quando aplicável (ex.: AWS `us-east-1`, GCP `southamerica-east1`).
- **Zona customizada:** on-premises, filial, VPC, projeto, ambiente, domínio de negócio ou agrupamento livre.

**As zonas são opcionais.** Não aplicá-las automaticamente a projetos existentes sem consentimento, e não presumir que produtos globais como Cloudflare exijam campo de região do mesmo modo de uma VM regional.

### 10.3 Anatomia visual de zona

- Fundo quase transparente com tonalidade fraca ligada à marca do provedor.
- Borda 1–1.5 px tracejada de cor discreta.
- Raio ~16–18 px, padding ~18 px.
- Cabeçalho interno com ícone/logotipo do provedor + nome e, onde útil, região em texto secundário alinhado à direita.
- Tamanho adaptado a conteúdo, com resize manual quando implementado.
- Seleção e drag da zona não devem capturar inadvertidamente drag dos nós internos.
- `z-index` correto: zona atrás de nós, conexões visíveis conforme estratégia e handles clicáveis.
- Se node parent/subflows React Flow forem utilizados, mapear movimento e coordenadas consistentemente, com testes de nesting e exportação.

### 10.4 Cores de zona

Exemplos discretos e orientativos: GCP azul pálido, AWS laranja pálido, Azure azul frio, OCI vermelho pálido, Supabase verde pálido, Hostinger lavanda. Não usar backgrounds saturados; evitar depender só da cor para identificar provedor.

### 10.5 Escopo e compatibilidade

Este PRD inclui estrutura e apresentação de zonas; se o projeto ainda não possui suporte a groups, implementar em fatia isolada e testável. Priorizar as funcionalidades básicas antes de grupos complexos. Não quebrar movimentação/nesting anterior.

---

## 11. RF4-07 — Inspector contextual, compacto e informativo

### 11.1 Estrutura padrão ao selecionar serviço

A referência demonstra inspector com:

1. Header: ícone do serviço, nome, categoria/provedor e botão fechar.
2. Informações de identidade e contexto.
3. Campos de configuração editáveis pertinentes.
4. Observações técnicas (se suportadas pelo projeto).
5. Link oficial de documentação do serviço.

Reproduzir **a densidade, estrutura vertical, bordas e labels** da referência, não copiar fielmente propriedades inválidas para um serviço.

### 11.2 Campos, por entidade

| Entidade selecionada | Campos que fazem sentido | Observação |
|---|---|---|
| Nó de serviço | Serviço/provedor (identidade), label, função/descrição, região (quando aplicável), ambiente, configuração tipada, observações técnicas e documentação | Provedor/categoria são dados do catálogo; não trocá-los por selects desconectados |
| Edge/conexão | Origem, destino, tipo, protocolo, direção, label e observações | `connectionType` pertence aqui |
| Zona | Tipo, provedor (se aplicável), região, label, ambiente, cor de identificação | Regiões devem respeitar aplicabilidade |
| Shape/texto | Texto, tamanho, borda, cor, alinhamento e opções específicas | Não exibir campos de infraestrutura |
| Multiseleção | Contagem, comandos seguros em lote e propriedades comuns quando possível | Não sobrescrever propriedades distintas silenciosamente |
| Nenhum elemento | Estado vazio pequeno e contextual, ou painel recolhido | Nunca ocupar coluna inteira com texto centralizado numa imensa área vazia |

### 11.3 Comportamento sem seleção

Na imagem atual, a coluna da direita exibe `VISÃO DO PROJETO` e um aviso central isolado num painel quase totalmente vazio. Isso desperdiça espaço.

**Comportamento esperado:**

- Se o inspector for mantido aberto sem seleção, exibir uma visão compacta e útil do projeto (nome, número de nós/conexões reais e ações relevantes), **somente se essas informações já existirem** e forem úteis.
- Alternativamente, recolher automaticamente o inspector na ausência de seleção e expandi-lo ao selecionar um elemento, com preferência do usuário respeitada.
- Se exibir estado vazio, posicionar mensagem próxima ao topo com tratamento visual discreto, não no meio de uma grande coluna vazia.
- Ao selecionar elemento, abrir ou atualizar inspector sem pular o canvas desnecessariamente.
- Manter controle de recolher/expandir acessível e consistente com catálogo.

### 11.4 Remover Notas do apresentador dos elementos

- **Não reintroduzir `Notas do apresentador` no inspector de nós, edges, zonas ou shapes.**
- Se existe conceito de speaker notes vinculado às cenas, ele continua somente na gestão de cenas (caso seja funcionalidade vigente).
- `Observações` técnicas são distintas e podem existir em nós ou conexões.
- Compatibilidade de dados antigos: nunca apagar campos legados silenciosamente numa migração apenas para ocultá-los da UI; preservar no JSON quando necessário, sem exibir em novos formulários.

### 11.5 Comportamento dos campos

- Usar validação coerente com tipos de dados; opções de região devem corresponder ao serviço/provedor e a catálogos locais quando disponíveis.
- Campo sem aplicabilidade: ocultar ou marcar `Não aplicável`; não mostrar uma região AWS numa instância GCP por engano.
- Edição deve atualizar canvas e store com feedback real; persistir apenas em projetos salvos.
- Evitar gravação por digitação em alta frequência se causar travamento; aplicar debounce correto/commit conforme arquitetura existente.
- Documentação externa em URL confiável, abrindo em nova aba com `noopener,noreferrer` quando apropriado.
- Formulários podem rolar sem deslocar toolbar/canvas; foco preservado.

---

## 12. RF4-08 — Toolbar flutuante e ferramentas de desenho

### 12.1 Aparência

Reproduzir agrupamento e posicionamento da referência:

- Barra horizontal branca, borda sutil e sombra leve.
- Alinhada ao centro **do canvas**, não da janela inteira.
- Separadores verticais entre famílias: seleção/navegação, desenho, elementos, zoom/view.
- Ícone ativo em tile roxo com contraste adequado.
- Ícones do mesmo tamanho ótico, áreas clicáveis ≥36×36 px (preferir ≥40×40 onde espaço permitir).
- Tooltips com nome e atalho, nunca rótulos sempre visíveis ocupando espaço.
- Recolhimento/overflow responsivo quando o canvas ficar estreito.

### 12.2 Ferramentas

Preservar conforme app existente: cursor/seleção, mão/pan, caneta, borracha, retângulo, círculo, anotação/post-it (se existente), texto, componentes genéricos, banco genérico, agrupamento/layers, fit view, zoom +/-. Integrar realmente cada ferramenta; se alguma ainda não existir, não representar como se funcionasse.

### 12.3 Atalhos e eventos

- Atalho ativo não deve disparar enquanto usuário digita num input/textarea/contenteditable.
- ESC retorna a seleção ou fecha overlay conforme contexto.
- Undo/redo devem funcionar com ações de desenho e propriedades.
- Delete/backspace remove seleção quando canvas tem foco, sem interferir em campos de texto.
- Zoom por wheel/pinch sem acionar scroll da sidebar involuntariamente.
- Tooltips e foco acessível via teclado.

---

## 13. RF4-09 — Presentation Mode e cenas existentes

- Preservar experiência de `Cenas (N)` e `Apresentar (P)`; o redesign do editor não elimina funcionalidades de PRD v1.
- Em modo apresentação, ocultar automaticamente catálogo, inspector e toolbar de edição; privilegiar arquitetura visível e legível em compartilhamento de tela.
- Entrar/sair da apresentação não deve mutar posições ou estilos de nós permanentemente.
- Cenas devem recuperar viewport e destaques existentes, sem alterar projeto só por navegação.
- Rótulos/linhas e ícones devem permanecer legíveis na tela compartilhada.
- Se houver cenas de Playground, mantê-las apenas em memória e em arquivo exportado, sem autosave.
- O template de mockup não deve ser adicionado automaticamente às cenas/projeto.

---

## 14. RF4-10 — Persistência, modos e integridade dos projetos

### 14.1 Projeto salvo

- Seguir fluxo de armazenamento local existente (Dexie/IndexedDB ou equivalente), preservando IDs, nós, edges, posições, propriedades, anotações, grupos, cenas, timestamps e metadados.
- Adicionar campos novos como opcionais/defaults; versão de schema quando necessário.
- Salvar após operações de edição reais, com indicador de status correto.
- Não salvar um novo projeto só ao abrir o editor e não clonar todos os elementos visuais ao entrar no modo apresentação.

### 14.2 Playground

- Abrir sem `projectId` persistente; sem autosave, sem lista de recentes, sem métrica no dashboard.
- Não gravar dados em IndexedDB, localStorage ou sessionStorage como backup invisível do Playground (preferência UI pode ser armazenada separadamente, conforme PRD2).
- Sair/atualizar apaga o desenho efêmero. Se há alterações e navegação interna, aviso de perda quando aplicável e tecnicamente compatível com navegador.
- Exportar como JSON ou PNG sem criar projeto. Se existir opção `Salvar como projeto`, ela deve ser deliberada e explícita, não efeito colateral de exportar.

### 14.3 Regressão

- Arquivos antigos devem importar mesmo sem novos campos de zona/ícone/inspector.
- Exportações antigas devem continuar válidas ou ser migradas em uma etapa bem documentada.
- Imagens SVG de serviços não devem gerar `tainted canvas` que impossibilite exportar PNG; validar assets locais e CORS quando necessário.
- Preview e export devem representar o mesmo desenho, respeitando ordem visual e visibilidade de grupos.

---

## 15. Modelo de componentes sugerido

Adaptar nomenclatura aos módulos reais, sem criar diretórios espelhados desnecessários.

```text
EditorRoute / EditorPage
├── EditorHeader
│   ├── ProductBrand
│   ├── ProjectOrPlaygroundContext
│   └── EditorActions
├── EditorWorkspace
│   ├── ServiceCatalogPanel
│   │   ├── CatalogSearch
│   │   ├── ProviderFilterChips
│   │   ├── CategoryAccordion
│   │   └── ServiceCatalogItem
│   ├── ArchitectureCanvas
│   │   ├── CloudServiceNode
│   │   ├── GenericNode / FreeShape
│   │   ├── ProviderRegionGroup
│   │   ├── ArchitectureEdge / EdgeLabel
│   │   └── FloatingEditorToolbar
│   └── PropertiesInspector
│       ├── ServiceNodeInspector
│       ├── EdgeInspector
│       ├── GroupInspector
│       ├── ShapeInspector
│       └── NoSelectionState
└── PresentationIntegration / ScenesIntegration
```

### 15.1 Fronteiras obrigatórias

- `catalog`: dados estáticos de provedores/serviços, aliases, categorias, ícones, documentação.
- `diagram-domain`: grafo e semântica de nós, edges, grupos, cenas.
- `canvas-ui`: React Flow, gestos, posicionamento, resize, renderers e desenho livre.
- `inspector-ui`: formulários associados ao tipo de seleção.
- `project-persistence`: serialização, migração e persistência de projetos.
- `presentation`: cenas e viewports, sem duplicação de estado do grafo.

Não usar uma árvore gigante de condicionais `if (provider === ...)` no componente principal. Service registry deve ser fonte de ícones e metadados; propriedades de instância são separadas das definições de catálogo.

### 15.2 Contratos de dados orientativos

```ts
interface CatalogService {
  id: string;
  providerId: string;
  categoryId: string;
  displayName: string;
  aliases?: string[];
  iconAsset?: string;
  documentationUrl?: string;
  availableRegions?: string[];
  regionScope?: "regional" | "global" | "multi-regional" | "variable";
}

interface ArchitectureGroup {
  id: string;
  kind: "provider" | "region" | "custom";
  label: string;
  providerId?: string;
  region?: string;
  position: { x: number; y: number };
  width: number;
  height: number;
}

interface ArchitectureEdgeData {
  label?: string;
  connectionType?: string;
  direction?: "forward" | "reverse" | "bidirectional" | "none";
  notes?: string;
}
```

São exemplos de interface, **não migrações mandatórias**. Verificar schema existente e compatibilidade antes de implementar.

---

## 16. Acessibilidade e qualidade de interação

- Contraste WCAG AA para textos e controles comuns.
- Label, accessible name, tooltip e foco visível em botões de ícones.
- Navegação por teclado no catálogo e inspector; funções essenciais acessíveis sem arrastar.
- Zona/grupo identificado por nome, não só cor.
- Ícones de serviço com `alt` sem redundância quando o nome textual está lado a lado.
- Respeitar preferências de redução de movimento para fitView, microanimações, transições e flow simulation.
- Indicadores de estado como `Salvo` não dependem somente de verde.
- Fontes/ícones devem ter fallback; trabalhar offline depois de carregados conforme promessa local-first.
- Não introduzir travamento ao alterar seleções rapidamente entre vários nós.

---

## 17. Design QA: protocolo obrigatório de comparação visual

### 17.1 Condições de captura

1. Fixar viewport em **1672×941**, zoom do navegador em 100%, dispositivo DPR registrado e fonte carregada.
2. Abrir o editor em projeto de teste isolado com arquitetura **inspirada** no mockup e recursos disponíveis, sem modificar um projeto real.
3. Selecionar um nó AWS EC2 (ou serviço semelhante cadastrado) para mostrar inspector preenchido.
4. Abrir categorias e filtros do catálogo em estado visual semelhante à referência.
5. Capturar screenshot completo do viewport.
6. Comparar em paralelo com `docs/references/prd4-editor-target.png` e identificar diferenças objetivas.
7. Aplicar correções e repetir **ao menos duas vezes**.

Se o catálogo real tiver 153 serviços, o screenshot de QA também deve mostrar 153, não 437. Se a arquitetura de teste não tiver 7 provedores, não inventar componentes na base do usuário. Usar apenas fixture isolada e identificada.

### 17.2 Checklist de revisão visual

- [ ] Header: altura, marca, divider, contexto e agrupamento de ações.
- [ ] Limites de colunas: largura relativa de catálogo, canvas e inspector.
- [ ] Tipografia: tamanhos, pesos, alturas de linha, truncamento e idioma.
- [ ] Catálogo: header, busca, filtros em 3 linhas organizadas, divisória, categorias e itens.
- [ ] Scroll: catálogo, inspector e canvas não interferem entre si.
- [ ] Nós: iconografia específica, proporções, padding, seleção, labels.
- [ ] Conexões: direção, curvas, rótulos e contraste.
- [ ] Zonas: cores suaves, borda tracejada, título/região e sobreposição correta.
- [ ] Canvas: grade discreta, equilíbrio de escala e áreas de respiro apropriadas.
- [ ] Inspector: cabeçalho, dividers, labels, alturas, campos pertinentes e scroll.
- [ ] Toolbar: centrada no **canvas**, altura, alinhamento dos ícones e estado ativo.
- [ ] Foco/hover: consistência visual sem saltos de layout.
- [ ] Screenshot de apresentação: diagramas legíveis sem os painéis laterais.
- [ ] Nenhuma UI artificial que simule recurso inexistente.

### 17.3 Cenários de inspeção adicional

- Diagrama vazio, 1 nó, 6 nós/5 edges e 80 nós/120 edges.
- Só GCP; AWS + GCP; 4+ provedores reais.
- Com 0, 1 e várias zonas; zonas customizadas; nós fora das zonas.
- Sem seleção, serviço selecionado, conexão selecionada, shape selecionado e multiseleção.
- Catálogo filtrado, busca sem resultados e categorias recolhidas.
- Inspector recolhido, catálogo recolhido, ambos expandidos.
- Projeto salvo, Playground, modo apresentação e saída do modo apresentação.
- Browser em 1672×941, 1869×1011, 1440×900, 1366×768 e 1024×768.

### 17.4 Não aceitar validação superficial

Se o resultado renderizado ainda se parece estruturalmente com a primeira imagem (lista plana, inspector vazio gigante, ícones genéricos e ausência de hierarquia/zona), **não considerar concluído**, mesmo que o código compile.

---

## 18. Testes técnicos exigidos

### 18.1 Unitários (ou equivalentes na base)

- Funções de filtro de catálogo por provedor/categoria/texto e contagem distinta.
- Registry de ícones e fallback.
- Serialização/deserialização de edge, zone e configuração de node.
- Undo/redo das operações novas.
- Normalização de dados antigos sem perda.

### 18.2 Integração

- Drag item → node → inspector → edição → persistência → reabertura.
- Adicionar edge e editar label/tipo/direção; salvar e recuperar.
- Criar/editar/mover zona com filhos; reload e export preservam coordenadas.
- Alternar seleção node/edge/shape e trocar inspector corretamente.
- Export PNG e JSON com assets reais e sem erro de CORS.
- Playground sem gravar projeto no armazenamento persistente.

### 18.3 End-to-end visual e interativo

- Catálogo: buscar `BigQuery`, filtrar GCP, expandir Analytics, adicionar ao canvas.
- Selecionar EC2: exibir inspector do node; selecionar edge: trocar para inspector de conexão.
- Mover node conectado e confirmar edges acompanhando.
- Recolher catálogo e inspector, pan/zoom, depois reabrir sem danificar grafo.
- Undo/redo após mover/editar/ligar serviços.
- Entrar e sair de apresentação, preservando viewport e alterações conforme contrato existente.
- Abrir projeto legado e comparar JSON antes/depois, sem mudança involuntária.
- Verificar console sem erros/warnings novos críticos, carregamento de imagens e teclado.

### 18.4 Comandos

Executar **com `pnpm`**, conforme scripts realmente definidos no `package.json`, os testes disponíveis, lint, typecheck e build. Exemplos, somente se existirem:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm build
```

Não criar comando fictício só para relatar que executou. Documentar bloqueios reais e não ocultar falhas com `@ts-ignore`, `eslint-disable`, skips ou exclusão de testes.

---

## 19. Critérios formais de aceite (CA4)

| ID | Critério de aceitação verificável |
|---|---|
| CA4-01 | O editor em 1672×941 segue a composição da segunda imagem: header, catálogo, canvas, inspector e toolbar. |
| CA4-02 | A primeira imagem foi usada para auditoria e a segunda como referência de destino, com evidência de comparação visual. |
| CA4-03 | Header exibe marca existente em tamanho legível e o contexto correto: nome do projeto ou Playground. |
| CA4-04 | Status de salvamento é real e nunca aparece como salvo em Playground. |
| CA4-05 | Ações de undo/redo/cenas/exportar/apresentar permanecem funcionais, com contagens reais. |
| CA4-06 | Catálogo usa categorias expansíveis e sete provedores, com filtros e pesquisa combinados. |
| CA4-07 | Total de serviços exibido é o número real do registry, sem copiar `437` do mockup. |
| CA4-08 | Serviços exibem ícones oficiais específicos quando disponíveis/autorizados; fallback é identificável e não finge ser oficial. |
| CA4-09 | Não há ícones quebrados; assets necessários à exportação são resolvidos localmente com fallback seguro. |
| CA4-10 | Catálogo tem scroll independente, com cabeçalho/busca/filtros acessíveis e sem duas barras de scroll inúteis. |
| CA4-11 | Adicionar serviço por drag/drop e caminho alternativo funciona nas coordenadas corretas do canvas. |
| CA4-12 | Canvas possui grid discreto, zoom/pan corretos e não altera posições de dados ao recolher painéis. |
| CA4-13 | Nós seguem layout premium e consistente, com label e iconografia sem clipping, inclusive quando selecionados. |
| CA4-14 | Edges apresentam rótulos legíveis e setas coerentes com a direção configurada. |
| CA4-15 | Seleção de edge abre inspector de conexão; `connectionType` não é atribuído incorretamente ao node. |
| CA4-16 | Zonas/grupos (quando suportados/implementados) apresentam header, região e estilo suave com z-index correto e conteúdo movível. |
| CA4-17 | Zonas são opcionais: diagramas antigos sem zona continuam abrindo e funcionando sem conversão forçada. |
| CA4-18 | Inspector do node mostra identidade e propriedades aplicáveis, documentação e observações técnicas, sem Notas do apresentador. |
| CA4-19 | Sem seleção, inspector não exibe uma grande coluna vazia injustificada e pode ser recolhido. |
| CA4-20 | Inspector alterna corretamente entre node, edge, zona, shape, multiseleção e nada selecionado. |
| CA4-21 | Toolbar flutuante fica centrada no canvas e mantém funções existentes, sem botões decorativos. |
| CA4-22 | Ferramentas de desenho e shapes acompanham zoom/pan, undo/redo, persistência e exportação. |
| CA4-23 | Apresentação e cenas continuam funcionando e escondem ferramentas de edição quando adequado. |
| CA4-24 | Playground mantém estado transitório, não cria projeto nem afeta métricas do dashboard. |
| CA4-25 | Projetos antigos, JSON importado e PNG exportado mantêm conteúdo e identidade dos nós. |
| CA4-26 | Layout sem overflow horizontal/colisão indevida nas resoluções desktop testadas. |
| CA4-27 | Nomes, badges e labels permanecem legíveis em zoom de demonstração; tooltips e teclado têm comportamento coerente. |
| CA4-28 | 80 nós/120 edges no cenário de teste não causam falhas de interação ou bloqueio prolongado e são reportados tempos observados. |
| CA4-29 | Houve pelo menos **duas rodadas de screenshot + comparação + correções** documentadas contra a imagem-alvo em 1672×941. |
| CA4-30 | Há testes de catálogo/seleção/persistência/Playground e checagens de build/lint/types executadas via `pnpm`. |
| CA4-31 | Nenhum serviço, conexão, região, ícone oficial ou preço foi inventado como dado de produção. |
| CA4-32 | Homepage, templates e funcionalidades fora do editor permanecem funcionais, sem regressão do PRD3. |

### Definição de pronto

**Não está pronto se apenas mudar as cores e adicionar um accordion.** Considerar concluído somente quando houver (a) fidelidade visual convincente à segunda imagem, (b) controles realmente funcionais, (c) correção semântica das entidades, (d) preservação de projetos e modos, e (e) evidências de QA.

---

## 20. Plano de implementação por fatias

### Fatia A — Auditoria e base de layout

1. Ler normas, skills e PRDs, inspecionar as duas imagens.
2. Capturar screenshot atual em 1672×941 no navegador real.
3. Documentar estado da base, modelos/edges/groups e endpoints do app.
4. Refatorar apenas shell do editor, header, colunas e scroll isolado.
5. Validar visual e gestos antes de avançar.

**Saída:** layout em três colunas com proporções próximas ao mockup e sem regressões no grafo.

### Fatia B — Catálogo e ícones

1. Auditar os 153 serviços registrados (ou total atual), categorias e metadados.
2. Introduzir taxonomia normalizada e UI de seções expansíveis.
3. Integrar asset registry e ícones oficiais disponíveis/permitidos; criar fallback consistente.
4. Implementar filtros combináveis, contagens reais, estados vazios e scroll.
5. Testar DnD e performance.

**Saída:** catálogo com densidade e hierarquia próximas à referência, sem dados falsos.

### Fatia C — Canvas, nodes, edges e zonas

1. Refinar background, padding, seleção, nodes e handles.
2. Atualizar edge renderer, arrows e labels sem mudar dados reais.
3. Implementar/aprimorar zonas opcionais com grouping/resize e teste de coordenadas.
4. Conferir integração com shapes e undo/redo.
5. Capturar screenshot e corrigir problemas visuais.

**Saída:** diagrama legível, visualmente expressivo e editável.

### Fatia D — Inspector e toolbar

1. Criar seleção tipada e inspector por entidade.
2. Corrigir propriedade de edge versus node; propriedades aplicáveis por serviço.
3. Remover qualquer campo `Notas do apresentador` de elementos.
4. Refinar toolbar com agrupamentos, alinhamento e acessibilidade.
5. Testar seleção, edição, pan/zoom e export.

**Saída:** interface completa e funcional em editor padrão e Playground.

### Fatia E — QA visual, regressão e acabamento

1. Executar duas revisões com captura de 1672×941 (e resoluções secundárias).
2. Comparar áreas, tipografia, bordas, densidade, categorias, nós, zonas e inspector.
3. Corrigir todos os desalinhamentos significativos e estados de foco/scroll.
4. Testar projeto salvo, Playground, cenas, presentation e import/export.
5. Executar scripts com pnpm, revisar diff contra AGENTS/PRDs e fechar matriz de aceite.

**Saída:** produto pronto para reuniões, com relatório de evidências.

---

## 21. Entregáveis e relatório final esperado do agente

Ao concluir, apresentar obrigatoriamente:

1. **Resumo das alterações** no editor e funcionalidades preservadas.
2. **Screenshots reais em navegador:** 1672×941 com catálogo aberto/inspector selecionado; sem seleção; Playground; modo apresentação; 1366×768.
3. **Comparativo visual** com `prd4-editor-target.png` e explicações de diferenças remanescentes.
4. **Matriz CA4-01 a CA4-32** marcada como `OK`, `parcial` ou `pendente`, com evidência.
5. **Arquivos modificados**, schema/migrações e dependências (se houver).
6. **Contagem real do catálogo**, categorias e cobertura de assets oficiais/fallbacks.
7. **Skills realmente utilizadas** e como contribuíram para implementação/QA.
8. **Comandos `pnpm` executados e resultados observados**, incluindo falhas e pendências.
9. **Riscos/regressões verificados**, incluindo compatibilidade de projetos anteriores.

**Mensagem central:** a segunda imagem define **a qualidade visual e a organização** da nova tela. Os dados devem continuar **reais, editáveis, preservados e tecnicamente coerentes**. O objetivo é que um Solutions Engineer possa compartilhar a tela no Google Meet e apresentar uma arquitetura multicloud com o nível de acabamento de uma ferramenta profissional.
