# MCSS Diagram Format — Changelog do Contrato

## [1.0.0] - 2026-11-15
### Adicionado
- Contrato JSON público oficial identificado por `format: "mcss.diagram"` e `schemaVersion: "1.0.0"`.
- Especificação formal de nós (`service`, `generic`, `group`, `shape`, `note`, `text`).
- Conexões direcionais com fluxos semânticos (`http`, `data`, `events`, `network`, `auth`, `generic`, `logical`).
- Suporte a Zonas Visuais multicloud com identificação de provedor e região.
- Suporte a desenhos livres vetoriais e cenas de apresentação com `speakerNotes`.
- Validador em duas camadas (estrutural Zod / JSON Schema e semântica com fallback seguro).
- Kit para IA com manifesto determinístico de 153 serviços reais.
