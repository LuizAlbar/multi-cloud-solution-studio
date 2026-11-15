# PRD 3 — Home Page de alta fidelidade visual

**Produto:** MultiCloud Solution Studio  
**Versão:** 3.0 — evolução incremental da interface existente  
**Status:** especificação pronta para implementação  
**Idioma da aplicação:** pt-BR  
**Escopo exclusivo:** Home/Dashboard e os componentes, rotas e estados indispensáveis para seu funcionamento  
**Prioridade:** P0 — reproduzir a referência visual com qualidade de produto real  
**Referência visual obrigatória:** `docs/references/prd3-home-target.png`  
**Captura de antes (diagnóstico):** `docs/references/prd3-home-before.png`

> **ORDEM PARA O AGENTE:** a segunda imagem enviada pelo usuário, disponibilizada como `prd3-home-target.png`, é a **fonte primária da composição visual** desta tarefa. A primeira imagem (`prd3-home-before.png`) mostra o estado atual e deve ser usada apenas para diagnosticar as diferenças. Leia ambas visualmente antes de modificar o código. Não basta interpretar o conteúdo textual deste PRD; faça comparação visual da tela implementada contra a imagem-alvo.

> **Fidelidade visual ≠ copiar dados simulados.** Reproduza hierarquia, posição, composição, tipografia, dimensões, proporções, cores, densidade, microinterações e acabamento da referência. Todos os valores e projetos mostrados na aplicação final devem vir dos dados reais. Os números `12`, `8`, `46`, os nomes dos projetos e seus timestamps no mockup são exemplos, **não** dados de produção.

---

## 1. Contexto, diagnóstico e definição de sucesso

### 1.1 Estado atual observado (primeira imagem)

A página atual tem: navbar horizontal com logo muito pequena; ações `Playground`, `Templates`, `Novo Projeto` no canto direito; título `Projetos`; campo de busca; e cards básicos de projetos. Quando há um único projeto, quase toda a tela permanece vazia. O conteúdo está contido em uma coluna estreita e central, com hierarquia visual mínima. A página parece uma tela CRUD e não a entrada de uma ferramenta profissional de engenharia de soluções.

**Problemas verificáveis no estado atual:**
- A marca está visualmente pequena e pouco reconhecível.
- Não existe uma área inicial com propósito e posicionamento do produto.
- `Playground`, `Novo Projeto` e `Templates` aparecem apenas como botões da navbar, sem uma hierarquia adequada de ações de início rápido.
- Há espaço ocioso desproporcional para apenas um projeto, mas **não** se deve resolvê-lo com dados falsos.
- A seção de projetos carece de filtros contextuais, informações de serviços utilizados, ações contextuais consolidadas e melhor organização.
- Faltam os blocos visuais de templates e, quando realmente úteis, acessos recentes.
- A tipografia, a distribuição horizontal, o ritmo vertical e o acabamento de bordas são inferiores à referência aprovada.

### 1.2 Resultado esperado (segunda imagem)

A Home deve parecer um **workspace técnico de produto SaaS premium e minimalista claro**, com cinco faixas visuais distintas:

1. **Navbar:** logomarca à esquerda, navegação contextual `Início`, `Projetos`, `Templates`; ações complementares à direita **somente quando funcionais**.
2. **Boas-vindas / Hero:** pequeno eyebrow, título `MultiCloud Solution Studio`, subtítulo curto e, à direita, três indicadores reais compactos.
3. **Acesso rápido:** três cards horizontais — `Modo Playground` (destaque), `Novo Projeto`, `Explorar Templates`.
4. **Seus projetos:** título, filtros por provedor com contagens reais, busca, alternância grid/lista e cards de arquitetura elegantes.
5. **Zona inferior contextual:** `Recentes` e `Templates`, conforme haja dados e utilidade; sem duplicar informação inutilmente.

### 1.3 Objetivos mensuráveis

- Em viewport de **1672 × 941 px**, o resultado deve ser perceptivelmente fiel à imagem-alvo: mesma estrutura em faixas, hierarquia e densidade, sem inventar projetos/serviços/notificações.
- Usuário deve conseguir entrar no **Playground em um único clique** a partir de um card evidente.
- Criar projeto e iniciar por template devem ser caminhos igualmente claros.
- Projetos existentes devem ser listados corretamente e ser facilmente encontrados, abertos e gerenciados.
- O dashboard deve funcionar visualmente com **0, 1, 2, 4, 12 e 30 projetos**.
- Não quebrar editor, cenas, persistência, Playground, exportações nem projetos salvos.
- Não criar funcionalidades fingidas, estados de login falsos, indicadores estáticos ou links sem destino.

### 1.4 Não objetivos

Não redesenhar o editor ou o inspector neste PRD. Não adicionar IA, login, notificações push, colaboração, backend, sincronização cloud, gráficos estatísticos, calendário ou outros recursos só porque constam implicitamente do mockup. Não reformular o catálogo multicloud. Não substituir logo/favicons existentes nem alterar a arquitetura principal da aplicação.

---

## 2. Regras de execução para o agente de código

1. Antes de alterar código, ler integralmente: `AGENTS.md`, PRD v1, `prd2.md` e **este `prd3.md`**; identificar convenções e funcionalidades já implementadas.
2. Inspecionar ambas as imagens em `docs/references/`. Se ausentes, procurar os arquivos junto ao PRD ou solicitar que sejam copiados. **Não afirmar fidelidade à imagem sem tê-la visualizado.**
3. Usar obrigatoriamente **`pnpm`** para instalar, adicionar, remover ou atualizar packages e para executar scripts. Preservar `pnpm-lock.yaml`. Não usar npm/yarn/bun nem gerar outros lockfiles.
4. Descobrir e ler as **skills disponíveis** adequadas. Priorizar `using-agent-skills`, `frontend-design`, `frontend-ui-engineering`, `design-taste-frontend`/`ui-taste`, `shadcn`, `vercel-react-best-practices`, `incremental-implementation`, `test-driven-development`, `agent-browser`, `web-design-guidelines` e `code-review-and-quality`. Não alegar skills indisponíveis como utilizadas.
5. Inspecionar componentes, hooks, páginas, rotas, repositórios Dexie, tipos e as imagens existentes em `/assets` (ou localização real). Reutilizar componentes e serviços atuais; **não recriar o aplicativo**.
6. Preferir abstrações de UI compartilháveis apenas quando reduzirem duplicação real. Não introduzir bibliotecas só para montar a Home, quando Tailwind/shadcn/Lucide já forem suficientes.
7. Trabalhar em fatias pequenas: estrutura e design tokens → componentes de quick start → card de projeto e filtros → recentes/templates → estados/testes/QA.
8. Não editar dados reais de projetos como efeito colateral da alteração de layout. Migração só se necessária, versionada e testada.
9. Confirmar o resultado em navegador real, com screenshots e comparação do layout-alvo; não considerar `pnpm build` como validação visual.
10. Se houver conflito entre estética e verdade dos dados, **preservar dados reais** e ajustar layout condicionalmente. Se houver conflito entre este PRD e PRD 2 apenas na Home, este PRD 3 prevalece; demais regras permanecem.

---

## 3. Mapa da página e composição exata

### 3.1 Anatomia visual (de cima para baixo)

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] MultiCloud Solution Studio  │  Início  Projetos  Templates  │ [ações úteis]│
├────────────────────────────────────────────────────────────────────────────────┤
│ BEM-VINDO(A) AO                     [Projetos] [Templates] [Componentes]      │
│ MultiCloud Solution Studio                                                  │
│ Projete, conecte e visualize arquiteturas em múltiplas nuvens.              │
│                                                                              │
│ [ ▶ MODO PLAYGROUND     ] [ + NOVO PROJETO     ] [ ▦ EXPLORAR TEMPLATES    ] │
│                                                                              │
│ Seus projetos     [Todos] [Google] [AWS] [Azure] ...  [Buscar] [▦] [☷]       │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐   │
│ │  provedores          │ │  provedores          │ │  provedores          │   │
│ │  título              │ │  título              │ │  título              │   │
│ │  chips de serviços   │ │  chips de serviços   │ │  chips de serviços   │   │
│ │  data  •  conexões   │ │  data  •  conexões   │ │  data  •  conexões   │   │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘   │
│                                                                              │
│ ┌──────────── Recentes ──────────────┐ ┌──────────── Templates ───────────┐  │
│ │ lista de projetos recentes reais   │ │ cards de templates reais        │  │
│ └────────────────────────────────────┘ └──────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

O wireframe acima indica estrutura, **não** substitui a imagem-alvo. O conteúdo deve se distribuir em largura generosa, como no mockup; o layout atual concentrado numa coluna estreita não é aceitável.

### 3.2 Dimensões e grid de referência

Tomar a imagem-alvo de **1672 × 941 px** como baseline visual. Valores abaixo são metas iniciais (tolerância ajustável após teste visual, sem sacrificar fidelidade):

| Elemento | Especificação inicial |
|---|---|
| Navbar | 64 px de altura; fundo branco; borda inferior 1 px |
| Padding horizontal principal | 32–40 px em desktop largo |
| Container | `max-width: 1600px`, centralizado, com largura fluida |
| Hero | Começa ~32–40 px abaixo da navbar; duas colunas (texto + métricas) |
| Hero título | ~34–38 px, semibold/bold, entrelinha compacta |
| Eyebrow | ~12–13 px, uppercase, tracking discreto |
| Subtítulo | ~16–18 px, cor secundária |
| Tiles de indicadores | ~180–200 px largura × ~80–88 px altura, 16–20 px de gap |
| Quick actions | 3 colunas de largura semelhante; ~94–104 px de altura |
| Distância hero → quick actions | ~32–40 px |
| Seção de projetos | ~32–40 px abaixo das ações rápidas |
| Cabeçalho da seção | título ~22–24 px, filtros/busca alinhados em linha quando houver espaço |
| Cards de projetos | ~195–205 px de altura, borda leve, cantos ~12–14 px |
| Grid dos projetos | 4 colunas em telas largas; gap ~18–22 px |
| Rodapé contextual | painel `Recentes` e painel `Templates`, separados por ~20–24 px |
| Espaçamento base | escala 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 px |

**Importante:** valores são aproximações derivadas da imagem, não desculpa para renderização aproximada. Compare a posição visual das faixas e ajuste CSS conforme screenshots reais. Evite espaçamento artificial acima de 100 px entre seções importantes.

### 3.3 Responsividade obrigatória

- **≥ 1600 px:** hero horizontal com três métricas; três quick actions; até 4 cards por linha; zona inferior em duas colunas.
- **1280–1599 px:** manter três quick actions; 3 cards por linha se quatro ficarem comprimidos; filtros quebram linha com naturalidade; hero ainda horizontal quando comportar.
- **1024–1279 px:** até 2–3 cards conforme largura efetiva; tiles e controles de forma flexível; zona inferior pode empilhar.
- **768–1023 px:** 2 cards por linha; hero empilhado se necessário; quick actions em 1–2 colunas.
- **< 768 px:** 1 coluna, navegação adaptada, elementos com touch targets adequados. Dashboard deve poder ser visualizado e navegado sem overflow horizontal, embora o editor continue desktop-first.
- Em **1366 × 768**, admitir rolagem vertical na Home (não no editor), sem elementos cortados ou sobrepostos.
- Nunca usar larguras fixas que criem scroll horizontal; usar `minmax(0,1fr)` e truncamento para textos longos.

---

## 4. Design system e identidade visual

### 4.1 Personalidade

Minimalismo claro, profissional, compacto, técnico, elegante e calmo. Inspiração de interface de ferramenta de produtividade; evitar “dashboard SaaS genérico”, glassmorphism, sombras dramáticas, excesso de gradientes ou ilustrações decorativas.

### 4.2 Tokens sugeridos

```css
:root {
  --home-bg: #fbfcff;         /* cinza quase branco */
  --home-surface: #ffffff;
  --home-ink: #101828;        /* texto principal */
  --home-muted: #64748b;      /* texto secundário */
  --home-border: #e2e8f0;
  --home-border-soft: #edf0f5;
  --home-primary: #5b21f5;    /* roxo da marca; ajustar ao logo */
  --home-primary-hover: #4c16dc;
  --home-primary-soft: #f3efff;
  --home-primary-stroke: #b49bff;
  --home-focus: #6d4aff;
  --home-radius-sm: 8px;
  --home-radius-md: 12px;
  --home-radius-lg: 14px;
  --home-shadow-card: 0 2px 6px rgb(15 23 42 / 0.045);
}
```

Verificar tokens já existentes antes de introduzir novos. Cores e fontes devem se alinhar ao favicon/logo instalados em `/assets`; **não gerar uma nova marca**.

- Fonte: preferencialmente Inter (ou a fonte sans existente de boa qualidade) com escala consistente. Se adicionar fonte for necessário, documentar peso de bundle e carregamento offline.
- Texto padrão de cards 14–15 px; dados secundários 12–13 px. Evitar texto com 10 px ilegível só para caber.
- Superfícies brancas; borda 1 px cinza-claro; sombra quase imperceptível; sem borda preta pesada.
- Estados selecionados usam roxo e fundo lavanda muito suave; ícones oficiais dos provedores mantêm suas cores institucionais.
- Somente um **detalhe decorativo opcional e discreto** é permitido no hero: variação lavanda quase transparente semelhante à referência. Sem introduzir gráficos, personagens ou efeitos que distraiam.
- Respeitar `prefers-reduced-motion` e WCAG AA em texto/interações.

---

## 5. Especificação funcional por componente

### RF3-01 — Navbar global

**Visual da referência:** barra branca horizontal com ícone/wordmark maior à esquerda, divisor vertical e abas de navegação no centro-esquerda. Aba ativa `Início` destacada com fundo lavanda. Na extrema direita há ícones e avatar **no mockup**; não copiá-los se não houver funções reais.

**Implementação:**
1. Utilizar a **logo existente em `/assets`**; altura do símbolo ~38–42 px; wordmark proporcional, legível sem recortes. Se a imagem já contiver texto, não duplicá-lo em HTML. Se for apenas ícone, renderizar o nome ao lado.
2. Navegação `Início`, `Projetos`, `Templates` com ícones discretos. `Início` aponta à Home; `Projetos` rola/foca a seção de projetos ou utiliza rota real de projetos; `Templates` abre a biblioteca existente. Links nunca podem ser decorativos ou redundantes.
3. A aba ativa usa fundo `--home-primary-soft` e texto roxo escuro. Hover/focus leves; animação ≤ 160 ms.
4. Não criar campainha, foto, inicial/avatar, menus de conta ou notificações sem autenticação/recursos correspondentes. Um botão de ajuda só pode existir se abrir ajuda real (atalhos/FAQ). É aceitável que a região direita esteja vazia.
5. Não repetir na navbar os três grandes cards de `Playground`, `Novo Projeto` e `Explorar Templates`; eles já são o acesso rápido principal na Home. Manter atalhos de navegação apenas onde realmente forem úteis.
6. Navbar persistente ou sticky somente se não prejudicar a área útil nem gerar saltos de layout.

**Aceite:** logo nítida e alinhada; abas navegam; nenhuma ação fictícia; layout correto em desktop e sem overflow no mobile.

### RF3-02 — Hero / Boas-vindas

**Composição:** texto à esquerda e três tiles de indicadores à direita. Não centralizar o título no meio da tela. Hero possui altura contida e mantém separação clara da próxima faixa.

**Microcopy de referência (usar literalmente, salvo necessidade comprovada de adequação):**
- Eyebrow: `BEM-VINDO(A) AO`
- H1: `MultiCloud Solution Studio`
- Subtítulo: `Projete, conecte e visualize arquiteturas em múltiplas nuvens.`

**Indicadores:**
- Tile 1 — `Projetos`: número real de projetos persistidos, excluindo Playground.
- Tile 2 — `Templates`: número real de templates disponíveis para iniciar um projeto.
- Tile 3 — `Componentes`: soma real de nós de serviço/elementos dos projetos, ou `Conexões` se for o agregado mais bem suportado pelo modelo atual. **Usar `Diagramas` somente se existir uma entidade `diagrama` independente de `projeto`; não contar a mesma coisa duas vezes com rótulos distintos.**
- Cada tile: ícone Lucide, número em destaque ~24–28 px, rótulo secundário ~13–14 px, borda e fundo branco.
- Indicadores são derivados dos dados: atualização reativa após criar/excluir projetos, importar ou alterar conteúdo relevante. Não hardcode `12`, `8`, `46`.
- Não exibir contagens enganosas antes da hidratação do IndexedDB: mostrar skeleton discreto até leitura concluída; em base vazia mostrar `0` real.
- Os tiles não precisam ser clicáveis; se forem, direcionar à seção correspondente. Não aplicar efeito de botão a elementos não interativos.

### RF3-03 — Trio de cards de ação rápida

**A composição é obrigatória e importante para reproduzir a referência.** Mesma altura, três colunas, ícone dentro de quadrado levemente tonalizado, título forte, descrição de uma linha e affordance discreta à direita.

**Card A — `Modo Playground`:**
- Card com fundo lavanda muito claro e borda roxa suave; é a ação visualmente destacada.
- Ícone Play; título `Modo Playground`; subtítulo `Modele livremente, sem criar ou salvar um projeto.`
- Card inteiro clicável, com foco acessível e Enter/Space.
- Abre `/playground` (ou rota já implementada) imediatamente, **sem registrar projeto nem escrever em storage**, conforme PRD 2.
- Não inserir badge `Rápido` se ele não comunicar estado útil; pode ser omitido para evitar adorno.

**Card B — `Novo Projeto`:**
- Visual branco, ícone pasta com +, subtítulo `Crie um projeto salvo para organizar seus diagramas.`
- Aciona o fluxo existente de criação; não cria duplicatas por double-click.

**Card C — `Explorar Templates`:**
- Visual branco, ícone camadas/stack, subtítulo `Comece com uma arquitetura pronta e personalizável.`
- Abre a lista real de templates; se o repositório não tiver templates funcionais, corrigir esse fluxo dentro do escopo ou não anunciar uma ação sem destino.

**Interação transversal:** hover com borda sutil e leve elevação, foco visível; não escalar o card nem introduzir bounce exagerado. Respeitar teclado e toque.

### RF3-04 — Seção `Seus projetos` (estrutura e filtros)

**Linha de cabeçalho:** título `Seus projetos`, filtros-chips alinhados ao lado (quando couber), campo de busca à direita e toggle grid/lista no extremo direito. A área é visualmente semelhante à referência, sem empilhar todos os controles verticalmente em desktop.

**Fonte de dados:** exclusivamente projetos realmente salvos no IndexedDB/repositório atual. Playground não aparece. Projetos importados entram normalmente.

**Filtros por provedores:**
- Chip `Todos (N)` e chips dos provedores que realmente aparecem nos projetos (Google Cloud, AWS, Azure, OCI, Cloudflare, Hostinger, Supabase).
- Um projeto com nós GCP e AWS conta **uma vez** em cada filtro correspondente; `Todos` conta projetos distintos.
- Contadores calculados sobre a lista base de projetos, não sobre valores mockados.
- Se houver muitos filtros, usar uma linha com wrapping controlado ou seletor `Mais`, preservando acesso a todos, sem overflow horizontal.
- Não inventar categorias `Outros` quando não houver dados; `Outros` só agrupa provedores realmente presentes que não cabem na linha, com acesso via menu.
- Inicialmente um filtro de provedor ativo por vez + `Todos` (sem multiseleção até existir motivo real).

**Busca:**
- Placeholder `Buscar projetos pelo nome...`.
- Correspondência case-insensitive e accent-insensitive no nome; opcionalmente também por serviço/provedor, se implementado com testes.
- Aplicar conjuntamente com o filtro atual; usar estado local; não alterar projetos nem persistir consultas desnecessariamente.
- `Esc` limpa o input quando focado (se comportamento consistente com o app). Exibir botão de limpar somente quando houver texto.
- Resultado vazio por busca deve indicar `Nenhum projeto encontrado` e ação `Limpar filtros` — não sugerir criar projeto como única saída quando o problema é o filtro.

**Alternância grid/lista:**
- Dois controles segmentados com ícones grid e lista, `aria-label` e tooltip; ambos realmente funcionam.
- Grid é o padrão, cards visuais com até quatro por linha em desktop grande.
- Lista apresenta as mesmas informações em linhas compactas; clique, favoritar e menu devem funcionar em ambas as visualizações.
- Preferência de visualização pode ser salva como configuração de UI local, **se houver mecanismo existente**; não impacta os projetos.

**Ordenação padrão:** projetos modificados recentemente primeiro (`updatedAt` real). Se existir preferência de favoritos, favoritos podem vir à frente desde que o padrão seja consistente e documentado.

### RF3-05 — Project Card (reprodução de alta fidelidade)

Cada card deve se parecer com os cards da referência, mantendo estas regiões:

1. **Cabeçalho superior:** logotipos pequenos dos provedores presentes no projeto, sem duplicatas; ícone de favorito (estrela) no canto direito **somente se a funcionalidade for implementada de verdade**. Sem empilhar informações repetidas.
2. **Título:** 15–17 px semibold, até duas linhas, truncamento elegante e `title`/tooltip para nomes longos. Não usar `Novo Projeto de Solução` como título hardcoded; ler `project.name`.
3. **Chips de serviços:** 2–3 serviços representativos realmente presentes no grafo (ex.: BigQuery, Cloud Run, EC2), com **ícones específicos oficiais** já disponíveis no catálogo e alias curto. Se exceder o limite, exibir chip `+N`. Se projeto vazio, exibir descrição curta `Diagrama vazio`, sem inventar serviços.
4. **Divisor discreto** entre conteúdo e metadados.
5. **Rodapé:** data relativa de modificação/abertura e quantidade real de conexões, com ícone de rede correto. Menu `...` no canto direito.
6. **Ação principal:** clicar no corpo do card abre o projeto. Não exigir clicar em um minúsculo botão `Abrir` como no layout atual. Garanta que menus e estrela não disparem o evento de abrir o projeto.

**Operações do menu contextual:** `Abrir`, `Renomear`, `Duplicar`, `Exportar` (quando já existir fluxo), `Excluir`. Aproveitar handlers existentes; exclusão destrutiva exige confirmação e deve atualizar o grid e indicadores. Não deixar item do menu inertemente clicável.

**Favoritos (caso se mantenha a estrela do mockup):**
- Um favorito precisa persistir realmente no projeto; adicionar propriedade `isFavorite`/campo de preferência com migração retrocompatível se necessário.
- Não modificar dados de arquitetura por favoritar; não quebrar import/export de projetos antigos.
- Se não houver tempo para implementar e testar essa funcionalidade, **retirar a estrela do layout**, não deixar um ícone decorativo.

**Metadados:**
- Data via `Intl.DateTimeFormat('pt-BR')` / formatador relativo consistente, somente com timestamps reais.
- `5 conexões` deriva das edges efetivas, não significa número de usuários; usar ícone de conexões/network, nunca `Users`.
- Cards sem nós/conexões devem mostrar `0 componentes` / `0 conexões` honestamente, sem retângulos vazios para manter altura artificial.

**Estados de card:** hover leve, foco com ring, ação em progresso, menu aberto e projeto excluído. Não criar botões duplicados.

### RF3-06 — Painel `Recentes`

O mockup possui uma caixa inferior à esquerda com título `Recentes`, ícone de relógio, ação `Ver todos` e linhas compactas de projetos recentes.

**Regra de produto:** mostrar somente se entregar valor adicional à lista principal. Como a Home já exibe projetos ordenados por atualização, **evitar um painel com exatamente o mesmo único projeto**; com 0, 1 ou 2 projetos, ocultar ou incorporar a informação ao grid sem duplicidade. Uma condição inicial razoável é renderizar `Recentes` somente com 4+ projetos ou quando `lastOpenedAt` permitir uma seleção útil diferente do ranking principal.

Quando exibido:
- Exibir até 3–5 projetos reais com ícone de diagrama, nome truncado e tempo relativo real.
- Abrir clicando na linha; `Ver todos` foca a lista principal ou abre rota de projetos funcional.
- Se `lastOpenedAt` não existir, usar `updatedAt` e evitar alegar “último acesso” quando for “última edição”.
- Não criar dados de exemplo permanentes nem projetos para preencher o painel.

### RF3-07 — Painel `Templates`

O mockup possui uma caixa inferior à direita com título `Templates`, ícone de camadas, `Ver templates` e 3 cards menores com provedores, nome de cenário e descrição arquitetural.

**Implementação obrigatória:**
- Mostrar até três **templates realmente implementados**, priorizados pela pertinência à pré-venda (ex.: aplicação web, pipeline analítico, IA com dados empresariais); usar nomes reais do catálogo de templates instalado.
- Cada mini-card: logo de provedor ou ícones dos serviços presentes, título e subtítulo compacto com os componentes principais. Ícone de diagrama discreto opcional.
- Clicar no card deve iniciar o fluxo existente de `Usar template`/criar um novo projeto **sem modificar o template original**. Se houver visualização prévia existente, preservá-la.
- `Ver templates` abre a tela/aba de templates real. Nenhum link morto.
- Se `templates.length === 0`, não inventar cinco templates para preencher; mostrar um estado vazio útil se a biblioteca existe ou ocultar a seção se não houver funcionalidade utilizável.

**Layout inferior adaptativo:**
- Quando `Recentes` existir, dois painéis lado a lado, aproximadamente **38%/62%** ou proporção visual da referência (não necessariamente 50/50).
- Quando `Recentes` estiver oculto, `Templates` ocupa a largura disponível, com mini-cards em até três colunas; não deixar “buraco” à esquerda.
- Se houver poucos projetos e templates, preservar respiro natural, não inventar hero extra, notificações ou painéis de produtividade.

### RF3-08 — Fluxos de navegação e estado

**Rotas recomendadas** (adaptar às já existentes em vez de forçar migração):
- `/`: dashboard/home.
- `/playground`: editor efêmero do PRD 2.
- `/projects` ou âncora `#projects`: listagem de projetos, se a aplicação possuir/necessitar rota distinta.
- `/templates`: biblioteca de templates existentes.
- Rota existente para abrir um projeto persistido deve ser preservada.

**Casos críticos:**
- Clique em Playground → editor vazio, sem criação/persistência de projeto, dashboard inalterado ao retornar.
- Clique em Novo Projeto → cria/abre projeto via fluxo existente, evitando registros duplicados.
- Clique em template → projeto baseado no template, sem editar o template mestre.
- Clique no card de projeto → abre projeto correto.
- Renomear, duplicar e excluir → atualização reativa do dashboard sem necessidade de F5.
- Back/Forward do navegador mantêm navegação coerente; não deixam seleções obsoletas ou modais presos.
- Se carregar dados locais falhar, exibir erro recuperável e não falsear que a biblioteca está vazia.

---

## 6. Estados de dados — obrigatórios para não fabricar conteúdo

| Cenário | Comportamento esperado |
|---|---|
| 0 projetos, templates disponíveis | Hero + ações rápidas + indicadores reais + estado vazio de projetos + biblioteca de templates; `Recentes` oculto |
| 0 projetos, 0 templates | Hero + Playground + Novo Projeto; fluxo de templates com estado honesto; sem cards fictícios |
| 1 projeto (cenário atual real) | **Um único card real**, alinhado ao início do grid; filtros contextuais; templates abaixo em largura total; sem Recentes redundante |
| 2 projetos | Dois cards sem expansão grotesca; mesmos componentes e proporções; `Recentes` pode ficar oculto |
| 4 projetos | Quatro cards lado a lado na largura de referência, com Recentes se agregar conveniência |
| 12 projetos | Grid de 4 colunas e várias linhas; contagem real; filtros e busca funcionais |
| 30 projetos | Layout estável, rolagem vertical natural; sem renderização excessiva ou cartões sobrepostos |
| Projeto sem serviço | Sem logos falsas; `Diagrama vazio`; nós/conexões zerados |
| Projeto multicloud | Mostrar provedores sem duplicação; chips representam serviços presentes |
| Nome muito longo | Truncamento de até duas linhas sem deslocar rodapé ou quebrar grid |
| Nome duplicado | Identificação interna por ID; ações no projeto correto |
| Busca sem resultado | Mensagem `Nenhum projeto encontrado` e limpeza de filtros |
| Storage carregando | Skeleton coerente, sem piscar `0` como se fosse definitivo |
| Storage indisponível | Estado de erro explícito e possibilidade de tentar novamente |

### Regra para o mockup de referência

A imagem de exemplo contém 12 projetos e estatísticas. **O agente deve usar fixtures sintéticas somente em testes visuais isolados**, nunca gravá-las no IndexedDB do usuário, nem incluí-las no bundle como projetos reais. A Home com um projeto terá menos cards; isso é correto. O objetivo é reproduzir a **linguagem de interface** do mockup, não o volume fictício de conteúdo.

---

## 7. Componentização e integração com dados

### 7.1 Árvore conceitual sugerida

```text
HomePage
├── GlobalAppHeader
│   ├── BrandLockup
│   ├── PrimaryNavigation
│   └── RealUtilityActions (opcional)
├── HomeHero
│   ├── IntroCopy
│   └── SummaryMetrics
│       └── MetricTile × 3
├── QuickStartActions
│   └── QuickActionCard × 3
├── ProjectsSection
│   ├── ProjectsToolbar
│   │   ├── ProviderFilterChips
│   │   ├── ProjectSearch
│   │   └── ViewModeToggle
│   ├── ProjectGrid / ProjectList
│   │   └── ProjectCard / ProjectRow
│   │       ├── ProviderMarks
│   │       ├── ServiceChips
│   │       ├── ProjectMetadata
│   │       └── ProjectActionsMenu
│   └── ProjectsEmptyState / LoadingState / ErrorState
└── HomeBottomContent
    ├── RecentProjectsPanel (condicional)
    └── FeaturedTemplatesPanel (dados reais)
```

A estrutura acima é diretriz de responsabilidade, não exigência de criar um arquivo para cada linha. Verificar componentes existentes; reutilizar o que estiver correto.

### 7.2 Estado e seletores

- Ler projetos/templates **uma vez por fonte de estado** e derivar estatísticas, provedores, filtros e ordem via seletores memoizados. Evitar múltiplas queries Dexie concorrentes em componentes filhos.
- `totalProjects = projects.length` (exclui Playground).
- `totalTemplates = templates.length` (apenas templates realmente disponíveis).
- `totalComponents = sum(project.nodes.length)` ou contagem equivalentes garantida pelo schema.
- `providersInProject = unique(project.nodes.map(node → catalog.resolveProvider(node.serviceId)))`, excluindo elementos genéricos sem provedor.
- `serviceChips = unique relevant service IDs from project nodes`; contador `+N` baseado no restante real.
- `connectionsCount = project.edges.length`, respeitando o modelo de documento.
- `filteredProjects = filterByProvider(filterByText(projects))`, ordenado de modo estável.
- Evitar recalcular todo o grafo de cada projeto em cada renderização sem necessidade; criar summaries derivados/armazenados conforme a escala real e perfilamento.

### 7.3 Contratos e persistência

- Não introduzir registros de projeto diferentes do schema existente sem migração.
- Se implementar favoritos, escolher um único lugar de persistência, testar retrocompatibilidade e garantir que import/export continue íntegro.
- Actions de projeto precisam atualizar as listas e métricas reativamente.
- Imagens oficiais já incluídas pelo PRD 2: reutilizar o resolvedor de ícones e seu fallback. Não substituir ícones de serviços por logos genéricas na Home.
- Evitar chamadas externas para montar cartões/contagens. O dashboard local-first deve funcionar offline após assets disponíveis.
- Sem analytics/tracking, perfis de usuário artificiais ou chamadas a APIs de terceiros.

---

## 8. Interações, acessibilidade e acabamento

### Estados de interação

| Elemento | Hover | Focus/teclado | Clique |
|---|---|---|---|
| Abas navbar | realce discreto | ring visível + Enter | navega |
| Quick action card | borda/sombra sutis | ring + Enter/Space | abre fluxo correspondente |
| Filter chip | fundo/borda | ring + Enter | filtra projetos |
| Busca | borda destacada | focus visível | filtra em tempo real |
| Toggle grid/lista | estado selecionado | teclado + `aria-pressed` | muda visualização |
| Project card | leve realce | navegável com teclado | abre projeto |
| Estrela (se existir) | mudança visual | `aria-pressed` | persiste favorito |
| Menu `...` | realce | Escape fecha | ações reais |
| Card de template | leve realce | Enter/Space | usa/abre template |

### Regras de UX

- Não colocar elemento `<button>` dentro de outro `<button>`; o card clicável deve ser acessível com ações secundárias separadas.
- Área de clique ideal ≥ 40–44 px para controles, mesmo com visual compacto.
- Evitar dois scrolls verticais na Home; rolagem principal da página somente.
- Não esconder informações essenciais exclusivamente em hover.
- Skeletons devem refletir os blocos reais, sem shimmer agressivo.
- Estados de erro e confirmação com copy curta, específica e recuperável.
- Nenhum `cursor: pointer` em indicador não clicável.
- Transições leves (120–180 ms) e respeitar reduced motion.
- Data relativa deve ser precisa ao abrir/atualizar a página e evitar labels temporalmente incorretas.
- Ausência de templates, avatar, notificações ou favoritos não pode resultar em controles mortos.

---

## 9. Comparação visual e protocolo obrigatório de QA

**A implementação só está concluída após teste com navegador real.** Preferir `agent-browser`; se indisponível, usar alternativa real de browser automatizado com justificativa. Nunca declarar sucesso visual apenas lendo JSX/CSS.

### 9.1 Resoluções de comparação

1. **1672 × 941** — baseline da imagem-alvo; deve preservar composição geral.
2. **1920 × 1080** — validação desktop grande, sem largura excessiva nem conteúdo deslocado.
3. **1440 × 900** — laptop desktop comum.
4. **1366 × 768** — garantir compactação, rolagem vertical natural e ausência de overlap.
5. **768 × 1024** e **390 × 844** — comportamento responsivo sem overflow horizontal.

### 9.2 Estados visuais a capturar

- Home com **0 projetos**.
- Home com **1 projeto real** (cenário observado na imagem atual).
- Home com **4+ projetos em ambiente isolado de teste**, utilizando fixtures explicitamente sintéticas, sem persistência na biblioteca do usuário.
- Busca com resultados; busca vazia; filtro por provedor; modo lista.
- Menu do card aberto; hover/focus dos cards; carregamento e erro de IndexedDB.
- Home com templates disponíveis; Home sem templates (se cenário suportado).

### 9.3 Critérios de revisão visual

O agente deverá abrir lado a lado a captura atual e `prd3-home-target.png` e revisar, explicitamente:

1. Logo e texto: tamanho, proporção, alinhamento.
2. Navbar: altura, separadores, ativo/inativo e espaçamento.
3. Hero: posição, peso visual, texto, alinhamento e proporção.
4. Tiles: altura/largura, números, ícones, bordas e alinhamentos.
5. Quick cards: mesmo tamanho, destaque Playground, alinhamento e densidade.
6. Projetos: título, filtros, busca, toggle, spacing e alinhamento em grade.
7. Cards: bordas, raio, conteúdo, chips, separador, metadados e proporções.
8. Painéis inferiores: altura, distribuição e ausência de informações artificiais.
9. Coerência de cores, ícones, tipografia, sombras e espaçamentos.
10. Estados com poucos projetos: nenhuma seção inútil, nenhum bloco deslocado ou minúsculo no meio do vazio.

**Solicitação de rigor:** realizar ao menos **duas rodadas de revisão visual** com captura e correção para a resolução-alvo. Não basta renderizar uma vez e considerar pronto se a estrutura ainda estiver mais próxima da primeira imagem do que da segunda.

### 9.4 Testes funcionais

- Testar navegação, ações rápidas, search/filter/list/grid, cards, menu de projeto e templates.
- Testar CRUD existente (criar/renomear/duplicar/excluir), persistência e reatividade do dashboard.
- Testar Playground: iniciar sem registro, voltar para Home sem criar projeto, recarregar e perder estado temporário conforme PRD 2.
- Executar `pnpm` para scripts disponíveis: lint, typecheck, testes e build; não inventar comandos inexistentes.
- Inspecionar erros do console, requests de assets, foco e acessibilidade do teclado.
- Fazer revisão de código contra AGENTS.md, PRD v1/v2/v3.

---

## 10. Critérios formais de aceite (CA3)

| ID | Critério mensurável / demonstrável |
|---|---|
| CA3-01 | Home segue as **cinco faixas** da imagem-alvo: Navbar, Hero, Quick Actions, Projetos, Conteúdo inferior contextual. |
| CA3-02 | Em 1672×941, layout possui largura e densidade semelhantes à referência; não permanece uma coluna estreita central. |
| CA3-03 | Navbar usa logo existente, com abas reais `Início`, `Projetos`, `Templates`; sem botões fictícios. |
| CA3-04 | Hero exibe textos solicitados e três indicadores derivados de dados reais; sem números de mockup. |
| CA3-05 | Cards `Modo Playground`, `Novo Projeto`, `Explorar Templates` acionam fluxos reais e ficam claros na primeira dobra. |
| CA3-06 | Playground não cria/persiste projeto; voltar não altera indicadores nem lista de projetos. |
| CA3-07 | Busca encontra projetos pelo nome e combina corretamente com filtro de provedor. |
| CA3-08 | Chips mostram provedores e contagens reais, tratando multicloud sem duplicidade no total. |
| CA3-09 | Alternância grid/lista funciona de verdade e preserva dados e ações. |
| CA3-10 | Card usa nome, providers, serviços, ícones, data e número de conexões reais, sem valores mockados. |
| CA3-11 | Cards são inteiramente abríveis, com menu contextual separado e ações existentes funcionais. |
| CA3-12 | Favoritar funciona com persistência e regressão **ou** a estrela foi removida (nenhum controle inerte). |
| CA3-13 | `Templates` mostra itens reais e cada template gera fluxo funcional sem sobrescrever o original. |
| CA3-14 | `Recentes`, quando exibido, usa dados reais, é clicável e não duplica inutilmente a única entrada principal. |
| CA3-15 | Com 0, 1, 2, 4, 12, 30 projetos, o layout não inventa dados nem quebra visualmente. |
| CA3-16 | Sem overflow horizontal em 1366×768, 768×1024 e 390×844; controles utilizáveis por teclado. |
| CA3-17 | Logo/favicons e ícones existentes continuam carregando corretamente, inclusive no build. |
| CA3-18 | Projetos antigos, importação/exportação, editor, cenas e Playground continuam íntegros. |
| CA3-19 | Existem screenshots de browser comparando 1672×941 e outras resoluções; ao menos duas rodadas de ajustes visuais documentadas. |
| CA3-20 | Lint/typecheck/testes/build pertinentes executados via `pnpm`, com falhas relatadas honestamente. |
| CA3-21 | Nenhuma notificação/avatar/contador fictício, link sem destino, botão ornamental ou conteúdo inventado foi adicionado. |
| CA3-22 | Dashboard permanece totalmente local-first, sem envio automático de projetos a serviços externos. |

### Definição de pronto

**Não considerar PRD 3 concluído apenas porque a Home agora tem hero e mais cards.** A entrega precisa atingir fidelidade à referência, qualidade de interação, correspondência com dados reais, estabilidade do produto existente e evidências visuais concretas.

---

## 11. Plano de implementação em fatias

### Fatia A — Auditoria e layout-base
- Ler instruções, PRDs, skills e imagens.
- Mapear componentes existentes e dados reais.
- Implementar navbar e container fluidos; aplicar tokens de cor/tipografia.
- Capturar screenshot baseline em 1672×941.

### Fatia B — Hero + Quick Actions
- Criar hero alinhado à referência, com métricas reativas.
- Implementar trio de cards funcionais, sem CTA duplicado na navbar.
- Testar Playground, Novo Projeto, Templates.
- Capturar screenshot para verificar proporções.

### Fatia C — Projetos
- Criar toolbar de filtros/busca/toggle.
- Evoluir card com providers, chips de serviços, metadados, ações reais.
- Implementar estados 0/1/2/muitos projetos, loading e errors.
- Testar CRUD, filtros e comportamento com projetos multicloud.

### Fatia D — Painéis contextuais
- Recents baseado em dados reais, com regra antirredundância.
- Templates com mini-cards funcionais.
- Adaptar largura quando painéis estiverem ausentes.

### Fatia E — Polimento e QA
- Ajustar spacing/alinhamento/tipografia/bordas ao mockup.
- Testar resoluções, teclado, menu, erros, mobile e persistência.
- Fazer segunda rodada de screenshots e correções.
- Executar pnpm lint/typecheck/test/build conforme existente, revisar diff e reportar resultados.

---

## 12. Orientação final e formato da entrega do agente

Na conclusão, apresentar:

1. **Resumo funcional:** Navbar, Hero, Quick Actions, Projetos, Recentes, Templates e estados vazios.
2. **Capturas de tela reais:** pelo menos Home com 1 projeto em 1672×941 e Home com fixtures sintéticas em 4+ projetos, ambas identificadas; comparativo com referência.
3. **Matriz de aceite:** CA3-01 a CA3-22, com estado `OK`, `parcial` ou `pendente` e evidência.
4. **Lista de arquivos modificados**, migrações ou dependências adicionadas (se houver).
5. **Skills efetivamente utilizadas** e por quê.
6. **Comandos pnpm executados e resultados reais**.
7. **Pendências verificadas**, sem alegar conclusão de testes ou integração não realizados.

**Mensagem central para o implementador:** reproduza a **segunda imagem** com rigor visual e funcional, transformando o atual dashboard estreito em uma Home premium e útil. Não implemente uma versão genérica “inspirada” nela. Ajuste a composição às quantidades reais de projetos e templates: elegância não justifica dados inventados.
