#!/usr/bin/env node
const { spawn } = require("child_process");
const net = require("net");

async function detectPort(host = "localhost", defaultPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(defaultPort + 1));
    server.once("listening", () => {
      server.close(() => resolve(defaultPort));
    });
    server.listen(defaultPort, host);
  });
}

(async () => {
  const host = process.env.NEXT_DEV_SERVER_HOST || "127.0.0.1";
  const port = await detectPort(host, parseInt(process.env.NEXT_DEV_SERVER_PORT || "3000"));

  const env = {
    ...process.env,
    NEXT_DEV_SERVER_HOST: host,
    NEXT_DEV_SERVER_PORT: port.toString(),
    NEXT_DEV_SERVER_URL: `http://${host}:${port}`,
    NODE_ENV: "development"
  };

  process.stderr.write(`\x1b[32m✅ MCP Environment Active: ${env.NEXT_DEV_SERVER_URL}\x1b[0m\n`);

  const child = spawn("npx", ["-y", "next-devtools-mcp@latest"], {
    env,
    stdio: "inherit",
    shell: true
  });

  child.on("exit", (code) => process.exit(code || 0));
  
  // Garante que o processo morra corretamente ao fechar o editor
  process.on("SIGINT", () => child.kill("SIGINT"));
})();
