#!/usr/bin/env node

/**
 * Wrapper MCP para Next.js 16
 * Este arquivo permanece na raiz para ser chamado pelo .mcp.json
 */

const { spawn } = require("child_process");
const net = require("net");

// Função para checar porta disponível (Melhorada para TS 6/Node 22+)
async function detectPort(host = "localhost", defaultPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(defaultPort + 1)); // Tenta a próxima se estiver ocupada
    server.once("listening", () => {
      server.close(() => resolve(defaultPort));
    });
    server.listen(defaultPort, host);
  });
}

(async () => {
  const host = process.env.NEXT_DEV_SERVER_HOST || "localhost";
  const port = await detectPort(host, parseInt(process.env.NEXT_DEV_SERVER_PORT || "3000"));

  const env = {
    ...process.env,
    NEXT_DEV_SERVER_HOST: host,
    NEXT_DEV_SERVER_PORT: port.toString(),
    NEXT_DEV_SERVER_URL: `http://${host}:${port}`,
    NODE_ENV: process.env.NODE_ENV || "development"
  };

  console.error(`\x1b[32m✅ MCP Environment Active: ${env.NEXT_DEV_SERVER_URL}\x1b[0m`);

  // Inicia o servidor MCP real. 
  // Em 2026, usamos npx para garantir a versão estável do devtools
  const child = spawn("npx", ["-y", "next-devtools-mcp@latest"], {
    env,
    stdio: "inherit", 
    shell: true
  });

  child.on("exit", (code) => process.exit(code || 0));
})();
