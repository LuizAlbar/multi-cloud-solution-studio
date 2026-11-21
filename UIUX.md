# UI/UX Design System & Diretrizes de Frontend — Luiz G. Barbosa

> **Status:** Ativo / Fonte de Autoridade para Frontend, Design System e UI/UX  
> **Produto:** Publicação técnica autoral independente + Estudos de caso de arquitetura + CMS privado  
> **Assinatura Editorial:** Luiz G. Barbosa Newsletter  
> **Tema Visual:** *Warm Editorial*  
> **Linguagem da Interface:** Português Brasileiro (pt-BR), preservando termos técnicos universais em inglês quando naturais.  
> **Documentos Relacionados:** [`DESIGN.md`](./DESIGN.md) (contrato original de design), [`docs/BRAND.md`](./docs/BRAND.md) (marca e identidade), [`ARCHITECTURE.md`](./ARCHITECTURE.md) (arquitetura técnica e contratos) e [`components.json`](./components.json) (configuração do shadcn/ui).

---

## 1. Visão de Produto e Filosofia de Design

A plataforma **Luiz G. Barbosa** é uma publicação técnica autoral focada em **System Design, Software Engineering, Cloud Architecture e AI Engineering**. A interface é projetada para transmitir a sensação de uma **revista técnica independente contemporânea** com acabamento de engenharia de software de alto padrão (*Warm Editorial*).

O autor é reconhecido pelo rigor do conteúdo que publica. O site afasta-se deliberadamente de templates de portfólio genéricos, landing pages comerciais de SaaS, painéis com métricas artificiais e animações excessivas que distraem da leitura.

### 1.1 Os Três Modos de Experiência

A aplicação é dividida em três modos funcionais com intenções e dinâmicas distintas:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LUIZ G. BARBOSA (PLATAFORMA)                       │
├──────────────────────────────┬──────────────────────────────┬───────────────┤
│          1. LER              │         2. EXPLORAR          │   3. OPERAR   │
│     (Rotas de Artigos)       │    (Home, Projetos, Links)   │ (Painel /admin)│
├──────────────────────────────┼──────────────────────────────┼───────────────┤
│ • Coluna estrita (max 736px) │ • Hero assimétrico com card  │ • Densidade   │
│ • Tipografia editorial serif │ • Sidebar de tópicos e top   │ • Inter sans  │
│ • Zero animação no texto     │ • Navegação em stagger       │ • Sem inércia │
│ • Foco e leitura imersiva    │ • Transições de entrada sutis│ • Teclado e   │
│ • Progresso e sumário sticky │ • Cards com micro-elevação   │   produtividade│
└──────────────────────────────┴──────────────────────────────┴───────────────┘
```

1. **Modo LER (Público — `/artigos/[slug]`, `/projetos/[slug]`):**
   - Máxima prioridade ergonômica para textos longos, diagramas técnicos e blocos de código.
   - Coluna de leitura estrita (`--reading-width`: `46rem` / `736px`), entrelinha confortável (`1.75`), sumário sticky lateral em telas grandes e barra de progresso passiva.
   - O texto é renderizado diretamente via SSR; parágrafos nunca sofrem scroll reveal ou atrasos artificiais.
2. **Modo EXPLORAR (Público — `/`, `/artigos`, `/projetos`, `/sobre`, `/links`):**
   - Desperta curiosidade técnica por meio de composição visual assimétrica, capas e diagramas legíveis, metadados informativos e transições discretas.
   - Feed editorial com divisórias finas, listagens com animação em *stagger* de 60ms e cards de estudos de caso com elevação suave ao hover.
3. **Modo OPERAR (Privado — `/admin`):**
   - Otimizado para produtividade, densidade informacional, ergonomia de formulários e previsibilidade.
   - Interface neutra utilizando tipografia sans-serif (**Inter**) para cabeçalhos e dados, tabelas responsivas, atalhos de teclado e editor visual WYSIWYG baseado em blocos (**Plate.js**).
   - **Regra de ouro:** Nenhuma animação decorativa, sem inércia de rolagem e sem reveals de scroll que atrasem a operação editorial.

### 1.2 Princípios Não-Negociáveis de UI/UX

1. **Editorial First:** O conteúdo é o centro de gravidade absoluto — tipografia, código, diagramas Mermaid, callouts e decisões arquiteturais têm precedência visual.
2. **Zero Filler (Sem Preenchimento Artificial):** Proibido criar slogans promocionais, contadores fictícios, métricas inventadas, depoimentos falsos ou cartões decorativos sem utilidade real. Estados vazios (*Empty States*) são intencionais, elegantes e honestos.
3. **Clareza antes do Espetáculo:** Animações e transições jamais bloqueiam a leitura, o foco por teclado ou a indexabilidade por motores de busca.
4. **Uma Única Fonte de Verdade:** Qualquer elemento visual ou comportamento que se repete em duas ou mais áreas do sistema deve ser extraído para um design token, variante de componente ou utilitário compartilhado.
5. **Progressive Enhancement:** O conteúdo principal, links e diagramas textuais continuam legíveis mesmo que o JavaScript ou módulos de animação falhem.
6. **Acessibilidade Universal (WCAG AA):** Foco visível com alto contraste, proporção mínima de 4.5:1 em textos normais e 3:1 em textos grandes/UI, touch targets $\ge 44\text{px}$, suporte integral a `prefers-reduced-motion` e leitores de tela.

---

## 2. Identidade de Marca e Voz Editorial

### 2.1 Nomenclatura e Assinaturas Oficiais

| Aplicação | Nomenclatura Oficial | Localização no Produto |
|---|---|---|
| **Marca Principal (Wordmark)** | `Luiz G. Barbosa` | Header público, copyright, metadados Open Graph e JSON-LD |
| **Assinatura Editorial** | `Luiz G. Barbosa Newsletter` | Rodapé global (`site-footer`), feed RSS (`/rss.xml`) |
| **Kicker / Identificador** | `UMA PUBLICAÇÃO DE LUIZ G. BARBOSA` | Subtítulo superior em caixa alta no Hero da Home |
| **Tagline Conceitual** | `Do problema à arquitetura.` | Identidade conceitual da publicação |

### 2.2 Tom e Voz

- **Tom:** Sóbrio, pragmático, fundamentado e pessoal. Fala de engenheiro para engenheiro.
- **Microcopy:** Direta e funcional. Exemplos reais: *"Explorar artigos"*, *"Ver perfil no LinkedIn"*, *"Nesta publicação"*, *"Link copiado"*, *"Salvando…"*, *"Salvo"*.
- **Sem Jargão Comercial:** Evitar chavões como *"soluções disruptivas"*, *"líder de mercado"*, *"inscreva-se já"*.

---

## 3. Design Tokens & Sistema de Cores

O sistema utiliza a paleta **Warm Editorial**, fundamentada em tons neutros quentes de papel, superfícies claras e um acento verde profundo (*Deep Forest/Teal*), garantindo conforto visual prolongado.

### 3.1 Paleta Warm Editorial — Light Theme (Oficial / Padrão)

Centralizada em `src/app/globals.css` e mapeada no `@theme inline` do Tailwind CSS v4:

```css
:root {
  /* Cores Base */
  --background: #f7f5f0;           /* Fundo da página (calor editorial de papel) */
  --surface: #fffefb;              /* Cards, navbar, inputs, modais e painéis */
  --surface-muted: #f0eee8;        /* Estados secundários, tags neutras e footer */
  --foreground: #22282c;           /* Títulos, parágrafos e corpo principal */
  --foreground-secondary: #626d6d; /* Subtítulos, resumos e metadados */
  --foreground-muted: #77817e;     /* Textos terciários e rodapé legal */

  /* Cores de Ação e Acento */
  --primary: #176c62;              /* Links, botões primários, foco e destaques */
  --primary-hover: #11574f;        /* Estado hover de ações primárias */
  --primary-soft: #e8f1ec;         /* Chips selecionados, backgrounds sutis */
  --destructive: #a22d2d;          /* Alertas de perigo, exclusão e callout warning */

  /* Estrutura e Bordas */
  --border: #e3ded5;               /* Divisores, contornos de cards e tabelas */
  --input: #e3ded5;                /* Bordas de campos de formulário */
  --ring: #176c62;                 /* Anel de foco visível */

  /* Blocos de Código (Dark nativo para legibilidade técnica) */
  --code-background: #20272a;      /* Fundo escuro carvão para snippets */
  --code-foreground: #e9f0eb;      /* Texto de código */
}
```

### 3.2 Mapeamento Semântico para shadcn/ui & Radix UI

O arquivo `globals.css` mapeia os tokens locais diretamente para as variáveis do shadcn:

| Variável shadcn | Valor Mapeado | Uso Prático |
|---|---|---|
| `--card` / `--popover` | `var(--surface)` | Fundo de cartões, menus suspensos e diálogos |
| `--card-foreground` / `--popover-foreground` | `var(--foreground)` | Texto em superfícies elevadas |
| `--primary` / `--primary-foreground` | `var(--primary)` / `var(--surface)` | Botão primário e elementos de ênfase |
| `--secondary` / `--secondary-foreground` | `var(--surface-muted)` / `var(--foreground)` | Ações secundárias e badges neutras |
| `--muted` / `--muted-foreground` | `var(--surface-muted)` / `var(--foreground-secondary)` | Áreas desabilitadas ou de apoio |
| `--accent` / `--accent-foreground` | `var(--primary-soft)` / `var(--primary-hover)` | Destaques de seleção e hover em menus |

### 3.3 Tokens de Destaque de Sintaxe (Syntax Highlighting)

Definidos em `src/lib/markdown/prose.css` para a exibição de código via Shiki / Lowlight:

- `--syntax-comment`: `#a4b1ad` (comentários em tom suave e legível)
- `--syntax-keyword`: `#fac2a6` (palavras-chave, tags seletoras e metadados)
- `--syntax-value`: `#addec6` (strings, numerais e literais)
- `--syntax-name`: `#b8d4f2` (funções, títulos, atributos e propriedades de classes)

### 3.4 Especificação para Dark Mode (Secundário / Futuro)

O sistema possui tokens preparados para modo escuro com carvão aquecido (sem preto absoluto ou saturação excessiva), ativado pela variante `@custom-variant dark (&:is(.dark *));`:

```css
/* Especificação para ativação futura via classe .dark */
.dark {
  --background: #171d1c;
  --surface: #202826;
  --surface-muted: #29332f;
  --foreground: #f1f0e9;
  --foreground-secondary: #aeb9b3;
  --primary: #78c6af;
  --primary-soft: #263e37;
  --border: #35423d;
  --code-background: #111817;
  --code-foreground: #e9f0eb;
}
```

---

## 4. Tipografia e Ritmo Editorial

O projeto utiliza três famílias tipográficas variáveis instaladas e servidas localmente via pacotes `@fontsource-variable/*`, eliminando dependências externas de CDN e flash de texto invisível (FOIT).

### 4.1 Famílias Tipográficas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FAMÍLIAS TIPOGRÁFICAS                            │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│    Newsreader Variable   │      Inter Variable      │ JetBrains Mono Variab.│
│       (Serifada)         │       (Sans-serif)       │      (Monoespaçada)   │
├──────────────────────────┼──────────────────────────┼───────────────────────┤
│ • Títulos da publicação  │ • Texto corrido / artigos│ • Blocos de código    │
│ • Hero H1 e H2           │ • Toda a UI pública      │ • Snippets inline     │
│ • Título de artigo       │ • Cards e resumos        │ • Fonte Markdown bruta│
│ • Wordmark do Header     │ • Metadados e tabelas    │ • Linha de comandos   │
│ • Título no editor       │ • Headings no Admin      │ • Toolbars técnicas   │
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

1. **Newsreader Variable (`var(--editorial-font)`):** Tipografia serifada de alta classe editorial. Usada com rigor nos títulos editoriais (`h1`, `h2`, `h3` públicos), no wordmark e no título do documento no editor. Nunca deve ser usada em chips, botões, inputs ou tabelas.
2. **Inter Variable (`var(--interface-font)`):** Sans-serif neutra com excelente legibilidade em corpos de texto, metadados e toda a interface de controles. No CMS Admin, é utilizada inclusive nos cabeçalhos (`h1`, `h2`) para reforçar o caráter utilitário da ferramenta.
3. **JetBrains Mono Variable (`var(--code-font)`):** Monospaçada com ligaduras claras, proporção precisa de caracteres e legibilidade em snippets técnicos e fontes de diagramas.

### 4.2 Escala Tipográfica Fluida

A tipografia pública adota funções `clamp()` responsivas para garantir transições suaves entre telas compactas e monitores ultrawide:

| Nível / Papel | Expressão CSS | Escala Aproximada | Família | Entrelinha / Rastreio |
|---|---|---|---|---|
| **Hero H1** | `clamp(2.25rem, 4.25vw, 3.875rem)` | 36px $\rightarrow$ 62px | Newsreader | `1.01` / `-0.038em` |
| **Título de Artigo (H1)** | `clamp(2.125rem, 5vw, 3.5rem)` | 34px $\rightarrow$ 56px | Newsreader | `1.02` / `-0.025em` |
| **Page Intro H1** | `clamp(2.125rem, 4vw, 2.75rem)` | 34px $\rightarrow$ 44px | Newsreader | `1.08` / `-0.025em` |
| **Heading H2** | `clamp(1.5rem, 3vw, 2rem)` | 24px $\rightarrow$ 32px | Newsreader | `1.20` / `-0.018em` |
| **Heading H3** | `clamp(1.375rem, 2.1vw, 1.625rem)` | 22px $\rightarrow$ 26px | Newsreader | `1.25` / normal |
| **Título de Card** | `clamp(1.1875rem, 1.85vw, 1.4375rem)` | 19px $\rightarrow$ 23px | Newsreader | `1.25` / normal |
| **Texto de Artigo (Prose)** | `clamp(1.0625rem, 1.4vw, 1.125rem)` | 17px $\rightarrow$ 18px | Inter | `1.75` / normal |
| **Lead / Resumo Destaque** | `clamp(0.9375rem, 1.5vw, 1.0625rem)` | 15px $\rightarrow$ 17px | Inter | `1.60` / normal |
| **Texto de UI / Parágrafo Geral**| `0.875rem` | 14px | Inter | `1.60` / normal |
| **Metadados / Badges** | `0.8125rem` | 13px | Inter | `1.40` / `0.01em` |
| **Código em Bloco** | `0.8125rem` | 13px | JetBrains Mono | `1.65` / normal |

---

## 5. Espaçamento, Grid e Sistema de Superfícies

### 5.1 Escala de Espaçamento Base

O sistema de espaçamento segue uma escala baseada em múltiplos intencionais de 4px e 8px:

```
--space-xs:  0.25rem;  /*  4px - Ajustes mínimos, micro-gaps */
--space-sm:  0.50rem;  /*  8px - Gaps de botões, tags, paddings internos */
--space-md:  0.75rem;  /* 12px - Espaçamentos de controles e células */
--space-lg:  1.00rem;  /* 16px - Padding de cards, margens de texto */
--space-xl:  1.50rem;  /* 24px - Separação de seções menores, paddings de painéis */
--space-2xl: 2.00rem;  /* 32px - Respiração entre blocos editoriais */
--space-3xl: 3.00rem;  /* 48px - Margens verticais de seções principais */
--space-4xl: 4.00rem;  /* 64px - Gaps amplos de hero e layouts abertos */
--space-5xl: 5.00rem;  /* 80px - Espaçamento de grandes divisões */
```

### 5.2 Limites de Contêiner e Largura de Leitura

- **Contêiner Público Global (`--container-width`):** `83rem` (1328px).
- **Coluna de Leitura Ótima (`--reading-width`):** `46rem` (736px). Impede que linhas de texto fiquem excessivamente longas, mantendo a média ideal de 65 a 80 caracteres por linha.
- **Margens Fluídas Laterais (`--gutter`):** `clamp(1.25rem, 3vw, 2.25rem)`.
- **Altura do Cabeçalho (`--header-height`):** `4rem` (64px).

### 5.3 Raios de Borda (`border-radius`)

- **Cartões e Painéis (`--radius`):** `0.75rem` (12px) — Superfícies amplas de destaque.
- **Controles Interativos (`--radius-control`):** `0.625rem` (10px) — Botões, inputs, selects e chips.
- **Micro-elementos (`--radius-sm`):** `calc(var(--radius) * 0.6)` (~7px) — Badges, códigos inline e tooltips.
- **Elementos Intermediários (`--radius-md`):** `calc(var(--radius) * 0.8)` (~9.6px) — Itens de menu e thumbnails.
- **Superfícies de Diálogo (`--radius-xl`):** `calc(var(--radius) * 1.4)` (~17px) — Modais e caixas de confirmação.

### 5.4 Sistema de Elevação e Sombras

O sistema evita gradientes pesados e sombras opacas em favor de elevações sutis que utilizam `color-mix` no sRGB com a cor do primeiro plano:

- **Sombra de Superfície em Repouso (`--shadow-surface`):**
  `0 4px 14px color-mix(in srgb, var(--foreground) 4%, transparent)`
- **Sombra Elevada / Hover (`--shadow-raised`):**
  `0 8px 24px color-mix(in srgb, var(--foreground) 9%, transparent)`

### 5.5 Composição de Camadas (Layered Surfaces)

```
Nível 0: Fundo da Página (Canvas)     ───>  --background (#F7F5F0)
Nível 1: Superfície Primária (Cards)  ───>  --surface (#FFFEFB) + border 1px (#E3DED5)
Nível 2: Apoio / Células Secundárias  ───>  --surface-muted (#F0EEE8)
Nível 3: Modais e Menus Flutuantes    ───>  --surface + --shadow-raised + backdrop-blur
```

---

## 6. Motion Design e Arquitetura de Microinterações

O sistema de animações foi concebido com responsabilidade visual restrita: **prover ritmo e feedback táctil sem atrasar a navegação ou ocultar o conteúdo**.

### 6.1 Matriz de Tokens de Movimento

```css
--motion-fast: 160ms;              /* Feedback de botões, hovers, foco, checkboxes */
--motion-standard: 210ms;          /* Transições de cards, menus e navbar */
--motion-slow: 320ms;              /* Efeitos elaborados e zoom de imagem */
--motion-page: 240ms;              /* Transições de entrada de página */
--motion-reveal: 500ms;            /* Revelação de seções ao rolar a página */
--motion-stagger: 60ms;            /* Intervalo sequencial entre itens de listas */
--motion-hero-offset: 8px;         /* Deslocamento vertical inicial no hero */
--motion-reveal-offset: 16px;      /* Deslocamento vertical padrão em reveals */
--motion-card-offset: -3px;        /* Elevação vertical no hover do card */
--motion-image-scale: 1.03;        /* Zoom sutil em capas e thumbnails */
--motion-ease-out: cubic-bezier(0.22, 1, 0.36, 1); /* Curva suave de desaceleração */
```

### 6.2 Divisão de Responsabilidades Técnicas

| Mecanismo | Onde Utilizar | Onde NÃO Utilizar |
|---|---|---|
| **CSS Transitions / Keyframes** | Hover de links, elevação de cards, foco, fade da navbar sticky, abertura do menu mobile | Animações sequenciais que dependem de viewport |
| **Motion for React (`motion/mini`)** | Componentes `<Reveal>` e `<StaggerGroup>` ao entrarem na viewport | Parágrafos de artigos, tabelas do CMS, painel admin |
| **IntersectionObserver Nativo** | Detecção de rolagem para ativar estilo da navbar e disparar animações de entrada | Mudanças de estado de layout de alta frequência |

### 6.3 Especificações de Microinterações

1. **Scroll Reveal (`<Reveal>`):**
   - Transição de `opacity: 0.45` $\rightarrow$ `1` e `translateY(16px)` $\rightarrow$ `0` em 500ms com curva `--motion-ease-out`.
   - Disparado apenas uma vez quando o elemento atinge 12% da viewport (`threshold: 0.12`).
   - Aplicado exclusivamente a blocos editoriais estratégicos (hero copy, card do studio, cabeçalhos de seção, caixas de contato da sidebar).
2. **Stagger de Listas (`<StaggerGroup>`):**
   - Intervalo de `60ms` aplicado de forma sequencial nos primeiros 6 elementos visíveis (`targets.slice(0, 6)`), evitando atrasos excessivos em listagens extensas.
3. **Card Hover & Image Zoom:**
   - O card eleva-se suavemente `translateY(-3px)` enquanto a borda adquire tom acentuado e a sombra transiciona para `--shadow-raised` em 210ms.
   - A imagem interna sofre um zoom suave de 3% (`scale(1.03)`) contido em `overflow: hidden`.
4. **Header Sticky com Efeito Vidro:**
   - Detectado por um elemento sentinela no topo (`.header-sentinel`). Ao rolar, adiciona o atributo `data-scrolled`.
   - Aplica fundo translúcido `color-mix(in srgb, var(--surface) 88%, transparent)` com `backdrop-filter: blur(10px)` e borda inferior sutil.
5. **Barra de Progresso de Leitura (`ReadingProgress`):**
   - Elemento `<progress>` nativo posicionado imediatamente abaixo da navbar (`height: 3px`).
   - Atualizado passivamente em loop de `requestAnimationFrame` ligado ao `ResizeObserver` do artigo.
6. **Sublinhado Animado na Navegação:**
   - Pseudo-elemento `::after` com escala horizontal partindo de `0.45` para `1.0` no link ativo (`aria-current`), conferindo elegância ao traço tipográfico.
7. **Respeito Estrito a `prefers-reduced-motion`:**
   - Todas as animações do Motion são canceladas e limpas via listener de mídia.
   - Em CSS, as transições e transformações são anuladas, apresentando o conteúdo de forma estática e instantânea.

---

## 7. Catálogo de Componentes e Padrões de UI

O sistema integra primitivas do **shadcn/ui** (estilo Radix Nova) personalizadas através de design tokens próprios.

### 7.1 Componentes de Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SISTEMA DE COMPONENTES                             │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│          Layout          │         Conteúdo         │       Interação       │
├──────────────────────────┼──────────────────────────┼───────────────────────┤
│ • SiteHeader (sticky)    │ • ContentCard (hover)    │ • Button (CVA)        │
│ • SiteFooter (3 colunas) │ • ContentGrid (stagger)  │ • ShareMenu (Sonner)  │
│ • PageIntro              │ • ContentReading (TOC)   │ • Dialog / AlertDial. │
│ • ContactLinks           │ • RecentPosts / TopPosts │ • ArticleFilters      │
│ • LinkDestination        │ • EditorialCallout       │ • PlateBlockEditor    │
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

#### `SiteHeader` (`src/app/(public)/site-nav.tsx`)
- Navbar responsiva contendo o wordmark editorial em Newsreader, links de navegação (`Artigos`, `Projetos`, `Sobre`, `Links`), botão de compartilhamento da página e menu mobile inteligente baseado em `<details>` acessível.
- Efeito sticky com detecção por sentinela e desfoque fosco ao rolar.

#### `SiteFooter` (`src/components/layout/site-footer.tsx`)
- Estrutura de três colunas:
  1. **Identidade Editorial:** Wordmark *Luiz G. Barbosa Newsletter* e descrição do escopo técnico.
  2. **Navegação:** Links internos e atalho para o *Studio* (quando configurado).
  3. **Conectar:** Links diretos de e-mail, LinkedIn e GitHub oficial.
- Barra inferior legal com copyright dinâmico e link com ícone da Lucide apontando para `/rss.xml`.

#### `PageIntro` (`src/components/layout/page-intro.tsx`)
- Cabeçalho padronizado para páginas internas, contendo título H1 em Newsreader, descrição opcional em `--text-lead` e divisor inferior.

#### `LinkDestination` (`src/components/layout/link-destination.tsx`)
- Abstração central para links internos (via `next/link`) e externos (`target="_blank"` e `rel="noopener noreferrer"` automáticos), garantindo consistência sem repetição de lógica.

### 7.2 Componentes de Conteúdo e Leitura

#### `ContentCard` & `ContentGrid` (`src/features/content/components/content-grid.tsx`)
- Cartão editorial com suporte a layout de grade (`content-grid`) e arquivo horizontal amplo (`content-archive`).
- Metadados semânticos: tópico/categoria clicável, título com âncora expandida, excerto, data formatada em pt-BR e menu contextual de compartilhamento.

#### `ContentReading` (`src/features/content/components/content-reading.tsx`)
- Renderizador de leitura técnica de alta densidade.
- Cabeçalho com link de retorno, metadados (tempo de leitura, autor, data, tópicos), imagem de capa otimizada, sumário embutido (mobile) e sumário lateral sticky (desktop).
- Seção de publicações relacionadas ao final da leitura quando houver correspondência de tópicos.

#### `TableOfContents`
- Índice gerado dinamicamente a partir dos cabeçalhos Markdown (`h2`, `h3`, `h4`).
- Alinhamento sticky a `calc(var(--header-height) + 2rem)`, com scroll interno independente caso o índice exceda a altura da janela.

### 7.3 Componentes de Markdown e Artigo Técnico

Implementados em `src/lib/markdown/prose.css`:

#### Blocos de Código (`.code-block`)
- Fundo escuro `--code-background` com tipografia JetBrains Mono.
- Barra superior de ferramentas (`.code-toolbar`) indicando a linguagem do snippet e botão de cópia de link/código com feedback via Toast Sonner.
- Barra de rolagem horizontal acessível e foco demarcado no contêiner.

#### Callouts Editoriais (`.editorial-callout`)
- Suportam quatro tonalidades semânticas mapeadas via sintaxe `[!TIPO]`:
  - `[!INFO]` $\rightarrow$ "Informação" (borda neutra, título em `--primary`)
  - `[!NOTE]` $\rightarrow$ "Nota técnica" (borda neutra, título em `--primary`)
  - `[!TIP]` $\rightarrow$ "Dica" (borda neutra, título em `--primary`)
  - `[!WARNING]` $\rightarrow$ "Atenção" (borda neutra, título em `--destructive`)

#### Diagramas Mermaid (`.editorial-mermaid`)
- Renderização isolada em iframe sandbox ou renderizador SVG, mantendo fundo claro, legibilidade total de texto e visualização técnica harmonizada com a página.

#### Tabelas Técnicas (`.prose-table`)
- Contêiner scrollável com `role="region"`, `aria-label="Tabela"` e `tabIndex={0}` para navegação acessível por teclado. Cabeçalhos com fundo `--surface-muted` e bordas finas.

### 7.4 Componentes de Interação e Feedback

#### `Button` (`src/components/ui/button.tsx`)
- Construído com `class-variance-authority` (CVA) e Radix Slot.
- Variantes: `default` (verde primário), `outline` (borda do sistema), `secondary` (superfície muted), `ghost` (sem fundo, hover sutil), `destructive` (fundo avermelhado de alerta) e `link`.
- Altura e hit-area mínima calibradas para toque e teclado (`min-block-size: 2.75rem` em botões editoriais).

#### `ShareMenu` (`src/components/layout/share-menu.tsx`)
- Menu suspenso flutuante construído com Radix DropdownMenu e ícones da Lucide.
- Permite copiar o link direto, disparar o compartilhamento nativo do dispositivo móvel (Web Share API) e abrir links de compartilhamento no LinkedIn, X e E-mail.

#### Diálogos e Modais (`Dialog` e `AlertDialog`)
- Compartilham as classes de superfície padronizadas `.feedback-overlay` e `.feedback-surface`.
- Efeito de escala suave (`0.98` $\rightarrow$ `1.0`) e fade no aparecimento, fechamento com `Escape`, clique externo e aprisionamento estrito de foco (*focus trap*).

#### Notificações (`Toaster` / `Sonner`)
- Instância do Sonner personalizada com cores de `--popover`, borda `--border`, ícones consistentes de sucesso, erro, aviso e carregamento, posicionada no canto inferior direito.

---

## 8. Padrões de UX por Área da Aplicação

### 8.1 Home (`/`) — Revista Técnica Autoral

- **Hero Editorial Assimétrico:** Composição em duas colunas (70%/30% em telas largas). À esquerda, o kicker oficial, o título principal em Newsreader destacando o propósito da publicação e o botão de ação. À direita, o card interativo do **MultiCloud Solution Studio** com proporção preservada da screenshot da interface.
- **Seção Posts Recentes:** Feed editorial reunindo os últimos artigos publicados com divisórias horizontais, tempo de leitura estimado e botão de compartilhamento.
- **Sidebar Editorial:**
  - *Top Posts:* Seleção curada dos artigos mais relevantes.
  - *Por Assunto:* Lista de tópicos técnicos cadastrados.
  - *LinkedIn:* Card com convite direto para acompanhamento profissional.
- **Resiliência a Banco Vazio:** Se não houver artigos cadastrados, apresenta um empty state sóbrio convidando o leitor a assinar o feed RSS, mantendo o layout equilibrado.

### 8.2 Arquivo de Artigos (`/artigos`) e Tópicos (`/topicos/[slug]`)

- **Barra de Filtros Integrada (`ArticleFilters`):**
  - Campo de busca textual por palavra-chave.
  - Seletor de tópicos cadastrados.
  - Seletor de ordenação (*Mais recentes* / *Mais antigos*).
- **Paginação Preservativa:** Navegação de páginas (*Anterior* / *Próxima*) que preserva parâmetros de busca e ordenação na URL e move o scroll para `#resultados`.
- **Exibição em Arquivo Amplo (`.content-archive`):** Cards em linha horizontal em telas largas, com capa ao lado do texto e metadados completos.

### 8.3 Projetos e Estudos de Caso (`/projetos` e `/projetos/[slug]`)

- **Estrutura de Case Study:** Diferente de um portfólio visual superficial, os projetos são apresentados com foco em engenharia: o problema de negócio, as restrições arquiteturais, a escolha da stack, os trade-offs e os links para repositório GitHub e demonstração ao vivo.

### 8.4 Diretório de Links (`/links`)

- Destinos agrupados por categorias definidas no CMS (ex.: *Profissional*, *Publicações*, *Ferramentas*).
- Quando o MultiCloud Solution Studio está configurado, ele recebe destaque especial na categoria Ferramentas.
- Diferenciação visual e acessível imediata entre links internos (seta para direita `ArrowRight`) e links externos (seta diagonal `ArrowUpRight` com aviso sonoro para leitores de tela).

### 8.5 Página Sobre (`/sobre`)

- Apresentação pessoal e técnica autoral sobre as motivações da publicação.
- Destaque para os canais de contato reais e validados:
  - **E-mail:** `mailto:luizgustavo.ab@hotmail.com` (botão primário)
  - **LinkedIn:** `https://www.linkedin.com/in/luizgustavoab/` (botão outline com abertura em nova aba)

### 8.6 Painel Administrativo (`/admin`)

- **Layout e Shell:** Barra lateral fixa (`.admin-sidebar`) com links de navegação (`Visão Geral`, `Posts`, `Mídia`, `Links`, `Configurações`), atalho para visualização pública e ação de logout com confirmação.
- **Tipografia:** Usa **Inter** nos títulos, estabelecendo uma clara distinção mental entre a atmosfera da revista pública e o ambiente operacional do CMS.
- **Editor Visual por Blocos (Plate.js):**
  - Título editorial amplo em Newsreader com redimensionamento automático de campo (`field-sizing: content`).
  - Blocos de parágrafos, cabeçalhos, citações, callouts, blocos de código com linguagem selecionável, tabelas e imagens.
  - Menu de comandos via barra `/` e botão flutuante de inserção de blocos.
  - Alça lateral de arraste (*drag and drop*) no desktop e controles táteis em dispositivos móveis.
  - Barra de ferramentas flutuante para formatação inline (negrito, itálico, código, link).
  - Inserção de imagens diretamente no ponto do cursor, com campos integrados para texto alternativo (*alt*) e legenda (*caption*).
  - Três modos de visualização acessíveis por abas: **Visual**, **Markdown** bruto e **Prévia** fiel ao renderizador público.
- **Mecanismos de Segurança de Dados:**
  - *Autosave Inteligente:* Salva rascunhos automaticamente após pausa de 2,5 segundos de digitação, com indicador de estado real (*Salvando…*, *Salvo*, *Falha ao salvar*).
  - *Prevenção de Perda de Dados:* Alerta de saída acionado caso haja edições não salvas ao tentar mudar de rota ou fechar a aba.
  - *Recuperação em Sessão:* Backup contínuo em `sessionStorage` para restaurar o rascunho em caso de fechamento acidental do navegador.
- **Biblioteca de Mídia (`/admin/midia`):**
  - Upload de imagens com validação estrita de tipos MIME (JPEG, PNG, WebP, AVIF, SVG), extração de dimensões reais e visualização compacta em grade/linhas.
  - Prevenção de quebra de layout com exclusão protegida.

---

## 9. Responsividade, Ergonomia e Acessibilidade

### 9.1 Matriz de Breakpoints

Os layouts utilizam breakpoints fluídos fundamentados no conteúdo real:

| Breakpoint | Medida | Comportamento Principal |
|---|---|---|
| **Mobile Compacto** | $\le 42\text{rem}$ ($672\text{px}$) | Menu mobile em `<details>`, rodapé em 2 colunas, ações empilhadas |
| **Tablet Vertical** | $\le 48\text{rem}$ ($768\text{px}$) | Layout de Sobre em 1 coluna, tabelas admin compactadas |
| **Tablet / Telas Médias**| $\le 50\text{rem}$ ($800\text{px}$) | Hero em 1 coluna, studio feature abaixo da cópia |
| **Desktop Padrão** | $\ge 60\text{rem}$ ($960\text{px}$) | Grid editorial 70%/30% ativo (Home e Arquivo com Sidebar) |
| **Desktop Amplo** | $\ge 64\text{rem}$ ($1024\text{px}$) | Sumário de artigo (*TOC*) fixado na lateral direita |
| **Wide Screen** | $\ge 70\text{rem}$ ($1120\text{px}$) | Card do Studio expande para largura ideal de 32rem |

### 9.2 Requisitos de Acessibilidade (WCAG AA)

1. **Skip Links Operáveis:**
   - Na aplicação pública: `.skip-link` direcionando para `#conteudo`.
   - No painel administrativo: `.admin-skip` direcionando para `#painel-conteudo`.
   - Visíveis imediatamente ao receber foco por teclado (`Tab`).
2. **Anel de Foco Visível (`:focus-visible`):**
   - Todos os elementos interativos possuem contorno nítido de 2px na cor `--ring` (`#176C62`) com recuo de 2px a 3px (`outline-offset: 3px`).
3. **Áreas de Toque Confortáveis (Touch Targets):**
   - Comandos principais, botões de ação e itens de menu possuem altura mínima recomendada de $44\text{px}$ (`min-height: 2.75rem`).
4. **Leitores de Tela e Semântica:**
   - Uso de tags HTML5 puras: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`, `<time>`, `<progress>`.
   - Links que abrem nova aba contêm `<span class="sr-only">, abre em nova aba</span>`.
   - Ícones puramente visuais recebem `aria-hidden="true"`.
5. **Ajuste de Zoom de 200%:**
   - Todos os contêineres e textos utilizam unidades relativas (`rem`, `ch`, `%`, `vw`), suportando ampliação de até 200% sem perda de conteúdo ou sobreposição de caixas.

### 9.3 Metas de Performance Visual (Core Web Vitals)

- **LCP (Largest Contentful Paint):** $\le 2.5\text{s}$ no 75º percentil. A imagem do hero e as fontes críticas possuem pré-carregamento nativo; capas de artigos no topo usam `loading="eager"`.
- **CLS (Cumulative Layout Shift):** $\le 0.1$. Todas as imagens possuem dimensões de aspecto reservadas (`aspect-ratio` ou `width`/`height` explícitos); esqueletos de carregamento espelham as proporções reais.
- **INP (Interaction to Next Paint):** $\le 200\text{ms}$. Efeitos de animação leves processados via GPU (`transform`, `opacity`), sem loops de JavaScript bloqueantes na thread principal.

---

## 10. Checklist de Aceite e Garantia de Qualidade de UI/UX

Ao propor, implementar ou revisar qualquer tela, fluxo ou componente, utilize este checklist de auditoria visual:

- [ ] **Aderência aos Tokens:** Nenhuma cor hexadecimal arbitrária espalhada nos arquivos de estilo; todas as variáveis utilizam tokens semânticos de `globals.css`.
- [ ] **Consistência Tipográfica:** Newsreader em títulos editoriais e Inter em elementos de UI e parágrafos; JetBrains Mono em códigos.
- [ ] **Zero Filler:** Ausência de métricas falsas, artigos inventados ou textos promocionais genéricos.
- [ ] **Validação em Browser Real:** Testado em resoluções mobile ($390\text{px}$), tablet ($768\text{px}$) e desktop ($1366\text{px}$ e $1440\text{px}$).
- [ ] **Teclado e Foco:** Todos os fluxos operáveis exclusivamente via teclado (`Tab`, `Enter`, `Space`, `Escape`), com indicador visual evidente.
- [ ] **Prefers-Reduced-Motion:** Interface testada com preferência de movimento reduzido ativada, sem transições ou deslocamentos verticais perceptíveis.
- [ ] **Feedback de Estado:** Estados de carregamento, vazio, erro e sucesso implementados com microcopy honesta e funcional.
- [ ] **Leitura Técnica:** Artigos com coluna máxima de 736px, código escuro com botão copiar funcional, diagramas legíveis e sumário sincronizado.
- [ ] **Links Externos Seguros:** Links externos abrem em nova aba com `rel="noopener noreferrer"`, ícone `ArrowUpRight` e texto acessível oculto.
- [ ] **Painel Admin Ergonomico:** Sem inércia de rolagem artificial, com autosave real, feedback claro de salvamento e proteção contra descarte acidental de alterações.
