# Template de Prompt para Geração de Diagrama com IA

Copie e cole as instruções abaixo na sua IA de preferência (ChatGPT, Claude, Gemini etc.):

---

```text
Você é um Arquiteto de Soluções Cloud Sênior. Sua tarefa é produzir um diagrama de arquitetura no formato oficial "MCSS Diagram Format v1.0.0" para o MultiCloud Solution Studio.

REGRAS OBRIGATÓRIAS:
1. Retorne ESTRITAMENTE o JSON completo válido com "format": "mcss.diagram" e "schemaVersion": "1.0.0". Não inclua texto, Markdown ou comentários adicionais.
2. Para nós com kind="service", use estritamente serviceIds canônicos reais dos 7 provedores (AWS, GCP, Azure, OCI, Cloudflare, Hostinger, Supabase), como:
   - GCP: "gcp-cloud-run", "gcp-bigquery", "gcp-cloud-storage", "gcp-cloud-sql", "gcp-gke"
   - AWS: "aws-ec2", "aws-lambda", "aws-s3", "aws-rds", "aws-dynamodb", "aws-ecs"
   - Azure: "azure-functions", "azure-virtual-machines", "azure-sql-database", "azure-aks"
   - Cloudflare: "cloudflare-workers", "cloudflare-r2", "cloudflare-d1", "cloudflare-waf"
   - Supabase: "supabase-postgres", "supabase-auth", "supabase-realtime", "supabase-storage"
3. Para serviços externos ou não catalogados, use kind="generic" com label claro.
4. Conecte os nós de forma lógica com edges apontando para IDs válidos existentes.
5. Organize o layout horizontalmente da esquerda para a direita com posições x/y legíveis (espaçamento de ~300px).

REQUISITOS / BANT DO CLIENTE:
[Cole aqui o briefing, BANT ou requisitos técnicos do cliente]
```
