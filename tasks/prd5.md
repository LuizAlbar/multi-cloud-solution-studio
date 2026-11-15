# PRD 5 — MCSS Diagram Format: linguagem JSON, importação assistida e kit de documentação para IA

**Produto:** MultiCloud Solution Studio  
**Versão:** PRD 5.0 — contrato aberto de diagramas e interoperabilidade com IAs externas  
**Status:** especificação para implementação incremental  
**Data de referência:** 15/11/2026  
**Idioma da interface e documentação:** português brasileiro (pt-BR); identificadores técnicos e arquivos podem usar inglês  
**Escopo:** formato `.mcss.json`, exportação, importação por colagem/arquivo, validação, visualização prévia, documentação exportável e sincronização automática da documentação com o código  
**Prioridade:** P0 para contrato, importação/exportação, segurança, documentação e testes; P1 para polimento e ergonomia adicionais  
**Fora do escopo:** IA embutida no aplicativo, geração automática por API, integração com contas cloud, custos calculados, execução/provisionamento de infraestrutura, validação de viabilidade arquitetural real.

> **MANDATO PARA O AGENTE:** implementar o PRD 5 sobre o código real existente, sem refazer o editor nem alterar silenciosamente a persistência de projetos. Antes de codificar, ler `AGENTS.md`, o PRD original, `prd2.md`, `prd3.md` e `prd4.md`; mapear a estrutura efetiva do catálogo, os tipos de nós/arestas, o sistema de cenas, as ferramentas livres, a persistência, a exportação JSON existente e a semântica do Playground. A estrutura do documento abaixo é o **contrato-alvo proposto**; reconciliar com o modelo atual mediante adaptadores e migrações compatíveis, nunca por suposições que prejudiquem diagramas já salvos.

---

## 1. Visão de produto

### 1.1 Problema a resolver

Atualmente é possível construir uma arquitetura manualmente no canvas, mas o Solutions Engineer deseja:

1. Receber um BANT, briefing ou documento de requisitos de um cliente.
2. Enviar esse contexto a uma IA externa de sua preferência, junto a uma **documentação oficial do próprio Studio**.
3. Pedir que a IA devolva um **JSON de arquitetura compatível** com os serviços disponíveis no catálogo.
4. Colar esse JSON ou anexar um arquivo e obter um **diagrama real, editável e apresentável**.
5. Ajustar a arquitetura visualmente em reunião, salvar como projeto se desejar e exportar novamente para continuar a evolução.

A documentação precisa permanecer correta mesmo após o catálogo ganhar novos serviços, nomes, propriedades, tipos de nós ou novas versões do formato. **Não é aceitável um manual escrito uma vez e abandonado.**

### 1.2 Proposta

Criar o **MCSS Diagram Format**, identificado no arquivo por `format: "mcss.diagram"`, como representação semântica, versionada e independente da implementação interna do React Flow.

- **Formato humano e máquina:** JSON estrito com schema público verificável e exemplos.
- **Catálogo como fonte da verdade:** os nomes e `serviceId`s válidos vêm do registro real do Studio, não de uma lista reescrita manualmente no guia.
- **Importação confiável:** colar/upload → verificar → exibir erros/avisos → pré-visualizar → confirmar importação.
- **Documentação transportável:** botão na interface para baixar um *Kit para IA*, com guia, catálogo, JSON Schema, exemplos e prompt reutilizável.
- **Evolução controlada:** documentação e artefatos gerados são testados quanto a divergências em CI e atualizados na mesma mudança de código que altera o contrato.

### 1.3 Sucesso no uso real

Um usuário deve conseguir pegar o BANT de um cenário multicloud, obter um arquivo JSON de uma IA e importar a arquitetura em poucos passos, **sem modificar código, sem consultar estrutura interna do banco e sem copiar manualmente serviços para o canvas**.

### 1.4 Princípios não negociáveis

1. **Contrato público ≠ snapshot do React Flow.** Não expor dependência estrutural de `ReactFlowJsonObject`, hooks, handlers, DOM, funções ou classes internas como protocolo de IA.
2. **Documentação nasce do código.** Guia, schema e catálogo são artefatos derivados de fontes canônicas.
3. **Nenhuma mutação antes da confirmação.** Prévia deve ser isolada do projeto existente.
4. **Transparência de compatibilidade.** Diferenciar erros que bloqueiam de avisos que admitem fallback.
5. **Local-first.** Colar/importar/validar/exportar deve funcionar sem login, backend, internet ou token.
6. **Diagramas não equivalem a infra válida.** A visualização de um vínculo entre serviços não certifica conectividade, segurança, capacidade ou aderência ao produto.
7. **Importação da IA não exige IA integrada.** O aplicativo recebe apenas JSON fornecido explicitamente pelo usuário.

---

## 2. Personas e jornadas

### 2.1 Persona principal

**Solutions Engineer** que realiza discovery técnico-comercial e apresenta arquiteturas Google Cloud, AWS, Azure, OCI, Cloudflare, Hostinger e Supabase em reuniões com clientes.

### 2.2 Jornada A — BANT → IA → diagrama salvo

1. Usuário abre o Studio e acessa **Exportar → Kit para IA** (ou **Ajuda → Documentação para IA**, conforme arquitetura de navegação existente).
2. O Studio gera/entrega um ZIP atualizado do contrato e catálogo reais.
3. Usuário envia o kit ou seus arquivos relevantes à IA, junto ao BANT, após revisar/remover dados confidenciais conforme as regras da empresa.
4. IA produz **somente JSON válido** e utiliza os IDs que aparecem no manifesto exportado.
5. Usuário abre **Importar diagrama**, cola o JSON ou seleciona o arquivo `.mcss.json`/`.json`.
6. O Studio valida sintaxe, versão, estrutura, IDs e integridade de referências, mostrando diagnóstico.
7. Usuário examina uma prévia e decide **Criar novo projeto**.
8. O Studio cria um projeto local, apresenta a arquitetura no canvas e permite editar, salvar, apresentar ou exportar.

### 2.3 Jornada B — IA → Playground

1. Usuário abre Playground e importa JSON.
2. App mostra a prévia e pede confirmação para **Substituir o diagrama temporário** (se houver conteúdo) ou **Abrir no Playground**.
3. O diagrama passa a existir **apenas em memória**; não é salvo em IndexedDB, localStorage nem sessionStorage.
4. Exportar JSON/PNG continua possível; salvar como projeto é um ato separado e explícito.
5. Atualização da página descarta o estado efêmero, com aviso de navegação quando tecnicamente cabível.

### 2.4 Jornada C — edição humana → exportação → IA → reimportação

1. Usuário desenha/edita um projeto no Studio e exporta `.mcss.json`.
2. IA recebe esse documento e um pedido de ajuste (por exemplo, incluir CDN ou segmentar redes).
3. IA devolve JSON completo e compatível (não um patch parcial no MVP).
4. Usuário reimporta como **novo projeto** ou no Playground, preservando o original.

---

## 3. Escopo e prioridades

### 3.1 P0 obrigatório

- Definir contrato público e versão semântica de formato.
- Converter modelo interno atual ↔ contrato público, mantendo campos suportados.
- Exportar diagrama completo como `.mcss.json` válido e reimportável.
- Importar por **colar JSON** e **selecionar/arrastar arquivo**.
- Erros legíveis e específicos (sintaxe, estrutura, versão, referências e limites).
- Prévia real isolada com resumo de nós, arestas, provedores e avisos.
- Confirmar importação criando **novo projeto** ou abrindo no **Playground** sem persistir.
- Documentação exportável como **Kit para IA (.zip)** com schema, catálogo, guia, exemplos e prompt.
- Pipeline determinístico de geração e verificação de documentação sincronizada com fontes reais.
- Atualizar `AGENTS.md` ou arquivo de regras de maior precedência do repositório para manutenção obrigatória do contrato.
- Migrar/continuar aceitando formatos legados que o app atual suporta, sem perda silenciosa.
- Testes de contrato, segurança, import/export e E2E.

### 3.2 P1 desejável depois de P0

- Copiar instruções mínimas para a IA diretamente da interface.
- Mostrar erros com destaque de linha/coluna no editor de JSON.
- Indicador de versão do manifesto no modal e histórico de compatibilidade.
- Exportar separadamente somente o guia `.md` quando útil.
- Prévia que pode ser ampliada e inspecionada antes da confirmação.

### 3.3 Fora deste PRD

- Chat com modelo, geração de arquitetura dentro do app ou envio automático do BANT.
- Execução de código de/contido no JSON, provisionamento e credenciais cloud.
- Importação de Terraform, CloudFormation, ARM/Bicep, Pulumi, Mermaid ou Excalidraw.
- Sincronização/merge inteligente de projetos com resolução de conflitos.
- Estimativa real de preço, disponibilidade de região ou checagem de segurança técnica.
- Compartilhamento remoto do documento ou colaboração multiusuário.

---

## 4. Vocabulário e contratos

- **MCSS Diagram Format**: formato público serializado em JSON estrito.
- **`format`**: discriminador fixo de arquivo, `"mcss.diagram"`.
- **`schemaVersion`**: versão semântica do formato público, ex. `"1.0.0"`.
- **`catalogVersion`**: versão/revisão do manifesto real de serviços; é referência informativa de compatibilidade, não exigência de instalar a mesma build.
- **`serviceId`**: identificador canônico e estável da definição de serviço, obtido do manifesto exportado.
- **Node**: instância de serviço ou elemento genérico/grupo/forma/texto/nota.
- **Edge**: conexão lógica com origem, destino, direção, tipo de fluxo e label.
- **Drawing**: elemento livre com coordenadas de mundo (sem dependência de pixels de tela).
- **Scene**: estado de apresentação referenciando o mesmo grafo.
- **Viewport**: posição de câmera e nível de zoom.
- **Kit para IA**: arquivo ZIP gerado com o contrato e catálogo da versão instalada.
- **Aviso**: condição importável com perda controlada ou contexto faltante, explicitado ao usuário.
- **Erro**: condição que bloqueia a importação por risco de perda, referência inválida ou incompatibilidade.

---

## 5. Contrato JSON público v1

### 5.1 Arquivo e versão

- Nome de arquivo padrão: `<nome-seguro>-YYYY-MM-DD.mcss.json`.
- MIME na exportação: `application/json; charset=utf-8`.
- Codificação: UTF-8; BOM opcional apenas na leitura, não na escrita.
- JSON **estrito**, sem comentários, aspas simples, vírgulas finais, funções ou expressões.
- Identificador de formato obrigatório: `format: "mcss.diagram"`.
- `schemaVersion` obrigatório: inicialmente `"1.0.0"`.
- `catalogVersion` opcional ou preenchido automaticamente ao exportar; a IA deve copiá-lo do kit quando disponível, sem inventar valores.
- Campos de raiz adicionais que não sejam contemplados em `extensions`/norma de compatibilidade devem ser tratados conforme política formal do schema, nunca descartados silenciosamente.

### 5.2 Forma canônica proposta

```json
{
  "format": "mcss.diagram",
  "schemaVersion": "1.0.0",
  "metadata": {
    "title": "Arquitetura de exemplo",
    "description": "Fluxo demonstrativo sem infraestrutura real",
    "origin": "ai"
  },
  "diagram": {
    "nodes": [
      {
        "id": "user",
        "kind": "generic",
        "label": "Usuário",
        "position": { "x": 80, "y": 120 },
        "properties": {}
      },
      {
        "id": "system",
        "kind": "generic",
        "label": "Aplicação",
        "position": { "x": 400, "y": 120 },
        "properties": {}
      }
    ],
    "edges": [
      {
        "id": "request",
        "sourceId": "user",
        "targetId": "system",
        "direction": "forward",
        "flowType": "logical",
        "label": "Requisição"
      }
    ],
    "drawings": [],
    "scenes": [],
    "viewport": { "x": 0, "y": 0, "zoom": 1 }
  }
}
```

> **IMPORTANTE:** este exemplo mostra apenas entidades **genéricas**, para não depender de supor IDs atuais do catálogo real. O agente implementador deve criar, **a partir do registro existente**, pelo menos um exemplo adicional com serviços reais (por exemplo, Cloud Run, BigQuery e S3) e incluir esse exemplo no kit gerado. O valor `logical` e demais enums do exemplo devem ser suportados no contrato publicado; se o projeto atual usar outro nome para esse fluxo, normalizar pela camada adaptadora com testes e atualizar o exemplo real de referência. Não incluir exemplos que falhem no próprio validador.

### 5.3 Estrutura e campos obrigatórios/opcionais

| Objeto | Obrigatórios | Opcionais / condicionais | Regras |
|---|---|---|---|
| Documento raiz | `format`, `schemaVersion`, `metadata`, `diagram` | `catalogVersion`, `extensions` | `format` exato; versão suportada |
| `metadata` | `title` | `description`, `origin`, `createdAt`, `updatedAt` | datas ISO 8601 se presentes; texto limitado |
| `diagram` | `nodes`, `edges` | `drawings`, `scenes`, `viewport`, `settings`, `extensions` | arrays vazios válidos; defaults seguros |
| `node` | `id`, `kind`, `label`, `position` | `serviceId`, `size`, `parentId`, `properties`, `notes`, `style`, `extensions` | `serviceId` obrigatório para `kind=service`; sem nó pai cíclico |
| `edge` | `id`, `sourceId`, `targetId` | `sourceHandle`, `targetHandle`, `direction`, `flowType`, `label`, `animated`, `style`, `notes`, `extensions` | referências devem existir; sem handle inválido silencioso |
| `drawing` | conforme o tipo existente da aplicação | cor, espessura, pontos, camada, etc. | coordenadas de mundo; sem payload executável |
| `scene` | `id`, `order`, `title`, `viewport` ou defaults documentados | descrição, destaques, animações, `speakerNotes` | IDs destacados devem existir; notas de cena não são notas de nó |
| `viewport` | `x`, `y`, `zoom` | — | números finitos; zoom positivo dentro dos limites |

O agente deve **inspecionar campos reais** e fechar as definições exatas de `drawing`, `shape`, `group`, `size`, `style`, `settings`, `flowType`, handles e cenas antes de publicar o primeiro schema. Esta tabela fixa o contrato de produto, não autoriza descartar campos internos sem mapeamento.

### 5.4 Tipos de nós

Documentar explicitamente todos os tipos suportados pelo editor atual, com exemplos reais e campos exclusivos:

- `service`: serviço cloud com `serviceId` canônico presente no catálogo.
- `generic`: sistema, usuário, API externa ou elemento não mapeado a serviço cloud.
- `group`: contêiner lógico, zona ou agrupamento (incluindo provedor/região, conforme a implementação).
- `shape`: retângulo, círculo e outras figuras disponíveis.
- `text`: texto livre.
- `note`: anotação arquitetural.

Não inventar suporte a tipos adicionais. Se o editor atual tem um tipo legado, especificar sua migração ou representação compatível.

### 5.5 IDs e referências

- IDs de instância são strings não vazias, estáveis dentro do documento e únicas por coleção; recomendar unicidade global entre nós, edges, drawings e cenas quando simplificar o modelo.
- `edge.sourceId` e `edge.targetId` **devem** referenciar IDs de `diagram.nodes`.
- `node.parentId`, se presente, deve referenciar grupo/entidade válida, não a si mesmo e sem ciclos.
- IDs de nós e edges usados em cenas devem existir; arrays de destaques/animações sem referências órfãs.
- IDs de serviços não são traduzidos do nome exibido: a IA deve consultar o catálogo e copiar o `serviceId` **exato**.
- Um mesmo serviço pode aparecer em múltiplos nós com IDs de instância distintos.
- O manifesto deve informar aliases para busca textual, mas os aliases **não são** substitutos aceitos automaticamente para IDs canônicos.

### 5.6 Posições e layout

- Usar coordenadas bidimensionais em unidades de canvas, não pixels físicos de tela.
- Exportar e importar posições explícitas quando fornecidas.
- Para JSON válido sem posições, **somente se a versão publicada definir posicionamento como opcional**, aplicar auto-layout deterministicamente e explicar o resultado antes da confirmação; em v1, preferir exigir posição para reduzir ambiguidades.
- Definir orientação recomendada da IA: fluxo principal esquerda → direita; alternativas/retornos em outra camada; espaços suficientes entre cards e labels.
- `viewport` ausente: calcular *fit view* pós-importação sem alterar as posições persistidas.
- Respeitar coordenadas relativas de grupos, conforme mecanismo atual. Conversões entre coordenadas de mundo e coordenadas relativas não podem deslocar filhos.

### 5.7 Conexões semânticas

- Preservar sentido (`forward`, `reverse`, `bidirectional`, `none`, conforme contrato final) e tipo de fluxo documentado.
- `flowType` não deve determinar execução, segurança ou compatibilidade de rede.
- Se a IA não souber o protocolo, utilizar tipo `logical`/`unknown` publicado em vez de inventar `HTTPS`.
- Atributos específicos de arestas pertencem a **edges**, não às propriedades do nó.
- `animated: true` é apenas visualização didática e deve obedecer às preferências de movimento reduzido.
- O contrato deve comportar ligações entre provedores diferentes sem bloquear o desenho por ausência de validação cloud.

### 5.8 Campos de apresentação e conteúdo legado

- Conservar cenas, zoom, destaques e animações quando suportados pelo modelo real.
- `speakerNotes`, quando existente, pode pertencer somente às **cenas**, conforme PRDs anteriores; **não reintroduzir “Notas do apresentador” nos elementos**.
- Preservar `notes` de natureza técnica em nós/arestas quando o modelo suportar.
- Preservar extensões compatíveis de formato e fallback de renderização, desde que seguras e sem perda silenciosa.

### 5.9 Campos desconhecidos e extensibilidade

- Especificar um namespace `extensions` opcional para futuras extensões, com tamanho e profundidade limitados.
- Não executar nem injetar HTML/SVG/scripts vindos de `extensions`.
- Para campos inesperados fora de `extensions`, declarar política inequívoca: preferencialmente erro de validação ou aviso com preservação explícita. Não descartar silenciosamente.
- Campos experimentais internos não devem ser exigidos de arquivos produzidos por IAs.

---

## 6. Serviço cloud e dependência do catálogo real

### 6.1 Identificador canônico de serviço

Cada entrada exposta no kit deve derivar diretamente do registro usado para renderizar o catálogo, com no mínimo:

```json
{
  "id": "<ID_CANONICO_REAL>",
  "providerId": "<ID_DO_PROVEDOR>",
  "categoryId": "<ID_DA_CATEGORIA>",
  "displayName": "<NOME_REAL>",
  "aliases": [],
  "documentationUrl": "<URL_OFICIAL_SE_HOUVER>",
  "supportedNodeKind": "service",
  "properties": []
}
```

**Este trecho define a forma do manifesto e usa placeholders explicativos, não é um serviço importável.** O manifesto real não pode conter placeholders, entradas fictícias, IDs deduzidos nem serviços que não estejam disponíveis no app.

### 6.2 Compatibilidade com provedores

O catálogo deve exportar exatamente as entradas implementadas dos sete provedores previstos nos PRDs anteriores: Google Cloud, AWS, Microsoft Azure, Oracle Cloud Infrastructure, Cloudflare, Hostinger e Supabase.

- Não fixar número de serviços no código ou documento; o total é `manifest.services.length` e deve coincidir com a UI.
- Não assumir que todos os provedores têm equivalentes para todas as capacidades.
- Não copiar logos ou binários de ícones para a documentação sem checar termos; o manifesto pode conter identificadores/caminhos de asset relativos úteis ao app, mas não precisa redistribuir imagens.
- Gerar seções por provedor e categoria, com aliases somente quando presentes no registro real.
- Se o catálogo atual não contém metadados de propriedades, documentar os campos **genéricos** aceitos e não inventar configuração específica do produto.

### 6.3 Serviço desconhecido: fallback seguro

Se o JSON referencia `serviceId` ausente no registro instalado:

1. Schema/estrutura podem permanecer válidos.
2. Validação semântica apresenta **aviso**: `Serviço não encontrado: "..."` e indica o nó afetado.
3. Preview mostra componente genérico **com label, propriedades e serviceId original preservados**.
4. Usuário opta por importar com fallback ou cancelar; **nunca remapear** automaticamente para outro serviço de nome parecido.
5. Ao exportar novamente, preservar o ID original e os metadados necessários para futura resolução.
6. Se o serviço surgir posteriormente no catálogo, o aplicativo pode resolvê-lo pelo ID exato, sem reconstrução do projeto.

O fallback **não** se aplica a referências estruturais inválidas, como edge apontando para nó inexistente.

---

## 7. Contrato formal: JSON Schema e tipagem

### 7.1 Schema público

Criar `mcss-diagram.schema.json`, usando **JSON Schema Draft 2020-12**. Esse schema deve ser válido por um validador compatível, com `"$schema": "https://json-schema.org/draft/2020-12/schema"`, `$id` estável de referência (não exigir internet para validar), descrições e exemplos úteis.

O schema deve especificar: tipos, campos obrigatórios, enums, tamanhos, limites de strings, formatos de data, arrays e alternativas por tipo de nó. Considerar `additionalProperties`/`unevaluatedProperties` deliberadamente, sem bloquear `extensions` suportadas.

### 7.2 Fonte única de verdade

Inspecionar a implementação atual e **selecionar uma única fonte canônica** para o contrato (por exemplo, Zod TypeScript já existente ou JSON Schema canônico + validator). A outra representação deve ser **gerada automaticamente**, com verificação de equivalência.

- Se adotar **Zod canônico**, gerar Draft 2020-12 com conversor comprovadamente compatível com a versão instalada; validar o schema resultante e testar paridade com o validador runtime.
- Se adotar **JSON Schema canônico**, validar com biblioteca compatível (por exemplo, Ajv2020), derivar tipos TypeScript quando cabível e validar dados também contra a semântica de domínio.
- **Proibido manter dois contratos escritos manualmente que possam divergir.**
- Não adicionar dependências por impulso: inspecionar primeiro o stack real, compatibilidade, bundle e testes.

### 7.3 Validação em duas camadas

**Estrutural:** JSON parse, `format`, versão, tipos, valores permitidos, tamanhos, campos obrigatórios e profundidade.  
**Semântica:** unicidade, edges com endpoints válidos, ausência de ciclos de grupos, cenas referenciando entidades existentes, integridade dos handles, resolução dos serviços e consistência de coordenadas.

Uma terceira camada, **avaliação de viabilidade de arquitetura cloud real**, está explicitamente fora do escopo.

### 7.4 Mensagens de erro estruturadas

Cada problema deve ter: `code`, `severity`, `path` em JSON Pointer, `message` em pt-BR e `hint` opcional. Exemplos:

```json
{
  "code": "EDGE_TARGET_NOT_FOUND",
  "severity": "error",
  "path": "/diagram/edges/2/targetId",
  "message": "A conexão aponta para um componente inexistente.",
  "hint": "Crie o nó de destino ou corrija o targetId."
}
```

Regras mínimas de diagnóstico: JSON inválido (linha/coluna se disponíveis), formato desconhecido, versão futura incompatível, `serviceId` ausente, duplicidade de IDs, aresta órfã, `parentId` circular, coordenadas inválidas, arquivo grande, cena órfã e campos não reconhecidos conforme política publicada.

---

## 8. Versionamento e migrações

### 8.1 Regras de versão

- `schemaVersion` segue SemVer (`MAJOR.MINOR.PATCH`) do **contrato**; não confundir com versão do produto, do manifesto ou do schema Draft 2020-12.
- `PATCH`: correção documental/validação sem mudar dados aceitos de forma incompatível.
- `MINOR`: inclusão retrocompatível de campos opcionais ou novos valores suportados com política de fallback.
- `MAJOR`: mudança incompatível que exige migração ou rejeição explícita.

### 8.2 Importação de versões

1. **Versão atual:** valida e importa.
2. **Versão anterior conhecida:** executa migração declarada e testada; exibe aviso `Arquivo convertido para versão atual`.
3. **Versão futura MAJOR não suportada:** bloquear e explicar versão requerida; não tentar importar “na sorte”.
4. **Versão futura MINOR:** comportamento conservador definido e testado; não descartar campos sem aviso/preservação.
5. **Arquivo legado existente (pré-PRD 5):** autodetectar **apenas** formatos reais já exportados pelo Studio. Implementar adaptador com fixtures legadas, sem alterar arquivo original ou dados persistidos.

### 8.3 Preservação da origem

Ao importar como novo projeto, IDs internos de projeto podem ser regenerados para evitar colisões locais, mas os IDs de nó/edge devem ser preservados quando possível; se forem reescritos, **todas as referências devem ser atualizadas atomicamente**. `createdAt` e `updatedAt` do projeto local seguem a política existente; metadados originais podem ser mantidos separadamente como origem sem sobrescrever controles do banco.

---

## 9. Interface: importar diagrama

### 9.1 Acesso

Incluir **Importar diagrama** em local coerente com a UI atual, preferencialmente:

- Dashboard/Home: ação discreta em um menu de projetos ou junto às ações principais existentes.
- Editor: ação `Importar` acessível no menu `Exportar/Importar` ou ações do documento; **não** lotar header com botões redundantes.
- Playground: mesma ação com destino contextual explícito.

Se a interface já tiver importação, **evoluir a existente**, sem criar um segundo modal concorrente.

### 9.2 Fluxo do modal

```text
┌─────────────────────────────────────────────────────────────────┐
│ Importar arquitetura                                       [×] │
│ Gere um JSON com o Kit para IA ou importe um arquivo existente.│
├─────────────────────────────────────────────────────────────────┤
│ [ Colar JSON ] [ Enviar arquivo ]                              │
│                                                                 │
│ {                                                              │
│   "format": "mcss.diagram",                                  │
│   "schemaVersion": "1.0.0",                                  │
│   ...                                                          │
│ }                                                              │
│                                                                 │
│ [Validar JSON]                                                  │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Estrutura válida • 8 nós • 7 conexões • 2 provedores         │
│ ⚠ 1 serviço desconhecido; será exibido como genérico           │
│ [Pré-visualização do diagrama]                                 │
├─────────────────────────────────────────────────────────────────┤
│ [Cancelar]                           [Criar novo projeto]      │
└─────────────────────────────────────────────────────────────────┘
```

A tela é **referência funcional**, não obrigação de reproduzir ASCII literalmente. Manter a identidade visual minimalista clara dos PRDs 3 e 4.

### 9.3 Entrada por colagem

- Campo monoespaçado, seleção/cópia e colagem usuais; estado vazio com instrução curta.
- Aceitar **um documento JSON completo**, não lista arbitrária de nós soltos.
- Se o usuário colar uma resposta contendo cercas Markdown ```json ... ```, oferecer limpeza **explícita e segura**, exibindo o JSON extraído antes de validar; não executar código e não aceitar comentários JSON5 como se fosse JSON.
- Mensagem de erro de sintaxe no próprio modal, sem fechamento ou perda do conteúdo digitado.
- Teclas: `Esc` fecha/volta quando seguro; `Ctrl+Enter` valida se não conflitar com editor; respeitar acessibilidade e foco.

### 9.4 Entrada por arquivo

- Botão de seleção + arrastar/soltar arquivo, com área compacta de drop quando relevante.
- Extensões aceitas: `.mcss.json` e `.json`, verificando **conteúdo**, não somente extensão ou MIME.
- Leitura local (`File`/`Blob`) sem upload a servidor.
- Nome e tamanho do arquivo visíveis; tamanho acima do limite bloqueia antes de parsear.
- Caso de múltiplos arquivos arrastados: explicar que apenas um é suportado e não escolher silenciosamente.

### 9.5 Validação e relatório

- Após colar/upload: botão **Validar JSON**; validar localmente e mostrar resumo.
- **Erros (bloqueantes)** impedem confirmação; **avisos** podem permitir importação mediante decisão explícita.
- Agrupar problemas em lista navegável com caminho do dado e instrução para corrigir.
- Mensagens pt-BR, sem despejar stack traces ou JSON inteiro em toast.
- Mostrar contagem real: nós, conexões, cenas, desenhos, provedores, serviços desconhecidos.
- Não alegar `Arquitetura validada` de forma que pareça certificação técnica; preferir `Arquivo compatível com o Studio`.

### 9.6 Prévia

- Usar o **mesmo renderer** dos nós/edges do editor, em instância/estado isolado e sem persistência.
- Mostrar layout e rótulos com *fit view* adequado, sem aceitar arraste acidental como edição no modal.
- Prévia para JSON com serviços desconhecidos deve usar fallback visual e indicar quais são.
- Incluir aviso curto: `Prévia ilustrativa; conectividade e compatibilidade cloud não foram verificadas`.
- Com arquivo sem nós, mostrar empty state contextual sem inventar conteúdo.

### 9.7 Confirmação e destino

- Na Home ou projeto salvo: **Criar novo projeto** como padrão. Não sobrescrever projeto aberto por mera importação.
- No Playground: **Abrir no Playground**, com confirmação se já existir conteúdo não salvo.
- Eventual ação secundária **Salvar como novo projeto** a partir do Playground é explícita.
- A operação deve ser **atômica**: falha de conversão/persistência não pode deixar projeto incompleto ou alterar o original.
- Erro do storage (quota, IndexedDB bloqueado) deve ser informado e permitir baixar o JSON validado como backup, quando possível.
- Ao confirmar, modal fecha apenas após sucesso, app navega ao diagrama e ajusta *fit view* sem alterar coordenadas armazenadas.

### 9.8 Estados obrigatórios

Vazio, digitando, lendo arquivo, validando, erro de sintaxe, erro de contrato, aviso, prévia pronta, importando, sucesso, falha ao salvar, versão incompatível, diagrama vazio, ícone ausente e serviço desconhecido.

---

## 10. Interface: exportar diagrama

- Reutilizar ação `Exportar` já existente com opção **Diagrama editável (.mcss.json)** além de PNG existente.
- Exportar **documento completo e validado** (nós, edges, propriedades, drawings, zonas, grupos, cenas, viewport e settings suportados).
- Se dados internos incompatíveis forem encontrados, bloquear a exportação com diagnóstico ou oferecer migração controlada; não produzir JSON quebrado sem aviso.
- Arquivo legível, com indentação padronizada (2 espaços), ordenação estável onde não afetar semântica, UTF-8 e nome seguro.
- Exporte válido deve ser aceito pelo próprio importador da mesma versão.
- Não incluir estado efêmero de UI (hover, seleção, drag preview, menus abertos, histórico undo/redo) nem informações sensíveis de ambiente.
- Exportar no Playground **não** cria projeto e **não** ativa autosave.
- A exportação não altera `updatedAt` por si só, salvo regra previamente existente e documentada.

---

## 11. Kit para IA: documentação exportável na interface

### 11.1 Ação de usuário

Criar a ação visível e fácil de localizar **`Exportar Kit para IA`** (por exemplo, em `Ajuda / Documentação` ou menu de importação/exportação). Não posicionar um botão enorme permanente no canvas. A ação produz arquivo `multicloud-studio-ai-kit-v<schemaVersion>-<catalogVersion>.zip`, com nome sanitizado.

### 11.2 Conteúdo obrigatório do ZIP

```text
multicloud-studio-ai-kit/
├── README.md
├── AI_GUIDE.md
├── PROMPT_TEMPLATE.md
├── mcss-diagram.schema.json
├── service-catalog.json
├── FORMAT_CHANGELOG.md
└── examples/
    ├── minimal.mcss.json
    ├── multicloud-real-services.mcss.json
    └── presentation-with-scenes.mcss.json
```

Cada arquivo deve ser útil individualmente. Se algum exemplo utilizar cenas/desenhos não suportados pelo editor instalado, omitir até suporte real existir e registrar a capacidade no README; **nunca distribuir exemplo inválido**.

### 11.3 `README.md`

- O que é o kit e como utilizá-lo com IA externa.
- `schemaVersion`, `catalogVersion`, data de geração e total real de serviços.
- Lista dos arquivos e papéis.
- Aviso de privacidade: revisar BANT e dados do cliente antes de enviar a IAs de terceiros.
- Aviso de arquitetura: o contrato garante sintaxe e integridade do diagrama, não que o desenho esteja tecnicamente correto.
- Limitações atuais do app e regras de compatibilidade.

### 11.4 `AI_GUIDE.md` — guia para modelos de IA

O guia deve ser completo e autoexplicativo, cobrindo:

1. Introdução, tarefa da IA e formato de saída estritamente JSON.
2. Forma do documento e diferenciação `format`, `schemaVersion`, `catalogVersion`.
3. Mapeamento de tipos de nós (`service`, `generic`, `group`, `shape`, `text`, `note`) para o renderer real.
4. Como selecionar serviços usando IDs do manifesto; como evitar IDs inventados.
5. Como produzir IDs de instância únicos e conexões coerentes.
6. Como escolher e organizar posições, contêineres e regiões.
7. Campos obrigatórios/opcionais e enums provenientes do schema.
8. Como criar cenas, labels, notas técnicas e propriedades quando suportadas.
9. Como representar serviços ausentes usando nó genérico **sem fingir que o serviço existe no catálogo**.
10. Como lidar com requisitos incertos (preferir texto/anotação ou tornar a premissa explícita, não criar serviços imaginários).
11. Casos de JSON válido e inválido com causas explicadas.
12. Checklist de auto-verificação: parse válido, schema, IDs, endpoints, grupos, cenas, posições, integridade.
13. Política de privacidade, segurança e limitações da arquitetura gerada.

**O texto explicativo pode ter trechos editoriais mantidos por humanos**, mas tabelas de propriedades, tipos, enums e catálogo devem ser geradas/compiladas da fonte canônica; não manter listas manuais concorrentes.

### 11.5 `service-catalog.json` — manifesto completo

- Versão do catálogo, contagem real, provedores e categorias.
- **Todos os serviços efetivamente importáveis**, com ID, provedor, categoria, nome, aliases, documentação oficial disponível e campos públicos suportados.
- Ordenação determinística por provedor, categoria e ID.
- Sem credenciais, tokens, dados de projetos, imagens remotas executáveis, endpoints privados ou configurações locais do usuário.
- Não inserir serviços descontinuados sem uma política explícita de ID legado.
- Manifesto gerado do mesmo registro usado pelo catálogo da interface; comparação automatizada garante igualdade dos conjuntos de IDs.

### 11.6 `mcss-diagram.schema.json`

- Schema **completo**, independente e autossuficiente para validação offline.
- `$id` estável de referência; sem `$ref` obrigatório para URLs externas, salvo se os arquivos referidos também forem empacotados e resolvíveis localmente.
- `definitions`/`$defs` para tipos de nós, edges, cenas e partes comuns.
- Descrições e restrições consistentes com o runtime.

### 11.7 `PROMPT_TEMPLATE.md`

Incluir prompt preparado para colar em ChatGPT, Gemini, Claude ou outra IA, com espaços para BANT e restrições do cliente. Deve orientar:

- Ler primeiro `AI_GUIDE.md`, `mcss-diagram.schema.json` e `service-catalog.json`.
- Usar exclusivamente IDs canônicos presentes no manifesto para nós `service`.
- Priorizar necessidades/restrições do BANT, sem inferir confidencialidade, regiões ou custos.
- Quando necessário, representar capacidades não catalogadas com nós `generic` rotulados claramente.
- Produzir **somente o objeto JSON completo**, sem Markdown, comentários ou explicações dentro do bloco.
- Aplicar validação mental e, se ferramentas forem disponíveis, validação real do JSON antes de devolver.

### 11.8 `FORMAT_CHANGELOG.md`

- Registro de mudanças do formato público, versões suportadas e migrações.
- Descrever mudanças do contrato, e não listar cada alteração de UI ou um changelog do app inteiro.

---

## 12. Atualização contínua: obrigação do agente de código

### 12.1 Regra a adicionar ao `AGENTS.md`

Incorporar no `AGENTS.md` existente (sem duplicar seções em conflito) uma regra destacada, com conteúdo equivalente a:

> **Contrato JSON e documentação para IA — manutenção obrigatória:** ao criar, remover, renomear ou alterar um serviço, provedor, categoria, propriedade pública, tipo de nó, conexão, zona, cena, extensão, enum, regra de validação, migração ou interface de importação/exportação, o assistente de código **DEVE** atualizar a fonte canônica correspondente, regenerar o JSON Schema, o manifesto e a documentação para IA, atualizar exemplos, testes e changelog quando houver mudança de contrato e executar o comando de verificação de sincronismo. Não concluir a tarefa se a documentação exportável divergir do comportamento real do aplicativo. Usar exclusivamente `pnpm`, seguir as skills pertinentes e reportar explicitamente eventuais bloqueios.

**Essa regra não deve ficar apenas neste PRD:** implementar no repositório real, para valer em futuras sessões e mudanças.

### 12.2 Fontes canônicas

- Definições reais de serviço → manifesto do kit.
- Contrato tipado/validator real → schema público.
- Metadados de enums, propriedades e defaults → tabelas geradas do guia.
- Exemplos → fixtures de testes exportadas pelo próprio serializer público.
- Texto educativo, instruções e glossário → templates versionados no repositório, compilados com dados gerados.

### 12.3 Comandos padronizados

Adicionar scripts (ou adaptar nomes à convenção existente, documentando a correspondência), todos invocados com **pnpm**:

```bash
pnpm docs:ai:generate       # Regera JSON Schema, manifesto, guia e exemplos
pnpm docs:ai:check          # Falha se o gerado estiver diferente do código
pnpm test:diagram-contract  # Testes de formato e round-trip
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Se ainda não existirem `lint`, `typecheck`, `test` etc., o agente deve seguir o `package.json` real e criar os scripts relevantes de modo coerente; **não afirmar que executou comandos inexistentes**. A geração deve ser **determinística**: executar duas vezes sem mudar fontes produz arquivos idênticos. Evitar timestamps variáveis em arquivos versionados; timestamps de exportação runtime podem existir no ZIP sem afetar artefatos de CI.

### 12.4 CI e detecção de drift

- Incluir `pnpm docs:ai:check` e testes de contrato no pipeline CI se houver pipeline; caso não haja, fornecer configuração proporcional ao repositório e documentar execução local.
- `check` calcula artefatos esperados em memória/diretório temporário, compara com os versionados e falha com diff útil; **não corrige silenciosamente** na verificação.
- Mudança de catálogo adicionando serviço deve forçar regeneração do manifesto.
- Mudança de schema/enum deve forçar atualização do guia e das fixtures.
- Mudança apenas de UI sem impacto contratual não precisa alterar a versão ou o guia.

### 12.5 Critérios de atualização de versão

- Mudança compatível de novo serviço no catálogo: atualizar `catalogVersion` e manifesto; não exigir aumentar `schemaVersion`.
- Adição de campo opcional ao formato: avaliar incremento MINOR e changelog.
- Alteração incompatível: incrementar MAJOR, implementar migração/diagnóstico e atualizar exemplos.
- Remoção/renomeação de `serviceId` requer mapeamento de legado ou fallback documentado; **não invalidar projetos antigos silenciosamente**.

---

## 13. Arquitetura de software: módulos e responsabilidades

### 13.1 Organização sugerida (adaptar ao repositório real)

```text
features/
  diagram-format/
    domain/               # tipos de contrato e invariantes
    serialization/        # app -> MCSS JSON
    deserialization/      # MCSS JSON -> modelo interno
    validation/           # parse, schema, semântica, diagnósticos
    migrations/           # compatibilidade com exports antigos
    import-ui/            # modal, paste, upload, preview, confirmation
    export-ui/            # opções e download de diagrama
  catalog/                # registro real de serviços, provedores e categorias
  presentation/           # cenas existentes
  projects/               # persistência local existente
  canvas/                 # renderer existente
lib/
  ai-kit/                 # construção determinística do kit
scripts/
  generate-ai-docs.*
  check-ai-docs.*
docs/
  ai/                     # documentação versionada gerada/compilada
    AI_GUIDE.md
    PROMPT_TEMPLATE.md
    mcss-diagram.schema.json
    service-catalog.json
    FORMAT_CHANGELOG.md
    examples/
```

Não criar uma segunda store ou um novo sistema de persistência paralelo. Os nomes são sugestivos, não justificam reestruturação ampla do repositório.

### 13.2 Pipeline de exportação

```text
Projeto/Playground (modelo interno)
    -> extrair estado persistível
    -> normalização sem efeitos colaterais
    -> adaptar para contrato MCSS
    -> validar estrutura e semântica
    -> serializar JSON determinístico
    -> iniciar download .mcss.json
```

### 13.3 Pipeline de importação

```text
Texto / Arquivo local
    -> checagem prévia de tamanho
    -> parse JSON estrito
    -> detecção de formato/versão
    -> migração (quando necessária)
    -> validação estrutural
    -> validação semântica + resolução do catálogo
    -> relatório de erros/avisos
    -> modelo isolado de preview
    -> confirmação explícita
    -> adaptação para modelo interno
    -> operação atômica: novo projeto OU Playground em memória
    -> abrir editor / fit view
```

### 13.4 Invariantes técnicas

- Parsing, validação, serialização, migração e resolução do catálogo são **funções puras ou serviços testáveis sem React**.
- `ReactFlow` é somente renderer/editor; o protocolo não depende de atributos DOM ou da estrutura serializada por `toObject()`.
- O `diagram` e a visualização prévia não podem conter funções, referências cíclicas ou dados executáveis.
- Metadados de ícones são resolvidos **localmente** por `serviceId`, não por URLs inseridas pela IA.
- Undo/redo não deve incluir eventos de validação ou preview antes da confirmação.
- O Playground não acessa caminhos de persistência de projetos ao importar.
- Importação com warning de fallback preserva o documento original para novo export.

---

## 14. Segurança, privacidade e limites

### 14.1 Ameaças consideradas

O JSON importado é **entrada não confiável**, inclusive quando produzido por uma IA. Tratar como possível fonte de XSS, SVG/HTML malicioso, URL perigosa, parsing custoso, referências recursivas, elementos em volume excessivo e tentativa de sobrescrita de dados locais.

### 14.2 Controles P0

- Limite inicial de arquivo/texto: **3 MiB** (ajustável por constante central e testes).
- Limites iniciais configuráveis para evitar travamento: **até 500 nós, 1.000 edges, 300 desenhos, 50 cenas e 20.000 pontos de traço somados**; testar desempenho real antes de alterar números.
- Strings com limites sensatos (rótulos, nomes, notas e URLs) no schema; profundidade JSON e tamanho de `extensions` limitados.
- Rejeitar `NaN`, `Infinity`, referências inválidas, IDs duplicados, ciclos de grupo e coordenadas fora de faixas aceitáveis. JSON estrito já não admite `NaN`/`Infinity`, mas validar modelo interno/exportador também.
- Renderizar labels, propriedades e anotações como **texto**. Não interpolar HTML não confiável em `dangerouslySetInnerHTML`, Markdown inseguro nem SVG externo fornecido pelo arquivo.
- Links de documentação devem ser saneados: aceitar apenas protocolos permitidos (preferencialmente HTTPS) e não acessá-los automaticamente durante o import.
- Não importar imagens remotas/URLs para renderização dinâmica sem consentimento/validação específicos.
- Não executar scripts/comandos contidos em propriedades.
- Proibir lógica automática de alteração ou exclusão de projetos por campos do JSON.
- Prevenir travamento de UI no parse/validação e manter opção de cancelar; grandes entradas podem demandar validação em Worker quando necessário.
- Não enviar JSON, BANT ou dados pessoais para servidores/telemetria de terceiros pelo fluxo P0.
- Aplicar prevenção de *prototype pollution* em normalização e objetos dinâmicos (`__proto__`, `constructor`, `prototype` em contextos perigosos) e evitar merge recursivo ingênuo.
- Erros não devem expor caminho privado, stack trace ou dados confidenciais.

### 14.3 Privacidade ao usar IA externa

- O Studio **não** envia BANT automaticamente à IA.
- O kit exportado contém **somente documentação técnica pública do aplicativo**, nunca diagramas reais de cliente.
- Informar usuário: antes de compartilhar BANT/diagramas com IA externa, revisar permissões, política corporativa e conteúdo confidencial.

---

## 15. UX: decisões visuais e textos

Seguir design system minimalista claro já aprovado; modal compacto, labels curtos, estados inequívocos, sem botões decorativos. Reutilizar shadcn/ui e padrões reais do projeto. Priorizar desktop compartilhado em reunião; viewport 1672×941, 1440×900 e 1366×768.

**Textos sugeridos:**

- Entrada: **Importar diagrama**.
- Abas: **Colar JSON** / **Selecionar arquivo**.
- Ação de verificação: **Validar JSON**.
- Estado válido: **Arquivo compatível com o Studio**.
- Estado incompleto: **Corrija os erros antes de importar**.
- Aviso catálogo: **1 serviço não está no catálogo e será exibido como genérico**.
- Destino: **Criar novo projeto** ou **Abrir no Playground**.
- Documentação: **Exportar Kit para IA**.
- Exportação: **Diagrama editável (.mcss.json)**.

O novo recurso **não** deve criar um hero, dashboard extra ou barra superior duplicada; encaixá-lo na estrutura de navegação atual sem violar PRD 3/4.

---

## 16. Compatibilidade e preservação de dados

- Abrir projetos existentes sem exigir reexportar/reimportar.
- Importar arquivos atuais/antigos `.mcss.json` gerados pelo app antes do PRD 5, quando seu formato puder ser identificado por evidência no código/fixtures.
- Preservar nós, conexões, labels, posições, zonas, geometria, propriedades, desenhos, cenas, viewport, metadados e notas técnicas suportadas.
- Nunca reintroduzir “Notas do apresentador” no inspector de elementos; `speakerNotes` de cenas são diferentes.
- Export/import de projetos com serviço desconhecido preserva `serviceId` e label do fallback.
- Importar como novo projeto nunca altera projeto previamente aberto nem sobrescreve banco sem decisão explícita.
- Evitar perdas na conversão de estilos e ferramentas livres; se algum campo não puder ser representado no contrato v1, documentar, testar e bloquear exportação ou oferecer migração/preservação compatível — **não omitir silenciosamente**.

---

## 17. Testes exigidos

### 17.1 Unitários — serializer e validator

- Documento mínimo válido; documento com nós mistos; projeto vazio; cenário multicloud real do catálogo.
- Arrays ausentes opcionais recebem defaults corretos.
- IDs únicos, edge endpoints, parentId, ciclos de grupo, cenas referenciando nós/arestas.
- Coordenadas positivas/negativas, viewport, ordem de zonas e posicionamento relativo.
- Campo `notes` técnico e `speakerNotes` apenas nas cenas.
- Serviço ausente: aviso e fallback preservado; alias não remapeia sem consentimento.
- Vários arquivos de versão e migração legada; versão futura incompatível.
- JSON inválido, Markdown fence, extensão incorreta, payload grande, strings maliciosas.

### 17.2 Round-trip obrigatório

Para cada fixture válida, garantir:

```text
encode(decode(encode(documento))) ≈ encode(documento)
```

Onde `≈` significa **equivalência semântica** para todos os campos persistíveis e renderizáveis; diferenças permitidas (como normalização de defaults, ordenação estável e timestamps) devem ser especificadas e testadas. Testar ao menos: serviços multicloud, nós genéricos, shapes, grupos aninhados, desenhos, labels, conexões direcionais, cenas, viewport, propriedades e fallback de serviço desconhecido.

### 17.3 Testes do Kit para IA

- Manifesto tem **os mesmos IDs** do catálogo em runtime, com contagem exata.
- Todos os exemplos do kit passam no validador e importam no app.
- Schema público gerado é compatível com a implementação.
- `docs:ai:generate` executado duas vezes produz artefatos idênticos.
- `docs:ai:check` passa quando sincronizado e falha ao modificar intencionalmente serviço ou contrato sem regenerar docs.
- Testar mínimo 1 serviço de cada provedor **que esteja efetivamente presente no registro**, sem inventar IDs.
- ZIP abre com entradas corretas e sem arquivo privado, credencial, fixture com dados reais ou link quebrado.

### 17.4 E2E — Browser real

1. Abrir Home → importar via **Colar JSON** → validar → visualizar → confirmar novo projeto → editor com nós editáveis.
2. Importar via **upload**, inclusive arrastar e soltar arquivo.
3. Colar JSON com edge órfã → diagnóstico preciso, sem mutação do projeto atual.
4. Importar serviço desconhecido → aviso, fallback, preservação ao exportar novamente.
5. Importar no Playground → fechar/reabrir/refresh e confirmar **ausência de qualquer escrita persistente**.
6. Exportar projeto complexo → importar como novo projeto → comparar semântica e visual.
7. Exportar Kit para IA → inspecionar ZIP, contagem real, exemplos e schema.
8. Testar navegação modal, teclado, foco, cancelamento, ausência de XSS, erros de console e comportamento em resolução de referência.

### 17.5 Qualidade e desempenho

- O limite de aceitação de importação deve ser condizente com testes de tamanho e desempenho; não prometer latência fixa sem medição.
- Validar documentos com **80 nós e 120 edges** como cenário mínimo comparável ao PRD original.
- Não congelar a interface durante leitura/validação; progress/cancel quando necessário.
- Executar scripts realmente existentes via pnpm: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, mais scripts novos de docs/contrato, conforme `package.json`.

---

## 18. Critérios formais de aceite (CA5)

| ID | Critério | Evidência exigida |
|---|---|---|
| CA5-01 | Existe contrato público `mcss.diagram` versionado em `.mcss.json`. | JSON gerado e schema publicados |
| CA5-02 | Schema Draft 2020-12 público valida offline. | Teste de schema com validador compatível |
| CA5-03 | A fonte canônica do contrato é única; schema gerado não diverge do runtime. | Testes de paridade e check de docs |
| CA5-04 | Export preserva nós e serviços. | Fixture com múltiplos provedores |
| CA5-05 | Export preserva edges, direção e labels. | Round-trip com conexões |
| CA5-06 | Export preserva desenhos, grupos/zonas e geometria. | Teste de equivalência de canvas |
| CA5-07 | Export preserva cenas/viewport e notas de cenas. | Round-trip de apresentação |
| CA5-08 | Nenhuma seleção, hover ou menu é serializado como estado persistível. | Inspeção de export e teste |
| CA5-09 | Import aceita JSON colado. | E2E com paste |
| CA5-10 | Import aceita arquivo `.mcss.json`/`.json`. | E2E de upload/drop |
| CA5-11 | JSON inválido apresenta erro e mantém conteúdo digitado. | E2E erro de sintaxe |
| CA5-12 | Erros semânticos trazem caminho, mensagem e dica contextual. | Teste de edge órfã e IDs repetidos |
| CA5-13 | Erros bloqueiam confirmação sem tocar no projeto. | Verificação do storage |
| CA5-14 | Avisos são distinguíveis de erros. | Serviço desconhecido com fallback |
| CA5-15 | Prévia usa renderização fiel e não persiste conteúdo. | E2E preview isolada |
| CA5-16 | Importação pela Home cria um novo projeto sem substituir outro. | E2E com banco já preenchido |
| CA5-17 | Importação pelo Playground é efêmera. | E2E reload + IndexedDB/localStorage |
| CA5-18 | Importação com falha de storage não cria registro parcial. | Teste de falha simulada |
| CA5-19 | IDs de nós/arestas e referências permanecem íntegros. | Teste de referências/criação |
| CA5-20 | Serviço ausente é visualizado como fallback sem apagar `serviceId`. | Round-trip com unknown ID |
| CA5-21 | Serviços reais são resolvidos por IDs exatos do manifesto. | Fixture gerada do registry |
| CA5-22 | Catálogo exportado tem contagem e IDs iguais aos da UI. | Teste de manifesto |
| CA5-23 | Ação **Exportar Kit para IA** baixa ZIP completo. | Inspeção do arquivo gerado |
| CA5-24 | Kit contém guia, prompt, schema, manifesto e exemplos válidos. | Teste de integridade do ZIP |
| CA5-25 | Todos os exemplos publicados são realmente importáveis. | Teste automatizado de exemplos |
| CA5-26 | `AGENTS.md` contém regra obrigatória de manutenção do contrato. | Revisão de diff |
| CA5-27 | `docs:ai:generate` é determinístico. | Duas execuções idênticas |
| CA5-28 | `docs:ai:check` falha em caso de docs defasados. | Teste de drift intencional |
| CA5-29 | Mudanças de schema/catalogVersion seguem política documentada. | Changelog e migrações |
| CA5-30 | Exports legados conhecidos ainda podem ser importados. | Fixtures das versões antigas |
| CA5-31 | Entradas maliciosas/volumosas são contidas com segurança. | Testes de limites e sanitização |
| CA5-32 | O fluxo funciona offline, sem backend nem login. | E2E com rede desativada |
| CA5-33 | Import/Export não quebra Home, editor, cenas, PNG nem Playground. | Regressões E2E |
| CA5-34 | Não existe campo “Notas do apresentador” nos nós. | QA UI + serialização |
| CA5-35 | UI é acessível e consistente com PRDs 3/4. | Capturas + navegação teclado |
| CA5-36 | Scripts existentes de lint/typecheck/test/build passam ou pendências são reportadas honestamente. | Logs de execução via pnpm |

**Definition of Done:** todos os CA5 P0 aplicáveis verificáveis com evidência (teste, diff, captura, arquivo). Não declarar completo se `docs:ai:check`, importação real, round-trip ou testes do Playground falharem.

---

## 19. Plano de implementação incremental

### Fatia A — Auditoria e congelamento do contrato atual

1. Ler PRDs/AGENTS e skills pertinentes.
2. Localizar registro real de catálogo e tipo `Project/Node/Edge/Drawing/Scene`.
3. Inspecionar exportador e importador legados; criar fixtures **reais** antes de migrar.
4. Registrar mapeamento campo interno ↔ campo público, inclusive zonas e desenhos livres.
5. Documentar pontos onde a estrutura atual não suporta campo do contrato; resolver com adaptadores compatíveis.

### Fatia B — Schema, domínio e round-trip

1. Criar contrato v1 e validator estrutural/semântico.
2. Implementar `serializeDiagram`, `deserializeDiagram`, `validateDiagram`, `migrateLegacy` (nomes apenas sugeridos).
3. Cobrir com testes round-trip e fixtures reais.
4. Integrar export `.mcss.json` preservando exportação PNG atual.

### Fatia C — Importação visual

1. Implementar/evoluir modal com Colar JSON e Upload.
2. Relatório de erros/avisos e prévia isolada.
3. Criar novo projeto com commit atômico.
4. Integrar modo Playground efêmero e aviso de descarte.
5. Validar E2E sem reescrever dashboard/editor.

### Fatia D — Kit para IA e sincronização

1. Construir manifesto de catálogo da fonte real.
2. Gerar schema público, guia, prompt e fixtures válidas.
3. Adicionar botão `Exportar Kit para IA` e gerador de ZIP compatível com local-first.
4. Adicionar `docs:ai:generate`, `docs:ai:check` e `test:diagram-contract`.
5. Atualizar `AGENTS.md` com regra obrigatória; adicionar QA no CI se houver.

### Fatia E — QA e entrega

1. Testes de import/export offline, grandes volumes, fallback, legados, erros semânticos.
2. Auditoria de privacidade/segurança e comparação visual com UI existente.
3. Verificar que não há regressão em cena, zona, desenho, controles e PNG.
4. Publicar evidências CA5 e pendências honestas.

---

## 20. Regras de qualidade para o assistente implementador

- **pnpm exclusivo** para gerenciar pacotes e executar scripts; preservar `pnpm-lock.yaml`.
- Descobrir e ler skills realmente disponíveis, em especial: `using-agent-skills`, `api-and-interface-design`, `domain-modeling`, `source-driven-development`, `security-and-hardening`, `test-driven-development`, `incremental-implementation`, `documentation-and-adrs`, `frontend-ui-engineering`, `vercel-react-best-practices`, `agent-browser`, `code-review-and-quality`, `ci-cd-and-automation` quando aplicáveis.
- Consultar documentação oficial atual de JSON Schema, validador escolhido, React Flow e ZIP client-side antes de usar APIs.
- Preservar identidade minimalista clara do Studio e componentes shadcn existentes.
- Não instalar dependência nova se a base já tiver solução adequada.
- Não armazenar BANT/JSON em serviços externos nem embutir exemplos com clientes reais.
- Não criar filtros, botões e indicadores fictícios apenas para parecer completo.
- Nenhuma tarefa contratual pode concluir com docs desatualizadas.
- Usar mensagens de erro reais e dados reais; não inventar resultados de testes.

---

## 21. Entregáveis e relatório final do agente

Ao concluir, entregar:

1. **Código funcional** do contrato, serializer, parser, import UI, preview, confirmação e kit exportável.
2. `mcss-diagram.schema.json` válido e `service-catalog.json` gerado do registro real.
3. `AI_GUIDE.md`, `PROMPT_TEMPLATE.md`, `FORMAT_CHANGELOG.md` e exemplos importáveis.
4. `AGENTS.md` atualizado com regra de sincronização obrigatória.
5. Scripts pnpm de geração, verificação e testes do contrato.
6. Testes unitários, integração, E2E e regressão de projetos legados.
7. Screenshots do modal de importar (estado válido, erro, aviso e preview) e demonstração de importação real.
8. Matriz `CA5-01` a `CA5-36`: status e evidência, separando não concluídos.
9. Lista de limitações explícitas (por exemplo, serviços sem metadados específicos ou formato legado desconhecido).
10. Resumo das skills efetivamente consultadas e dos scripts realmente executados.

---

## 22. Referências técnicas oficiais para implementação

Estas referências guiam a implementação; **o código real do repositório é a fonte para determinar o contrato existente e a compatibilidade**.

- JSON Schema, especificação e Draft 2020-12: https://json-schema.org/specification
- Ajv, suporte a JSON Schema 2020-12: https://ajv.js.org/json-schema.html
- React Flow, Save and Restore: https://reactflow.dev/examples/interaction/save-and-restore

> **Não confundir:** suporte do React Flow à serialização de seu estado não define a linguagem pública MCSS. O formato público deve passar por conversores de domínio para manter compatibilidade entre versões do editor e IAs externas.

---

## 23. Anexo — guia de prompt que o kit deverá conter

```text
Você é um arquiteto de soluções multicloud. Receberá (1) um BANT e requisitos,
(2) AI_GUIDE.md, (3) mcss-diagram.schema.json e (4) service-catalog.json.

Sua tarefa é gerar um diagrama de arquitetura para o MultiCloud Solution Studio.

REGRAS:
- Leia o schema e o catálogo, use o format e schemaVersion publicados.
- Para nós kind=service, utilize somente serviceIds EXATOS presentes no catálogo.
- Serviços não catalogados devem ser representados como nós generic identificados.
- Crie IDs de instância únicos e conexões com endpoints existentes.
- Use posições x/y legíveis, evitando sobreposição de nós e labels.
- Explicite premissas importantes no diagrama por labels/notas técnicas suportadas.
- Não invente valores de capacidade, preço, SLA, região ou compatibilidade.
- Não inclua dados de credenciais, segredos ou informações pessoais.
- Verifique que o resultado corresponde ao JSON Schema e que as referências
  entre nós, arestas e cenas estão íntegras.
- Devolva APENAS um objeto JSON completo; sem cercas Markdown ou comentários.

BANT E REQUISITOS:
[INSERIR AQUI O CONTEXTO REVISADO/ANONIMIZADO]
```

**Importante:** a versão gerada do prompt deve mencionar os campos e enums efetivamente publicados no kit; o texto acima é um modelo funcional inicial e não deve contrariar o validador final.
