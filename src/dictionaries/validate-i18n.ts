import fs from 'fs';
import path from 'path';

// Configurações
const DICTIONARY_DIR = path.join(process.cwd(), 'src/dictionaries');
const MASTER_LOCALE = 'pt-BR.json';
const LOCALES_TO_CHECK = ['en-US.json', 'es-ES.json', 'es-AR.json', 'es-MX.json'];

function getKeys(obj: any, prefix = ''): string[] {
  return Object.keys(obj).reduce((res: string[], el) => {
    const name = prefix ? `${prefix}.${el}` : el;
    if (typeof obj[el] === 'object' && obj[el] !== null && !Array.isArray(obj[el])) {
      res.push(...getKeys(obj[el], name));
    } else {
      res.push(name);
    }
    return res;
  }, []);
}

function validate() {
  console.log(`\x1b[34m🔍 Iniciando validação de dicionários (Master: ${MASTER_LOCALE})...\x1b[0m\n`);

  const masterPath = path.join(DICTIONARY_DIR, MASTER_LOCALE);
  if (!fs.existsSync(masterPath)) {
    console.error(`❌ Arquivo mestre não encontrado em: ${masterPath}`);
    process.exit(1);
  }

  const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
  const masterKeys = getKeys(masterData);

  let hasErrors = false;

  LOCALES_TO_CHECK.forEach((file) => {
    const filePath = path.join(DICTIONARY_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Aviso: Arquivo ${file} não encontrado. Pulando...`);
      return;
    }

    const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const currentKeys = new Set(getKeys(currentData));

    const missing = masterKeys.filter((key) => !currentKeys.has(key));

    if (missing.length > 0) {
      hasErrors = true;
      console.log(`\x1b[31m❌ ${file} está incompleto:\x1b[0m`);
      missing.forEach((m) => console.log(`   - Faltando chave: ${m}`));
    } else {
      console.log(`\x1b[32m✅ ${file} está 100% sincronizado.\x1b[0m`);
    }
  });

  if (!hasErrors) {
    console.log(`\n\x1b[32m✨ Todos os dicionários estão consistentes!\x1b[0m`);
  } else {
    console.log(`\n\x1b[31m🚨 Foram encontrados problemas de tradução.\x1b[0m`);
    process.exit(1);
  }
}

validate();
