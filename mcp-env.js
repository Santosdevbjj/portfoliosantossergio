#!/usr/bin/env node
const { spawn } = require("child_process");
const net = require("net");
const fs = require("fs");
const path = require("path");

/**
 * MCP ENVIRONMENT HELPER - NEXT.JS 16.2.0 (MARCH 2026)
 * -----------------------------------------------------------------------------
 * ✔ Suporte nativo ao Turbopack (Next 16.2)
 * ✔ Verificador de Assets (PDFs e OG Images nos 5 idiomas)
 * ✔ Encaminhamento de logs para Agentes de IA
 */

async function detectPort(host = "127.0.0.1", defaultPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(defaultPort + 1));
    server.once("listening", () => {
      server.close(() => resolve(defaultPort));
    });
    server.listen(defaultPort, host);
  });
}

// Validação dos Assets Multilíngues (Sergio Santos Portfolio)
function validatePortfolioAssets() {
  const locales = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"];
  const missing = [];

  locales.forEach(lang => {
    const pdfPath = path.join(process.cwd(), "public/pdf", `cv-sergio-santos-${lang}.pdf`);
    const ogPath = path.join(process.cwd(), "public/og", `og-image-${lang}.png`);
    
    if (!fs.existsSync(pdfPath)) missing.push(`📄 PDF: ${lang}`);
    if (!fs.existsSync(ogPath)) missing.push(`🖼️ OG: ${lang}`);
  });

  if (missing.length > 0) {
    process.stderr.write(`\x1b[33m⚠️  Assets Faltantes:\x1b[0m\n${missing.join("\n")}\n`);
  } else {
    process.stderr.write(`\x1b[32m✅ Assets Multilíngues: Todos os 10 arquivos detectados.\x1b[0m\n`);
  }
}

(async () => {
  const host = process.env.NEXT_DEV_SERVER_HOST || "127.0.0.1";
  const port = await detectPort(host, parseInt(process.env.NEXT_DEV_SERVER_PORT || "3000"));

  // Configurações específicas para Next.js 16.2 + Turbopack
  const env = {
    ...process.env,
    NEXT_DEV_SERVER_HOST: host,
    NEXT_DEV_SERVER_PORT: port.toString(),
    NEXT_DEV_SERVER_URL: `http://${host}:${port}`,
    NODE_ENV: "development",
    NEXT_TURBO: "1", // Ativa otimizações do Turbopack no MCP
    NEXT_DEBUG_PPR: "1" // Debug do Partial Prerendering
  };

  validatePortfolioAssets();

  process.stderr.write(`\x1b[34m🚀 MCP Engine: Sergio Santos Portfolio @ ${env.NEXT_DEV_SERVER_URL}\x1b[0m\n`);

  // Usando o novo inspetor oficial para Agentes de IA (v16.2)
  const child = spawn("npx", ["-y", "@vercel/next-browser", "serve"], {
    env,
    stdio: "inherit",
    shell: true
  });

  child.on("exit", (code) => process.exit(code || 0));
  
  // Encerramento limpo para evitar processos órfãos no Node 24
  process.on("SIGINT", () => {
    child.kill("SIGINT");
    process.exit();
  });
})();
