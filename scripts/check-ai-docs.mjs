import fs from 'fs';
import path from 'path';
import {
  generateServiceCatalogJson,
  generateMcssSchemaJson,
  generateReadmeMd,
  generateAiGuideMd,
  generatePromptTemplateMd,
  generateFormatChangelogMd,
  generateExamples,
} from './generate-ai-docs.mjs';

const ROOT_DIR = process.cwd();
const AI_DOCS_DIR = path.join(ROOT_DIR, 'docs/ai');
const EXAMPLES_DIR = path.join(AI_DOCS_DIR, 'examples');

let driftCount = 0;

function checkFile(filePath, expectedContent, displayName) {
  if (!fs.existsSync(filePath)) {
    console.error(`✗ Arquivo ausente: ${displayName}`);
    driftCount++;
    return;
  }

  const actualContent = fs.readFileSync(filePath, 'utf8');
  if (actualContent !== expectedContent) {
    console.error(`✗ Divergência detectada em: ${displayName}`);
    driftCount++;
  } else {
    console.log(`✓ Sincronizado: ${displayName}`);
  }
}

console.log('Verificando integridade e sincronismo da documentação de IA...');

checkFile(path.join(AI_DOCS_DIR, 'service-catalog.json'), generateServiceCatalogJson(), 'service-catalog.json');
checkFile(path.join(AI_DOCS_DIR, 'mcss-diagram.schema.json'), generateMcssSchemaJson(), 'mcss-diagram.schema.json');
checkFile(path.join(AI_DOCS_DIR, 'README.md'), generateReadmeMd(), 'README.md');
checkFile(path.join(AI_DOCS_DIR, 'AI_GUIDE.md'), generateAiGuideMd(), 'AI_GUIDE.md');
checkFile(path.join(AI_DOCS_DIR, 'PROMPT_TEMPLATE.md'), generatePromptTemplateMd(), 'PROMPT_TEMPLATE.md');
checkFile(path.join(AI_DOCS_DIR, 'FORMAT_CHANGELOG.md'), generateFormatChangelogMd(), 'FORMAT_CHANGELOG.md');

const examples = generateExamples();
for (const [name, content] of Object.entries(examples)) {
  checkFile(path.join(EXAMPLES_DIR, name), content, `examples/${name}`);
}

if (driftCount > 0) {
  console.error(`\n✗ Falha: ${driftCount} arquivos em docs/ai/ estão desatualizados em relação ao código.`);
  console.error('Execute "pnpm docs:ai:generate" para sincronizar a documentação do Kit para IA.');
  process.exit(1);
} else {
  console.log('\n✓ Todos os artefatos de IA estão 100% sincronizados com o código.');
}
