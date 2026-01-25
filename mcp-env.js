#!/usr/bin/env node
const { spawn } = require("child_process");
const net = require("net");

// Função para checar porta padrão ou próxima disponível
function detectPort(host = "localhost", defaultPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(defaultPort)); 
    server.once("listening", () => {
      server.close(() => resolve(defaultPort));
    });
    server.listen(defaultPort, host);
  });
}

(async () => {
  const host = process.env.NEXT_DEV_SERVER_HOST || "localhost";
  const port = process.env.NEXT_DEV_SERVER_PORT || (await detectPort(host, 3000));

  const env = {
    ...process.env,
    NEXT_DEV_SERVER_HOST: host,
    NEXT_DEV_SERVER_PORT: port.toString(),
    NEXT_DEV_SERVER_URL: `http://${host}:${port}`,
    NODE_ENV: process.env.NODE_ENV || "development"
  };

  console.error(`✅ MCP Environment: ${env.NEXT_DEV_SERVER_URL}`);

  // Inicia o servidor MCP real como um processo filho
  // Isso permite que o .mcp.json chame apenas este script
  const cmd = "npx";
  const args = ["-y", "next-devtools-mcp@latest"];

  const child = spawn(cmd, args, {
    env,
    stdio: "inherit", // Mantém a comunicação stdio necessária para o protocolo MCP
    shell: true
  });

  child.on("exit", (code) => process.exit(code || 0));
})();
