===== FILE:    package.json =====
<conteúdo completo do arquivo  

{
  "name": "portfolio-sergio-santos",
  "version": "13.0.1",
  "private": true,
  "author": "Sérgio Santos",
  "description": "Portfólio de Engenharia de Dados - Tailwind v4.0.6 & Lucide 0.563",
  "type": "module",
  "engines": {
    "node": "24.x"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:fast": "next build --no-lint",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "next typegen && tsc --noEmit",
    "clean": "rm -rf .next node_modules package-lock.json && npm install"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "framer-motion": "12.34.0",
    "lucide-react": "0.563.0",
    "clsx": "2.1.1",
    "tailwind-merge": "3.4.0",
    "class-variance-authority": "0.7.1",
    "next-themes": "0.4.6",
    "tailwindcss": "4.1.18"
  },
  "devDependencies": {
    "typescript": "6.0.0-beta",
    "@tailwindcss/postcss": "4.1.18",
    "postcss": "8.5.6",
    "@types/node": "25.2.3",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "eslint": "10.0.0",
    "eslint-config-next": "16.1.6",
    "sharp": "^0.34.5"
  }
} 
>









===== FILE:    tsconfig.json    =====
<conteúdo completo do arquivo

{
  "compilerOptions": {
    /* --- MOTOR NATIVO TS 6.0 & NEXT.JS 16 --- */
    "target": "ESNext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "ESNext",
    "moduleResolution": "Bundler",   
    "verbatimModuleSyntax": true,    /* Exige import type para tipos */
    "isolatedDeclarations": true,    /* Melhora performance de build em 2026 */
    "moduleDetection": "force",
    "noEmit": true,

    /* --- RIGOR DE MISSÃO CRÍTICA (Padrão Bancário) --- */
    "strict": true,
    "noUncheckedIndexedAccess": true, 
    "exactOptionalPropertyTypes": true, 
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "noUnusedLocals": true,
    "noUnusedParameters": false, 
    /* "noUncheckedSideEffectImports": true, */ /* Removido: pode causar erro com CSS imports */

    /* --- NEXT.JS 16 & REACT 19 ARCHITECTURE --- */
    "jsx": "react-jsx",
    "incremental": true,
    "tsBuildInfoFile": "node_modules/.cache/tsconfig.tsbuildinfo",
    
    /* --- INTEROP & SECURITY --- */
    "esModuleInterop": true,         
    "resolveJsonModule": true,
    "allowJs": true,
    "skipLibCheck": true,          
    "forceConsistentCasingInFileNames": true,

    /* --- PERFORMANCE & TYPES --- */
    "types": ["node"],
    /* Removida stableTypeOrdering pois é experimental no TS 6.0 */

    /* --- INFRASTRUCTURE PATHS --- */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "#/*": ["./src/*"]
    },

    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts" /* Mantido como sugerido pelo Next.js */
  ],

  "exclude": [
    "node_modules", 
    ".next", 
    "out",
    "build"
  ]
} 
>





===== FILE:    next.config.ts  =====
<conteúdo completo do arquivo

import type { NextConfig } from "next";

/**
 * NEXT.JS 16 & NODE 24 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * Node.js: 24.x (LTS)
 * TS Engine: 6.0 Ready
 * i18n Strategy: App Router Middleware (Configuração removida para evitar erro de build)
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Suporte nativo para telemetria no Node 24 (Otimizado para Sharp)
  serverExternalPackages: ["@microsoft/applicationinsights-web"], 

  experimental: {
    // Next 16: Otimização agressiva de pacotes de UI
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "date-fns"
    ],
    // React 19/20 Taint API: Segurança para dados sensíveis do backend
    taint: true, 
    // Habilita o novo motor de cache estável do Next 16
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  /* * NOTA: O bloco 'i18n' foi removido porque o App Router lida com isso 
   * via diretórios [lang] e Middleware. Mantê-lo aqui causaria erro de build.
   */

  images: {
    // AVIF priorizado (Padrão ouro em 2026)
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.medium.com',
      }
    ],
    minimumCacheTTL: 3600, 
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  typescript: {
    // Rigor do TS 6.0: Impede deploys com bugs de tipagem
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json'
  },

  // Segurança e Performance
  poweredByHeader: false, 
  compress: true,        
  
  // Transpilação de lógica de negócio compartilhada
  transpilePackages: ['@santos/portfolio-logic'], 
};

export default nextConfig;
>








===== FILE:  eslint.config.mjs   =====
<conteúdo completo do arquivo

import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { fixupConfigRules } from '@eslint/compat';
import tseslint from 'typescript-eslint'; // Importação direta recomendada no v10

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  /**
   * 1️⃣ Ignorar arquivos gerados e de infraestrutura
   */
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'public/**',
      '**/*.d.ts',
      'next.config.ts', // Configs de infra costumam ter regras próprias
    ],
  },

  /**
   * 2️⃣ Configuração de Parser para TS 6.0
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Habilita o novo motor de performance do TS 6.0
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024, // Atualizado para 2024 (Node 24)
      },
    },
  },

  /**
   * 3️⃣ Compatibilidade Next.js 16 & Plugins v10
   */
  ...fixupConfigRules(
    compat.extends(
      'plugin:@next/next/core-web-vitals',
      'plugin:@typescript-eslint/recommended-type-checked' // Versão mais segura para Ciência de Dados
    )
  ),

  /**
   * 4️⃣ Regras Customizadas e Refinamento
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      /* --- Performance & Next.js 16 (RSC) --- */
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',

      /* --- TypeScript 6.0 Engine --- */
      // Obriga o uso de 'type' no import, reduzindo o bundle final (Tree-shaking)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Regra de ouro para 2026: detectar código depreciado do ecossistema
      '@typescript-eslint/no-deprecated': 'warn',

      // Tratamento inteligente de variáveis não usadas
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true 
        },
      ],

      /* --- Flexibilidade (Ideal para manipulação de objetos dinâmicos/JSON) --- */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      /* --- React & Clean Code --- */
      'react/react-in-jsx-scope': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      
      // Garante que o build falhe se houver promessas flutuantes (Importante para o Dictionary async)
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },

  /**
   * 5️⃣ Formatação
   */
  prettier,
];

>




===== FILE:   vercel.ts  =====
<conteúdo completo do arquivo

// vercel.ts
/**
 * VERCEL CONFIGURATION
 * -----------------------------------------------------------------------------
 * Removida a tipagem estrita de @vercel/config/v1 que estava causando o erro
 * "Type '"image/webp"' is not assignable to type '"image/png"'".
 */

const config = {
  framework: 'nextjs',
  cleanUrls: true,
  trailingSlash: false,

  images: {
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Removendo a tipagem estrita, o compilador aceita os formatos modernos
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ]
  },

  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { 
          key: 'Strict-Transport-Security', 
          value: 'max-age=31536000; includeSubDomains; preload' 
        }
      ],
    }
  ],

  redirects: [
    {
      source: '/',
      destination: '/pt',
      permanent: false
    }
  ]
};

export default config;

>










===== FILE: .prettierrc.json   =====
<conteúdo completo do arquivo

{
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "singleAttributePerLine": true,
  "embeddedLanguageFormatting": "auto",
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",

  "plugins": [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports"
  ],

  "// Import Sorting Config": "Configuração para o plugin @trivago",
  "importOrder": [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/types/(.*)$",
    "^@/dictionaries/(.*)$",
    "^@/domain/(.*)$",
    "^@/services/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/(.*)$",
    "^@/styles/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,

  "tailwindAttributes": ["className", "class", "tw"],
  "tailwindFunctions": ["clsx", "twMerge", "twJoin", "cn", "cva"],

  "overrides": [
    {
      "files": [
        "**/app/api/**/route.tsx",
        "**/app/api/**/route.ts",
        "**/app/**/og.tsx",
        "**/app/**/og.ts"
      ],
      "options": {
        "printWidth": 120,
        "bracketSameLine": true,
        "singleAttributePerLine": false,
        "htmlWhitespaceSensitivity": "ignore",
        "embeddedLanguageFormatting": "off"
      }
    },
    {
      "files": ["*.json", "*.jsonc"],
      "options": {
        "parser": "json",
        "singleQuote": false
      }
    }
  ]
}

>











===== FILE: mcp-env.js =====
<conteúdo completo do arquivo

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

>









===== FILE: additional-modules.d.ts =====
<conteúdo completo do arquivo

// src/types/additional-modules.d.ts
declare module "*.css" {
  const content: any;
  export default content;
}

>












===== FILE:  .npmrc =====
<conteúdo completo do arquivo

legacy-peer-deps=true

>






===== FILE:  .mcp.json =====
<conteúdo completo do arquivo

{
  "mcpServers": {
    "next-devtools": {
      "description": "Next.js DevTools MCP - Auto-detecting env",
      "command": "node",
      "args": ["mcp-env.js"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    "typescript-analyzer": {
      "description": "TypeScript analysis server using MCP",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-typescript",
        "--project",
        "."
      ]
    }
  }
}
>






===== FILE: src/app/[lang]/global-error.tsx =====
<conteúdo completo do arquivo>





===== FILE:   .gitignore    =====
<conteúdo completo do arquivo

# =====================================================
# DEPENDÊNCIAS — Node.js / NPM / Bun
# =====================================================
node_modules/
.pnp
.pnp.js
.yarn/
# Lockfiles são essenciais (MANTENHA package-lock.json ou pnpm-lock.yaml)

# =====================================================
# BUILD E SAÍDA — Next.js 16 + Turbopack
# =====================================================
.next/
# IMPORTANTE: Mantemos o cache para acelerar builds na Vercel/CI
!.next/cache/
.next/trace
.next/types
out/
build/
dist/
.vercel/

# TypeScript 6.0 Incremental & Metadata
*.tsbuildinfo
next-env.d.ts
# O TS 6.0 gera definições automáticas para Server Actions e Metadata
.next/server-reference-manifest.json

# =====================================================
# VARIÁVEIS DE AMBIENTE — SEGURANÇA MÁXIMA
# =====================================================
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local
# Arquivos de credenciais de Cloud/Databricks
.azure/
.aws/
*.pem
*.key
*.pub

# Permitir apenas o modelo de exemplo
!.env.example

# =====================================================
# LOGS, CACHE E PERFORMANCE (Turborepo / Nx)
# =====================================================
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
*.log
.cache/
.turbo/
.eslintcache
.stylelintcache
coverage/
.nyc_output/

# =====================================================
# SISTEMA OPERACIONAL
# =====================================================
.DS_Store
.DS_Store?
._*
Thumbs.db
desktop.ini

# =====================================================
# IDEs E EDITORES
# =====================================================
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
!.vscode/launch.json
.idea/
*.swp
*.swo

# =====================================================
# CIÊNCIA DE DADOS E BACKEND (Python/SQL/Neo4J)
# =====================================================
# Ignora arquivos de dados pesados e temporários
*.csv
*.xlsx
*.parquet
*.sqlite
*.db
*.jsonl

# Python (Venv & Notebooks)
.venv/
env/
venv/
__pycache__/
*.py[cod]
*$py.class
.ipynb_checkpoints/
.python-version

# =====================================================
# ARQUIVOS TEMPORÁRIOS E BACKUPS
# =====================================================
*.tmp
*.temp
*.bak
*.old
*.patch

>





===== FILE:   .env.example    =====
<conteúdo completo do arquivo

# ============================================================================
# CONFIGURAÇÕES DE AMBIENTE — PORTFÓLIO SÉRGIO SANTOS
# ============================================================================
# 📌 Instruções:
# 1. Copie este arquivo para: .env.local
# 2. Preencha os valores reais
# 3. NUNCA versionar .env.local no GitHub
# ============================================================================
# Projeto: Next.js 16 + App Router + Vercel + i18n (pt/en/es)
# ============================================================================

# ----------------------------------------------------------------------------
# GITHUB — CONFIGURAÇÕES DE INTEGRAÇÃO
# ----------------------------------------------------------------------------

# Nome de usuário do GitHub
# Usado para buscar automaticamente os repositórios públicos do portfólio
NEXT_PUBLIC_GITHUB_USERNAME=Santosdevbjj

# GitHub Personal Access Token (SERVER-SIDE ONLY)
# ----------------------------------------------------------------------------
# ⚠️ NÃO use o prefixo NEXT_PUBLIC
# ⚠️ Este token NÃO deve ser exposto ao navegador
#
# Gere em:
# GitHub → Settings → Developer Settings → Personal Access Tokens
# Tipo recomendado: Fine-grained token
# Permissões mínimas:
# - Contents: Read-only
#
# Benefício:
# - Evita rate limit (60 req/h sem token → 5.000 req/h com token)
#
GITHUB_ACCESS_TOKEN=seu_token_aqui

# ----------------------------------------------------------------------------
# APLICAÇÃO — CONFIGURAÇÕES GERAIS
# ----------------------------------------------------------------------------

# URL base do site
# Usada para:
# - OpenGraph (og:image)
# - SEO metadata
# - Canonical URLs
#
# Exemplos:
# Local:      http://localhost:3000
# Preview:    https://seu-projeto-git-branch.vercel.app
# Produção:   https://portfoliosantossergio.vercel.app
#
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ----------------------------------------------------------------------------
# ANALYTICS — OPCIONAL
# ----------------------------------------------------------------------------

# Google Analytics (GA4)
# Descomente apenas se for utilizar
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

>








===== FILE:    .editorconfig   =====
<conteúdo completo do arquivo

# EditorConfig: Padronização Universal de Código
# Projeto: Portfolio Sérgio Santos
# Mantém consistência entre IDEs e previne diffs desnecessários no Git

root = true

# ======================================================
# Configuração global (default)
# ======================================================
[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

# ======================================================
# Markdown e MDX (preservar espaços finais para <br>)
# ======================================================
[*.{md,mdx}]
trim_trailing_whitespace = false
indent_size = 2

# ======================================================
# Python e SQL (PEP8 e legibilidade)
# ======================================================
[*.{py,sql}]
indent_style = space
indent_size = 4

# ======================================================
# Jupyter Notebooks (JSON – não modificar trailing whitespace)
# ======================================================
[*.ipynb]
indent_style = space
indent_size = 2
trim_trailing_whitespace = false

# ======================================================
# Desenvolvimento Web Moderno
# Next.js, React, TypeScript, CSS, Tailwind, Infra YAML
# ======================================================
[*.{js,jsx,ts,tsx,cjs,mjs,cts,mts,css,scss,html,yml,yaml,toml}]
indent_style = space
indent_size = 2

# ======================================================
# Arquivos estruturados (JSON, XML, WebManifest, Configs)
# ======================================================
[*.{json,xml,webmanifest}]
indent_style = space
indent_size = 2

# ======================================================
# Variáveis de ambiente (.env)
# ======================================================
[*.env*]
indent_style = space
indent_size = 2
trim_trailing_whitespace = false

# ======================================================
# Shell Scripts (sh, bash, zsh)
# Escolha consciente: spaces + 4 para legibilidade
# ======================================================
[*.{sh,bash,zsh}]
indent_style = space
indent_size = 4

[Dockerfile]
indent_style = space
indent_size = 4

# ======================================================
# Makefiles (exigem TAB real)
# ======================================================
[Makefile]
indent_style = tab
indent_size = 4

# ======================================================
# Dados brutos e logs (não remover whitespace)
# ======================================================
[*.{csv,log}]
trim_trailing_whitespace = false
insert_final_newline = false

# ======================================================
# Lockfiles (preservar newline final)
# ======================================================
[*.lock]
trim_trailing_whitespace = false
insert_final_newline = true

# ======================================================
# Arquivos binários e assets (não modificar)
# ======================================================
[*.{png,jpg,jpeg,gif,webp,svg,ico,pdf,woff,woff2}]
insert_final_newline = false
trim_trailing_whitespace = false

>






===== FILE:  .vscode/extensions.json =====
<conteúdo completo do arquivo

{
  "recommendations": [
    // ======================================================
    // Next.js / React / TypeScript
    // ======================================================
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",

    // ======================================================
    // Tailwind CSS (DX completo)
    // ======================================================
    "bradlc.vscode-tailwindcss",

    // ======================================================
    // UI / UX / Acessibilidade
    // ======================================================
    "deque-systems.vscode-axe-linter",

    // ======================================================
    // Git / Produtividade
    // ======================================================
    "eamodio.gitlens",

    // ======================================================
    // Markdown / MDX / Docs
    // ======================================================
    "davidanson.vscode-markdownlint",

    // ======================================================
    // Infra / Config / Qualidade
    // ======================================================
    "editorconfig.editorconfig",

    // ======================================================
    // Ícones e Visual (opcional, mas recomendado)
    // ======================================================
    "pkief.material-icon-theme"
  ],

  "unwantedRecommendations": [
    // ======================================================
    // Evita conflitos com Prettier / ESLint
    // ======================================================
    "hookyqr.beautify",
    "esbenp.prettier-vscode-eslint"
  ]
}

>









===== FILE:  .vscode/settings.json   =====
<conteúdo completo do arquivo


{
  // ======================================================
  // Formatação Geral
  // ======================================================
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // ======================================================
  // ESLint (Flat Config - Next.js 16)
  // ======================================================
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.useFlatConfig": true,
  "eslint.experimental.useFlatConfig": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],

  // ======================================================
  // Prettier
  // ======================================================
  "prettier.requireConfig": true,
  "prettier.useEditorConfig": true,

  // ======================================================
  // Tailwind CSS DX
  // ======================================================
  "editor.quickSuggestions": {
    "strings": true
  },
  "tailwindCSS.classAttributes": ["class", "className"],
  "tailwindCSS.experimental.classRegex": [
    "(clsx|cn|twMerge)\\(([^)]*)\\)"
  ],

  // ======================================================
  // Controle por Linguagem
  // ======================================================
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // ======================================================
  // Arquivos sensíveis (não formatar automaticamente)
  // ======================================================
  "[dotenv]": {
    "editor.formatOnSave": false
  },
  "[csv]": {
    "editor.formatOnSave": false
  },
  "[log]": {
    "editor.formatOnSave": false
  },

  // ======================================================
  // Integração TypeScript + Next.js
  // ======================================================
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.format.enable": false,
  "typescript.suggest.completeFunctionCalls": true,
  "typescript.updateImportsOnFileMove.enabled": "always",

  // ======================================================
  // Integração React / JS
  // ======================================================
  "javascript.suggest.autoImports": true,
  "typescript.suggest.autoImports": true
}

>





===== FILE: public/cv-sergio-santos-en.pdf =====
<conteúdo completo do arquivo
 meu currículo em inglês 

>





===== FILE: public/cv-sergio-santos-es.pdf =====
<conteúdo completo do arquivo
   meu currículo vitae em espanhol 

>





===== FILE: public/cv-sergio-santos-pt.pdf =====
<conteúdo completo do arquivo
  meu currículo em português 

>





===== FILE:  public/og-image-en.png =====
<conteúdo completo do arquivo
  minha ogImage em inglês 

>






===== FILE:   public/og-image-es.png =====
<conteúdo completo do arquivo
  minha ogImage em espanhol 

>




===== FILE: public/og-image-pt.png =====
<conteúdo completo do arquivo
   minha ogImage em português 
>





===== FILE: public/icons/apple-icon.png =====
<conteúdo completo do arquivo>




===== FILE: public/icons/apple-touch-icon.png  =====
<conteúdo completo do arquivo>




===== FILE: public/icons/favicon.ico   =====
<conteúdo completo do arquivo>





===== FILE: public/icons/icon.png  =====
<conteúdo completo do arquivo>




===== FILE: public/images/sergio-santos-profile.png  =====
<conteúdo completo do arquivo>




===== FILE:  public/images/trofeu-35-edicao.png    =====
<conteúdo completo do arquivo
   trofeu de melhor artigo da 35° competição de artigos da DIO 
  
"Low-Code na Saúde: Como Criar Apps Médicos em Semanas"

>





===== FILE:  public/images/trofeu-melhor-artigo-setembro.png  =====
<conteúdo completo do arquivo
  troféu de melhor artigo do mês de setembro de 2025 da DIO 


"Low-Code na Saúde: Como Criar Apps Médicos em Semanas"

>




===== FILE: src/app/[lang]/layout.tsx  =====
<conteúdo completo do arquivo
// ESTOU USANDO A TAG DO GOOGLE 

/**
 * ROOT LAYOUT — NEXT.JS 16 — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔️ TOTALMENTE ALINHADO: src/types/dictionary.ts e src/dictionaries/index.ts
 * ✔️ SEO: Suporte a multilingue (PT, EN, ES) com x-default
 * ✔️ ACESSIBILIDADE: Skip links e ARIA labels dinâmicos
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'

import { ThemeProvider } from '@/components/ThemeToggle'
import { CookieBanner } from '@/components/CookieBanner'
import { getServerDictionary } from "@/lib/getServerDictionary"
import type { Locale } from "@/types/dictionary"

/* --- FONTS --- */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

/* --- VIEWPORT --- */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

/* --- SEO & METADATA --- */
interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getServerDictionary(lang)
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app'

  return {
    metadataBase: new URL(siteUrl),
    verification: {
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },
    title: {
      default: `Sérgio Santos | ${dict.common.role}`,
      template: `%s | Sérgio Santos`,
    },
    description: dict.seo.description,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'pt-BR': `${siteUrl}/pt-BR`,
        'en-US': `${siteUrl}/en-US`,
        'es-ES': `${siteUrl}/es-ES`,
        'es-AR': `${siteUrl}/es-AR`,
        'es-MX': `${siteUrl}/es-MX`,
        'x-default': `${siteUrl}/pt-BR`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${lang}`,
      title: "Sérgio Santos",
      description: dict.seo.description,
      siteName: dict.seo.siteName,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sérgio Santos Portfolio' }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/* --- ROOT LAYOUT --- */
export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params
  const dict = await getServerDictionary(lang)

  return (
    <html
      lang={lang}
      dir={dict.meta.direction}
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable} scroll-smooth`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3XF5BTP58V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3XF5BTP58V');
          `}
        </Script>
      </head>

      <body className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased font-inter">
        <ThemeProvider>
          {/* Skip Link para Acessibilidade — Texto corrigido para fluxo de navegação */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-blue-600 focus:text-white focus:rounded-b-lg shadow-lg"
          >
            {dict.common.navigation}
          </a>

          <main id="main-content" className="flex-grow">
            {children}
          </main>

          <CookieBanner lang={lang} dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  )
}


>



===== FILE: src/app/[lang]/page.tsx  =====
<conteúdo completo do arquivo

// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { getDictionary } from "@/dictionaries";
import type { Locale, Dictionary } from "@/types/dictionary";
import { getGitHubProjects } from "@/services/githubService";

import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

// ---------------------------------------------
// Tipos
// ---------------------------------------------
interface PageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

// ---------------------------------------------
// Constantes
// ---------------------------------------------
const SUPPORTED_LOCALES: readonly Locale[] = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX",
] as const;

// ---------------------------------------------
// Static Params (SSG)
// ---------------------------------------------
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

// ---------------------------------------------
// Viewport
// ---------------------------------------------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

// ---------------------------------------------
// Metadata (SEO)
// ---------------------------------------------
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { lang } = await params;

  if (!SUPPORTED_LOCALES.includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app";

  const homeSeo = dict.seo.pages?.home;
  const pageTitle = `${homeSeo?.title ?? "Portfolio"} | ${dict.meta.author}`;

  return {
    title: pageTitle,
    description: homeSeo?.description ?? dict.seo.description,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        "pt-BR": `${siteUrl}/pt-BR`,
        "en-US": `${siteUrl}/en-US`,
        "es-ES": `${siteUrl}/es-ES`,
        "es-AR": `${siteUrl}/es-AR`,
        "es-MX": `${siteUrl}/es-MX`,
      },
    },
  };
}

// ---------------------------------------------
// Page
// ---------------------------------------------
export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

  if (!SUPPORTED_LOCALES.includes(lang)) {
    notFound();
  }

  const projects = await getGitHubProjects();

  return (
    <ProxyPage lang={lang}>
      {(dictionary: Dictionary) => (
        <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
          
          {/* Hero */}
          <HeroSection dict={dictionary} lang={lang} />

          {/* About */}
          <AboutSection dict={dictionary} lang={lang} />

          {/* Projects */}
          <section
            id="projects"
            className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-24 max-w-7xl"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12">
              {dictionary.projects.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <article
                    key={project.id}
                    className="group p-6 border rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10"
                  >
                    <span className="text-[10px] font-bold uppercase text-blue-600">
                      {dictionary.projects.categories[
                        project.technology.labelKey as keyof typeof dictionary.projects.categories
                      ] ?? project.technology.id}
                    </span>

                    <h3 className="text-xl font-bold mt-2">
                      {project.name}
                    </h3>

                    <p className="text-sm mt-3 text-slate-600 dark:text-slate-400 line-clamp-3">
                      {project.description}
                    </p>

                    <a
                      href={project.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 text-xs font-bold underline"
                    >
                      {dictionary.projects.viewProject}
                    </a>
                  </article>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-500">
                    {dictionary.states.emptyProjects.description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-200 py-12 text-center">
            <p className="text-sm text-slate-500">
              {dictionary.common.footer}
            </p>
          </footer>
        </main>
      )}
    </ProxyPage>
  );
}


>






===== FILE: src/app/[lang]/error.tsx  =====
<conteúdo completo do arquivo

'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  RotateCcw,
  AlertCircle,
  Home,
  ShieldAlert,
} from 'lucide-react'

import { getDictionary } from '@/dictionaries'
import type { Dictionary, Locale } from '@/types/dictionary'
import { i18n } from '@/i18n-config'

interface ErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
  readonly params: { lang: Locale }
}

export default function Error({ error, reset, params }: ErrorProps) {
  const [dict, setDict] = useState<Dictionary | null>(null)

  // Memoiza o idioma para evitar re-cálculos
  const currentLang: Locale = useMemo(() => {
    const supportedLocales: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]
    return supportedLocales.includes(params?.lang) 
      ? params.lang 
      : (i18n.defaultLocale as Locale)
  }, [params?.lang])

  /**
   * Carrega o dicionário e faz o log do erro
   */
  useEffect(() => {
    // Carregamento assíncrono do dicionário (Resolve o erro do Vercel)
    getDictionary(currentLang).then(setDict)

    // Log técnico para monitoramento
    console.error('🔥 [Application Error]:', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    })
  }, [error, currentLang])

  // Estado de carregamento simples enquanto o dicionário não chega
  if (!dict) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="animate-pulse text-slate-400 font-mono">Loading error context...</div>
      </div>
    )
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617]"
    >
      <section className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-red-900/20 p-8 rounded-[2rem] shadow-2xl text-center space-y-8">
        
        {/* Badge de Status */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-full">
          <ShieldAlert
            size={12}
            className="text-red-600 dark:text-red-500"
            aria-hidden="true"
          />
          <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest">
            ERROR
          </span>
        </div>

        {/* Ícone de Alerta */}
        <div className="mx-auto w-20 h-20 flex items-center justify-center">
          <AlertCircle
            size={64}
            className="text-red-500"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        {/* Conteúdo Textual - Alinhado com Dictionary.common.errorBoundary */}
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {dict.common.errorBoundary.title}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {dict.common.errorBoundary.description}
          </p>
        </div>

        {/* Ações Responsivas (Stack no mobile, Row no desktop) */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
          >
            <RotateCcw size={18} />
            {dict.common.errorBoundary.actions.retry}
          </button>

          <Link
            href={`/${currentLang}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition active:scale-95"
          >
            <Home size={18} />
            {dict.common.errorBoundary.actions.home}
          </Link>
        </div>

        {/* ID Técnico para Suporte */}
        {error.digest && (
          <div className="pt-4">
            <code className="block p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-[10px] text-slate-400 font-mono break-all">
              TRACE_ID: {error.digest}
            </code>
          </div>
        )}
      </section>
    </div>
  )
}

>




===== FILE:src/app/[lang]/loading.tsx  =====
<conteúdo completo do arquivo

/**
 * LOADING: Skeleton Screen
 * -----------------------------------------------------------------------------
 * Renderizado instantaneamente via React Suspense (Streaming).
 * Totalmente responsivo e alinhado aos dicionários pt-BR, en-US, es-ES, es-AR, es-MX.
 */

import { getDictionary } from '@/dictionaries'
import type { Locale } from '@/types/dictionary'

interface LoadingProps {
  params: Promise<{
    lang: Locale
  }> | { lang: Locale } 
}

export default async function Loading({ params }: LoadingProps) {
  // Em Next.js 15/16, params pode ser uma Promise. Aguardamos a resolução.
  const resolvedParams = await params;
  const locale: Locale = resolvedParams?.lang ?? 'pt-BR';
  
  // CORREÇÃO: getDictionary é async, precisa de await
  const dictionary = await getDictionary(locale);

  // Utiliza a chave 'common.loading' vinda do JSON correspondente
  const label = dictionary.common?.loading || "Carregando...";

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#020617] overflow-hidden"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Texto acessível para leitores de tela - SEO & Acessibilidade */}
      <span className="sr-only">{label}</span>

      {/* 🦴 Skeleton Navbar */}
      <div
        className="w-full h-20 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 pb-20">
        {/* 🦴 Skeleton Hero Section */}
        <section className="space-y-8 mb-24" aria-hidden="true">
          {/* Badge Skeleton */}
          <div className="h-6 w-48 bg-blue-600/10 dark:bg-blue-600/20 rounded-full animate-pulse border border-blue-600/20" />

          {/* Title Skeletons */}
          <div className="space-y-4">
            <div className="h-12 md:h-16 w-full max-w-3xl bg-slate-200 dark:bg-slate-800/80 rounded-3xl animate-pulse" />
            <div className="h-12 md:h-16 w-2/3 max-w-xl bg-slate-200 dark:bg-slate-800/80 rounded-3xl animate-pulse" />
          </div>

          {/* Subtitle Skeletons */}
          <div className="space-y-3">
            <div className="h-5 w-full max-w-lg bg-slate-200/60 dark:bg-slate-800/40 rounded-xl animate-pulse" />
            <div className="h-5 w-3/4 max-w-sm bg-slate-200/60 dark:bg-slate-800/40 rounded-xl animate-pulse" />
          </div>

          {/* Button Skeletons */}
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        </section>

        {/* 🦴 Skeleton Projects Grid */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          aria-hidden="true"
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden min-h-[420px] bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 p-8 flex flex-col justify-end"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-slate-800/10 to-transparent" />

              <div className="space-y-6 relative z-10">
                {/* Category Badges */}
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                </div>

                {/* Project Title */}
                <div className="h-7 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />

                {/* Project Description */}
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse" />
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}


>






===== FILE: src/app/[lang]/not-found.tsx  =====
<conteúdo completo do arquivo

// src/app/[lang]/not-found.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getDictionary } from '@/dictionaries'
import type { Dictionary, Locale } from '@/types/dictionary'
import Link from 'next/link'

export default function NotFound() {
  const params = useParams()
  const lang = (params?.lang as Locale) || 'pt-BR'
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    // CORREÇÃO: Criamos uma função interna assíncrona para dar 'await' no dicionário
    const loadDictionary = async () => {
      try {
        const data = await getDictionary(lang)
        setDict(data)
      } catch (error) {
        console.error("Erro ao carregar dicionário na página 404:", error)
      }
    }

    loadDictionary()
  }, [lang])

  // Shimmer/Loading state enquanto o dicionário é montado no client
  if (!dict) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl mb-6">{dict.common.notFound.title}</h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        {dict.common.notFound.description}
      </p>
      <Link 
        href={`/${lang}`}
        className="px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors"
      >
        {dict.common.notFound.button}
      </Link>
    </div>
  )
}


>





===== FILE: src/app/[lang]/manifest.ts  =====
<conteúdo completo do arquivo

// src/app/[lang]/manifest.ts
import type { MetadataRoute } from 'next';
import { getDictionary } from '@/dictionaries';
// CORREÇÃO: Usando 'import type' para satisfazer o verbatimModuleSyntax
import type { Locale } from '@/types/dictionary';

const SITE_URL = 'https://portfoliosantossergio.vercel.app';

export default async function manifest(
  props: { params: Promise<{ lang: Locale }> }
): Promise<MetadataRoute.Manifest> {
  
  // Resolve os parâmetros (Next.js 16 padrão)
  const { lang: rawLang } = await props.params;
  
  // Lista de locales suportados conforme seu arquivo de tipos
  const supportedLocales: Locale[] = ['pt-BR', 'en-US', 'es-ES', 'es-AR', 'es-MX'];
  
  const lang = supportedLocales.includes(rawLang) 
    ? rawLang 
    : 'pt-BR'; // Fallback seguro

  const dict = await getDictionary(lang);

  return {
    id: `${SITE_URL}/${lang}`,
    lang,
    dir: 'ltr',
    name: dict.seo.siteName,
    short_name: dict.seo.siteName.split(' | ')[0],
    description: dict.seo.description,
    start_url: `/${lang}/`,
    scope: `/${lang}/`,
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    categories: [
      'technology',
      'education',
      'portfolio',
      'software',
      'productivity',
    ],
    icons: [
      {
        src: '/icons/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: `/og-image-${lang.split('-')[0]}.png`, // Pega 'pt', 'en' ou 'es'
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: dict.seo.siteName,
      },
    ],
  };
}


>




===== FILE: src/app/[lang]/metadata.ts =====
<conteúdo completo do arquivo

// src/app/[lang]/metadata.ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/types/dictionary';

const SITE_URL = 'https://portfoliosantossergio.vercel.app';

interface MetadataProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  // 1. Resolvemos a Promise dos parâmetros (Obrigatório no Next.js 15/16)
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  // 2. Lista de locales suportados
  const supportedLocales: Locale[] = ['pt-BR', 'en-US', 'es-ES', 'es-AR', 'es-MX'];
  
  if (!supportedLocales.includes(lang)) {
    notFound();
  }

  // 3. CORREÇÃO: Adicionado 'await' para carregar o dicionário corretamente
  const dict = await getDictionary(lang);

  const pageTitle = dict.seo.pages?.home?.title ?? dict.seo.siteName;
  const pageDescription = dict.seo.pages?.home?.description ?? dict.seo.description;

  // Mapeamento de imagens OG (Consistente com seus arquivos públicos)
  const ogImageMap: Record<Locale, string> = {
    'pt-BR': '/og-image-pt.png',
    'en-US': '/og-image-en.png',
    'es-ES': '/og-image-es.png',
    'es-AR': '/og-image-es.png',
    'es-MX': '/og-image-es.png',
  };

  // Mapeamento de locale para meta tags (padrão ISO: ll_CC)
  const ogLocaleMap: Record<Locale, string> = {
    'pt-BR': 'pt_BR',
    'en-US': 'en_US',
    'es-ES': 'es_ES',
    'es-AR': 'es_AR',
    'es-MX': 'es_MX',
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: pageTitle,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: pageDescription,
    keywords: dict.seo.keywords,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        'pt-BR': '/pt-BR',
        'en-US': '/en-US',
        'es-ES': '/es-ES',
        'es-AR': '/es-AR',
        'es-MX': '/es-MX',
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[lang],
      url: `${SITE_URL}/${lang}`,
      siteName: dict.seo.siteName,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: ogImageMap[lang],
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageMap[lang]],
    },
    icons: {
      icon: [
        { url: '/icons/favicon.ico' },
        { url: '/icons/icon.png', type: 'image/png' },
      ],
      apple: [
        { url: '/icons/apple-touch-icon.png' },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}


>








===== FILE: src/app/[lang]/template.tsx =====
<conteúdo completo do arquivo

/**
 * TEMPLATE: Global [lang]
 * -----------------------------------------------------------------------------
 * Server Component (Next.js 16 / React 19)
 *
 * Responsabilidades:
 * - Estrutura base da UI por idioma
 * - Garantir layout flexível e acessível
 * - NÃO conter lógica de estado, i18n ou efeitos colaterais
 *
 * Totalmente responsivo.
 * Multilíngue por herança da rota [lang].
 */

import type { ReactNode } from 'react'

interface TemplateProps {
  readonly children: ReactNode
}

export default function Template({ children }: TemplateProps) {
  return (
    <div
      className="
        relative
        flex
        min-h-screen
        w-full
        flex-col
        overflow-x-hidden
        bg-background
        text-foreground
        antialiased
      "
    >
      {/* Container principal:
          - flex-1: garante que o conteúdo ocupe o espaço restante (empurrando footer se houver)
          - focus-visible: melhora acessibilidade para navegação via teclado
      */}
      <main
        id="template-root"
        className="relative flex w-full flex-1 flex-col focus-visible:outline-none"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  )
}


>








===== FILE: src/app/api/post-og/route.tsx   =====
<conteúdo completo do arquivo

import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

// -------------------- Helpers --------------------

const sanitizeText = (value: string, max = 120) =>
  value.replace(/\s+/g, ' ').trim().slice(0, max)

const sanitizePositiveInt = (value: string | null, fallback: number) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

const formatDateSafe = () => {
  const d = new Date()
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  return `${day}/${month}/${year}`
}

// -------------------- Handler --------------------

export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const title = sanitizeText(
      searchParams.get('title') ?? 'Sérgio Santos',
      90,
    )

    const description = sanitizeText(
      searchParams.get('description') ?? 'Data Specialist',
      160,
    )

    const author = sanitizeText(
      searchParams.get('author') ?? 'Sérgio Santos',
      40,
    )

    const date =
      sanitizeText(searchParams.get('created-at') ?? '', 20) ||
      formatDateSafe()

    const readingTime = sanitizePositiveInt(
      searchParams.get('reading-time'),
      5,
    )

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundColor: '#020617',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)',
            backgroundSize: '50px 50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: 60,
              background:
                'linear-gradient(to top, #020617 0%, rgba(2,6,23,0.88) 100%)',
            }}
          >
            {/* Reading Time */}
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                backgroundColor: '#ff4500',
                padding: '8px 16px',
                borderRadius: 8,
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                {readingTime} MIN DE LEITURA
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: 22,
                maxWidth: 1000,
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 26,
                color: '#94a3b8',
                lineHeight: 1.4,
                marginBottom: 42,
                maxWidth: 900,
              }}
            >
              {description}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,69,0,0.35)',
                paddingTop: 28,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: '#ff4500',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <span
                    style={{
                      color: '#ffffff',
                      fontSize: 24,
                      fontWeight: 700,
                    }}
                  >
                    {author.charAt(0).toUpperCase()}
                  </span>
                </div>

                <span
                  style={{
                    color: '#ffffff',
                    fontSize: 22,
                    fontWeight: 600,
                  }}
                >
                  {author}
                </span>
              </div>

              <span
                style={{
                  color: '#64748b',
                  fontSize: 20,
                }}
              >
                {date}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, immutable, max-age=31536000',
        },
      },
    )
  } catch {
    return new Response('Failed to generate OG image', {
      status: 500,
    })
  }
}


>






===== FILE:src/app/api/users/route.ts =====
<conteúdo completo do arquivo

import { NextRequest, NextResponse } from "next/server";
import { NotFoundError } from "@/lib/errors";
import { handleApiError } from "@/lib/http/handleApiError";

export async function GET(req: NextRequest) {
  try {
    const user = null;

    if (!user) {
      throw new NotFoundError({
        errorLocationCode: "API_USERS_GET_001",
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}

>






===== FILE: src/app/error.tsx    =====
<conteúdo completo do arquivo

    'use client';

import { ErrorBoundaryView } from '@/components/error/ErrorBoundaryView';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundaryView error={error} reset={reset} />;
}

>






===== FILE:  src/app/global-error.tsx  =====
<conteúdo completo do arquivo
'use client';

import { ErrorBoundaryView } from '@/components/error/ErrorBoundaryView';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundaryView
      error={error}
      reset={reset}
      withHtmlWrapper
    />
  );
}
  

>




===== FILE:  src/app/globals.css     =====
<conteúdo completo do arquivo

@import "tailwindcss";

/* A engine Oxide do Tailwind v4 processa o bundling automaticamente.
   TS 6.0 ajuda na tipagem de variáveis CSS em componentes.
*/
@import "../styles/animations.css";

@theme {
  /* --- Palette de Cores OKLCH (Perceptualmente Uniforme) --- */
  --color-brand-50: oklch(0.97 0.01 256.4);
  --color-brand-100: oklch(0.92 0.04 256.4);
  --color-brand-500: oklch(0.62 0.17 256.4);
  --color-brand-700: oklch(0.45 0.12 256.4);
  --color-brand-900: oklch(0.28 0.07 256.4);

  /* --- Design Tokens Semânticos com Fallbacks --- */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-heading: var(--font-montserrat), ui-serif, Georgia, serif;
  
  --breakpoint-xs: 375px;
  --breakpoint-2xl: 1440px;

  /* --- Efeitos de Elevação de Alta Definição --- */
  --shadow-premium: 0 20px 50px -12px rgba(0, 0, 0, 0.08);
  --shadow-glow: 0 0 20px color-mix(in oklch, oklch(0.62 0.17 256.4), transparent 70%);

  /* --- Mapeamento de Variáveis de Sistema --- */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-border: var(--border);
  --color-card: var(--card);
}

@layer base {
  :root {
    --background: oklch(0.98 0.01 256.4);
    --foreground: oklch(0.15 0.02 256.4);
    --card: oklch(1 0 0);
    --border: oklch(0.92 0.01 256.4);
    
    /* Suporte a esquemas de cores do navegador */
    color-scheme: light;
  }

  .dark {
    --background: oklch(0.12 0.02 256.4);
    --foreground: oklch(0.95 0.01 256.4);
    --card: oklch(0.18 0.02 256.4);
    --border: oklch(0.25 0.02 256.4);
    
    color-scheme: dark;
  }

  *, ::after, ::before {
    @apply border-[var(--color-border)];
  }

  html {
    @apply scroll-smooth antialiased;
    background-color: var(--color-background);
    text-rendering: optimizeLegibility;
    /* Impede o layout de "balançar" ao abrir modais */
    scrollbar-gutter: stable;
    /* Melhora o toque em dispositivos móveis */
    -webkit-tap-highlight-color: transparent;
  }

  body {
    @apply min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden;
    color: var(--color-foreground);
    background-color: var(--color-background);
    /* Tratamento para telas com entalhes/notches */
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }

  /* Foco acessível para navegação via teclado */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-brand-500;
  }
}

@layer components {
  .main-container {
    @apply w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12;
  }

  .glass-effect {
    @apply backdrop-blur-xl shadow-premium transition-all duration-300;
    background-color: color-mix(in oklch, var(--color-card) 75%, transparent);
    border: 1px solid color-mix(in oklch, var(--color-border) 50%, transparent);
  }

  .project-card {
    @apply relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-500;
    /* Melhora performance de animação via GPU */
    will-change: transform, box-shadow;
  }

  .text-balance {
    text-wrap: balance;
  }
}


>









===== FILE:  src/app/robots.ts   =====
<conteúdo completo do arquivo

import type { MetadataRoute } from 'next'

/**
 * ROBOTS.TXT — NEXT.JS 16 (ESTRATÉGIA 2026)
 * -----------------------------------------------------------------------------
 * ✔ SEO internacional (pt / en / es)
 * ✔ Compatível com App Router e RSC
 * ✔ Seguro para buscadores e LLMs
 * ✔ Produção-ready
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '')

  return {
    rules: [
      /**
       * 1️⃣ BUSCADORES GERAIS
       * Permite indexação total do conteúdo público
       * Bloqueia apenas áreas sensíveis
       */
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/admin/',
        ],
      },

      /**
       * 2️⃣ AGENTES DE IA / LLMs
       * Permite leitura semântica do conteúdo público
       * Protege APIs e áreas internas
       */
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Claude-bot',
          'Google-Extended',
          'PerplexityBot',
          'CCBot', // Common Crawl
        ],
        allow: [
          '/pt',
          '/en',
          '/es',
        ],
        disallow: [
          '/api/',
          '/private/',
          '/admin/',
        ],
      },
    ],

    /**
     * Sitemap internacional
     */
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}


>







===== FILE: src/app/sitemap.ts   =====
<conteúdo completo do arquivo

import type { MetadataRoute } from 'next'

/**
 * SITEMAP DINÂMICO — NEXT.JS 16 (APP ROUTER)
 * -----------------------------------------------------------------------------
 * ✔ SEO internacional correto (pt / en / es)
 * ✔ Alinhado com estrutura de navegação do dicionário
 * ✔ Google Search Console friendly
 * ✔ Produção-ready
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '')

  const lastModified = new Date()

  const locales = ['pt', 'en', 'es'] as const

  /**
   * Rotas principais do site
   * Devem refletir o dicionário (nav)
   */
  const pages = [
    '', // home
    'about',
    'experience',
    'projects',
    'articles',
    'contact',
  ]

  /**
   * 1️⃣ Páginas Internacionalizadas
   */
  const pageEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    pages.map(page => {
      const path = page ? `/${page}` : ''

      return {
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
        changeFrequency: 'monthly',
        priority:
          page === '' && locale === 'pt'
            ? 1.0
            : page === ''
            ? 0.9
            : 0.8,
        alternates: {
          languages: {
            pt: `${baseUrl}/pt${path}`,
            en: `${baseUrl}/en${path}`,
            es: `${baseUrl}/es${path}`,
            'x-default': `${baseUrl}/pt${path}`,
          },
        },
      }
    }),
  )

  /**
   * 2️⃣ Entrada raiz (fallback canônico)
   */
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: {
      languages: {
        pt: `${baseUrl}/pt`,
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        'x-default': `${baseUrl}/pt`,
      },
    },
  }

  /**
   * 3️⃣ Documentos estratégicos (CVs por idioma)
   * PDFs não usam priority nem changeFrequency
   */
  const documentEntries: MetadataRoute.Sitemap = locales.map(locale => ({
    url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
    lastModified,
  }))

  return [rootEntry, ...pageEntries, ...documentEntries]
}



>








===== FILE: src/components/AboutSection.tsx   =====
<conteúdo completo do arquivo

// src/components/AboutSection.tsx
import type { Dictionary } from "@/types/dictionary";

// Definição estrita de Props — TS 5.9 / Next 16
export interface AboutSectionProps {
  readonly dict: Dictionary;
}

export default function AboutSection({ dict }: AboutSectionProps) {
  const { about } = dict;
  const {
    title,
    differentialTitle,
    description,
    differentialContent,
    highlights,
    stats,
  } = about;

  return (
    <section
      id="sobre"
      className="w-full bg-background px-4 py-16 text-foreground md:px-8 lg:px-16"
      aria-labelledby="about-title"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h2
            id="about-title"
            className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            {title}
          </h2>

          <p className="text-lg font-medium text-muted-foreground md:text-xl">
            {differentialTitle}
          </p>
        </header>

        {/* Description */}
        <div className="max-w-4xl space-y-6">
          <p className="text-balance text-base leading-relaxed md:text-lg">
            {description}
          </p>

          <p className="text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            {differentialContent}
          </p>
        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-4 md:gap-3">
            {highlights.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="rounded-full border border-border bg-secondary/20 px-4 py-1.5 text-xs font-medium transition-colors hover:bg-secondary/40 md:text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            <div className="flex flex-col items-center justify-center rounded-xl border border-border p-6 transition-all hover:shadow-md">
              <span className="text-3xl font-bold text-primary">
                {stats.experienceValue}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {stats.experienceLabel}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-border p-6 transition-all hover:shadow-md">
              <span className="text-3xl font-bold text-primary">
                {stats.availabilityValue}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {stats.availabilityLabel}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-6 sm:col-span-2">
              <span className="text-center font-medium text-foreground">
                {stats.automation}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


>







===== FILE:
src/components/ArticlesSection.tsx   =====
<conteúdo completo do arquivo


'use client'

/**
 * ARTICLES SECTION: Vitrine de Conteúdo Técnico
 * -----------------------------------------------------------------------------
 * - UI: Grid responsivo (1 col mobile / 2 col desktop)
 * - I18n: Totalmente integrado com os 5 locales (PT, EN, ES-ES, ES-AR, ES-MX).
 * - Performance: Intersection Observer para animações de entrada.
 */

import { useState, useEffect, useRef } from 'react'
import { BookOpen, Award, Calendar, ArrowRight, ExternalLink } from 'lucide-react'
import type { Locale, Dictionary, ArticleItem } from '@/types/dictionary'

interface ArticlesSectionProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export default function ArticlesSection({ lang, dict }: ArticlesSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  // Acesso direto ao dicionário de artigos (já validado pelo seu validator.ts)
  const { articles } = dict

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="articles"
      className="relative scroll-mt-28 py-20 sm:py-32 overflow-hidden bg-slate-50/50 dark:bg-transparent"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* HEADER DA SEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              {articles.title}
            </h2>
            <div className="h-1.5 w-24 bg-blue-600 mt-4 rounded-full" />
          </div>
          
          <a
            href={dict.common.externalLinks.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors group"
          >
            {articles.mediumProfile}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* GRID DE ARTIGOS */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          
          {/* Mapeamento tipado baseado no seu ArticleItem do dictionary.ts */}
          {articles.items.map((article: ArticleItem, index: number) => (
            <ArticleCard 
              key={`${article.title}-${index}`}
              title={article.title}
              description={article.description}
              date={article.date}
              category={article.category}
              isAward={article.isAward}
              awardLabel={articles.awardWinner}
              readMoreLabel={articles.readMore}
              publishedAtLabel={articles.publishedAt}
              link={article.link}
            />
          ))}
        </div>

        {/* Fallback caso não existam itens (Segurança adicional) */}
        {articles.items.length === 0 && (
          <div className="text-center py-20">
             <p className="text-slate-500 italic text-lg">{dict.states.errorArticles}</p>
          </div>
        )}
      </div>
    </section>
  )
}

interface ArticleCardProps {
  title: string
  description: string
  date: string
  category: string
  isAward: boolean
  awardLabel: string
  readMoreLabel: string
  publishedAtLabel: string
  link: string
}

function ArticleCard({ 
  title, 
  description, 
  date, 
  category, 
  isAward, 
  awardLabel, 
  readMoreLabel, 
  publishedAtLabel,
  link 
}: ArticleCardProps) {
  return (
    <article className="group relative flex flex-col bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/5">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <BookOpen className="w-6 h-6" />
        </div>
        {isAward && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 dark:border-amber-800/50 shadow-sm">
            <Award className="w-3.5 h-3.5" />
            {awardLabel}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-blue-500" /> {publishedAtLabel} {date}
        </span>
        <span className="hidden sm:block w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
        <span className="text-blue-600 dark:text-blue-400">{category}</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
        {description}
      </p>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-blue-600 transition-all"
        >
          {readMoreLabel}
          <ExternalLink className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  )
}



>







===== FILE:     src/components/CareerHighlights.tsx =====
<conteúdo completo do arquivo


'use client';

/**
 * CAREER HIGHLIGHTS: Prova Social e Métricas de Impacto
 * -----------------------------------------------------------------------------
 * - UI: Cards de alto impacto e Banner de KPIs.
 * - I18n: Totalmente alinhado com dict.about.highlights e dict.about.stats.
 * - Responsividade: Grid adaptativo para mobile, tablet e desktop.
 * - Correção: Mapeamento de chaves do dicionário (experienceValue, Label, etc).
 */

import {
  ShieldCheck,
  BarChart3,
  Zap,
  Activity,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import type { Dictionary } from '@/types/dictionary';

interface CareerHighlightsProps {
  readonly dict: Dictionary;
}

export const CareerHighlights = ({ dict }: CareerHighlightsProps) => {
  // Fallbacks de segurança baseados na estrutura real do Dictionary
  const highlights = dict?.about?.highlights ?? [];
  const stats = dict?.about?.stats;
  const differentialTitle = dict?.about?.differentialTitle ?? '';

  // Ícones representativos para os destaques
  const highlightIcons = [
    <Activity key="icon-1" className="w-6 h-6" />,
    <Zap key="icon-2" className="w-6 h-6" />,
    <BarChart3 key="icon-3" className="w-6 h-6" />,
  ];

  return (
    <section
      aria-labelledby="career-highlights-title"
      className="mt-14 md:mt-20 space-y-12 md:space-y-20 antialiased"
    >
      {/* 🟦 CABEÇALHO DA SEÇÃO */}
      <header className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="h-8 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full shrink-0"
        />
        <h4
          id="career-highlights-title"
          className="text-xl md:text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white"
        >
          {differentialTitle}
        </h4>
      </header>

      {/* 🗂️ GRID DE DESTAQUES */}
      <div
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {highlights.map((text, index) => (
          <article
            key={`highlight-${index}`}
            role="listitem"
            className="group relative p-7 md:p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/40
                       border border-slate-200/60 dark:border-slate-800/60
                       hover:border-blue-500/50 transition-all duration-500
                       flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div
                className="mb-6 inline-flex w-fit p-4 rounded-2xl
                           bg-white dark:bg-slate-800
                           text-blue-600 dark:text-blue-400 shadow-sm
                           group-hover:bg-blue-600 group-hover:text-white
                           transition-colors duration-500"
              >
                {highlightIcons[index] || <Trophy className="w-6 h-6" />}
              </div>

              <p className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
                {text}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* 📊 BANNER DE KPIs */}
      <div
        role="region"
        aria-label="Key performance indicators"
        className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem]
                   bg-blue-600 dark:bg-blue-700
                   p-8 md:p-14 text-white
                   shadow-2xl shadow-blue-600/20"
      >
        <ShieldCheck
          aria-hidden="true"
          className="absolute -right-12 -top-12 w-48 h-48 md:w-72 md:h-72
                     text-white/10 rotate-12 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20">
              <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="max-w-xs">
              <h4 className="text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase">
                {dict.about.title}
              </h4>
            </div>
          </div>

          <div aria-hidden="true" className="hidden lg:block h-16 w-px bg-white/20" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full lg:w-auto">
            <StatItem 
              value={stats.experienceValue} 
              label={stats.experienceLabel} 
            />
            <StatItem 
              value={stats.availabilityValue} 
              label={stats.availabilityLabel} 
              isBorder 
            />
            {/* Para automação, o JSON usa uma string única, tratamos separadamente */}
            <StatItem 
              fullText={stats.automation} 
              isBorder 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface StatItemProps {
  value?: string;
  label?: string;
  fullText?: string;
  isBorder?: boolean;
}

function StatItem({ value, label, fullText, isBorder }: StatItemProps) {
  // Se for passado fullText (como o caso de automation no seu JSON), fazemos o split
  let displayValue = value;
  let displayLabel = label;

  if (fullText) {
    const tokens = fullText.trim().split(/\s+/);
    displayValue = tokens[0];
    displayLabel = tokens.slice(1).join(' ');
  }

  if (!displayValue) return null;

  return (
    <div className={`text-center ${isBorder ? 'sm:border-l border-white/10 sm:pl-8' : ''}`}>
      <span className="block text-4xl md:text-5xl font-black tracking-tighter tabular-nums mb-1">
        {displayValue}
      </span>
      <span className="block text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-90 max-w-[120px] mx-auto leading-relaxed">
        {displayLabel}
      </span>
    </div>
  );
}


>






===== FILE:    src/components/ContactSection.tsx  =====
<conteúdo completo do arquivo


'use client';

/**
 * CONTACT SECTION: Conversão e Redes Sociais
 * -----------------------------------------------------------------------------
 * Ajustes realizados:
 * - Sincronização rigorosa com as chaves do dicionário (contact e common).
 * - Suporte nativo aos 5 locales definidos no tipo Locale.
 * - Refinamento de acessibilidade e segurança nos links.
 */

import { useState, useCallback, useMemo } from 'react';
import { Mail, Linkedin, Github, Copy, Check, FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { Locale, Dictionary } from '@/types/dictionary';

interface ContactSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  
  // Destruturação segura do dicionário para evitar erros de undefined
  const contact = dict?.contact;
  const common = dict?.common;

  // Dados de contato centralizados vindos do common.externalLinks
  const email = common?.externalLinks?.email ?? '';
  const linkedinUrl = common?.externalLinks?.linkedin ?? '#';
  const githubUrl = common?.externalLinks?.github ?? '#';
  
  // UTM tracking para identificar a origem do contato via URL
  const origin = searchParams.get('utm_source') ?? 'portfolio_direct';

  const copyToClipboard = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  /**
   * Gerenciador de etiquetas para o estado "Copiado".
   * Mapeia automaticamente com base nos 5 Locales suportados.
   */
  const copiedLabel = useMemo(() => {
    const labels: Record<Locale, string> = {
      'pt-BR': 'Copiado!',
      'en-US': 'Copied!',
      'es-ES': '¡Copiado!',
      'es-AR': '¡Copiado!',
      'es-MX': '¡Copiado!'
    };
    return labels[lang] || labels['pt-BR'];
  }, [lang]);

  return (
    <section 
      id="contact" 
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] relative overflow-hidden antialiased"
      aria-labelledby="contact-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 shadow-2xl border border-white/10 overflow-hidden">
          
          {/* BACKGROUND DECORATION - Elementos visuais abstratos */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h2 
                id="contact-title"
                className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-tight"
              >
                {contact?.title}
              </h2>

              <p className="text-base md:text-xl text-blue-50 mb-10 font-medium opacity-90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {contact?.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4">
                {/* CTA: EMAIL PRINCIPAL */}
                <a
                  href={`mailto:${email}?subject=Contact from ${origin}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-lg active:scale-95"
                >
                  <Mail className="w-6 h-6" aria-hidden="true" />
                  {contact?.cta}
                </a>

                {/* ACTION: COPIAR EMAIL */}
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base border transition-all active:scale-95 backdrop-blur-md ${
                    copied 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                      : 'bg-blue-800/30 border-white/20 text-white hover:bg-blue-800/50'
                  }`}
                  aria-label={contact?.emailLabel}
                >
                  {copied ? (
                    <Check className="w-5 h-5 animate-in zoom-in duration-300" />
                  ) : (
                    <Copy className="w-5 h-5 opacity-70" aria-hidden="true" />
                  )}
                  <span>{copied ? copiedLabel : contact?.emailLabel}</span>
                </button>

                {/* ACTION: CV / RESUME */}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base border border-white/10 bg-blue-900/20 text-white hover:bg-blue-900/40 transition-all"
                >
                  <FileText className="w-5 h-5 opacity-70" aria-hidden="true" />
                  {contact?.cvLabel}
                </a>
              </div>
            </div>

            {/* SOCIAL NETWORKS - Links Dinâmicos e Acessíveis */}
            <div className="flex flex-row lg:flex-col gap-4">
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={contact?.linkedinLabel || "LinkedIn"}
                className="p-5 md:p-6 bg-white text-blue-600 rounded-2xl md:rounded-3xl hover:-translate-y-2 transition-all shadow-xl focus:ring-4 focus:ring-white/20 outline-none"
              >
                <Linkedin className="w-8 h-8 md:w-10 md:h-10" />
              </a>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={common?.socialLinks?.replace('{platform}', 'GitHub') || "GitHub"}
                className="p-5 md:p-6 bg-slate-900 text-white rounded-2xl md:rounded-3xl hover:-translate-y-2 transition-all shadow-xl focus:ring-4 focus:ring-slate-900/20 outline-none"
              >
                <Github className="w-8 h-8 md:w-10 md:h-10" />
              </a>
            </div>
          </div>
        </div>

        {/* SECTION FOOTER - Copyright Dinâmico */}
        <footer className="mt-16 text-center">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-4">
            {common?.footer}
          </p>
        </footer>
      </div>
    </section>
  );
};


>







===== FILE:   src/components/CookieBanner.tsx   =====
<conteúdo completo do arquivo


'use client';

import { useEffect, useState, useCallback } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import type { Locale, Dictionary } from '@/types/dictionary';

interface CookieBannerProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

const CONSENT_KEY = 'santos-sergio-consent';

export function CookieBanner({ lang, dict }: CookieBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  // Agora usamos DICT diretamente, respeitando o idioma vindo do servidor
  const { cookie } = dict;

  useEffect(() => {
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    if (!hasConsent) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSaveConsent = useCallback((all: boolean) => {
    const consent = {
      necessary: true,
      analytics: all ? true : analyticsEnabled,
      date: new Date().toISOString(),
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'Secure;' : '';
    document.cookie = `${CONSENT_KEY}=${all ? 'all' : 'custom'}; path=/; max-age=31536000; SameSite=Lax; ${secure}`;
    
    setIsOpen(false);
  }, [analyticsEnabled]);

  if (!isOpen) return null;

  return (
    <aside
      role="alertdialog"
      aria-labelledby="cookie-heading"
      className="fixed bottom-4 left-4 right-4 z-[200] md:left-auto md:right-8 md:bottom-8 md:max-w-md bg-white/98 dark:bg-slate-900/98 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom-12 duration-700"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-xl text-white">
          <Cookie size={18} aria-hidden="true" />
        </div>
        <h2 id="cookie-heading" className="font-bold text-xs uppercase tracking-widest text-slate-900 dark:text-white">
          {cookie.title}
        </h2>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        {cookie.description}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500" />
            {cookie.necessary}
          </span>
          <span className="text-[10px] font-bold uppercase text-slate-400">{cookie.alwaysActive}</span>
        </div>

        <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {cookie.analytics}
          </span>
          <input
            type="checkbox"
            checked={analyticsEnabled}
            onChange={(e) => setAnalyticsEnabled(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleSaveConsent(true)}
          className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
        >
          {cookie.acceptAll}
        </button>
        <button
          onClick={() => handleSaveConsent(false)}
          className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
        >
          {cookie.savePreferences}
        </button>
      </div>

      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        aria-label={dict.common.menu.close} // Usando chave real do seu JSON
      >
        <X size={18} />
      </button>
    </aside>
  );
}


>







===== FILE: src/components/ErrorBox.tsx    =====
<conteúdo completo do arquivo


'use client';

import type { ErrorDictionary } from "@/types/error-dictionary";
import { 
  AlertCircle, 
  RefreshCcw, 
  ShieldAlert, 
  Info,
  XCircle 
} from 'lucide-react';

interface ErrorBoxProps {
  /** A chave do erro retornada pela Server Action (ex: 'ValidationError') */
  errorKey: keyof ErrorDictionary;
  /** O dicionário de erros já traduzido vindo do hook de tradução ou props */
  dictionary: ErrorDictionary;
  /** ID opcional para suporte técnico (ex: errorId da Server Action) */
  errorId?: string;
  /** Função opcional para o botão de tentar novamente */
  onRetry?: () => void;
  /** Texto opcional para o botão de retry */
  retryLabel?: string;
}

export default function ErrorBox({ 
  errorKey, 
  dictionary, 
  errorId, 
  onRetry,
  retryLabel = "Tentar novamente" 
}: ErrorBoxProps) {
  
  const details = dictionary[errorKey] ?? dictionary.InternalServerError;

  const getIcon = () => {
    switch (errorKey) {
      case 'ValidationError':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;

      case 'ForbiddenError':
      case 'UnauthorizedError':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;

      case 'TooManyRequestsError':
        return <RefreshCcw className="w-5 h-5 text-blue-500 animate-spin" />;

      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-300 border rounded-xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-6">
        
        <div className="flex-shrink-0 p-2 rounded-full bg-slate-50 dark:bg-slate-800">
          {getIcon()}
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {details.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {details.message}
          </p>
          
          <div className="flex items-center gap-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
            <Info className="w-3 h-3" />
            <span>{details.action}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            
            {errorId && (
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded">
                ID: {errorId}
              </span>
            )}

            {onRetry && (
              <button
                onClick={onRetry}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-slate-900 dark:bg-blue-600 rounded-lg hover:opacity-90 transition-opacity active:scale-95"
              >
                <RefreshCcw className="w-4 h-4" />
                {retryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


>






===== FILE:   src/components/ExperienceSection.tsx   =====
<conteúdo completo do arquivo


'use client';

import { Briefcase, Building2 } from 'lucide-react';
import type { Locale, Dictionary, ExperienceItem } from '@/types/dictionary';

interface ExperienceSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default ExperienceSection = ({ dict, lang }: ExperienceSectionProps) => {
  // Acessa o conteúdo traduzido conforme a estrutura do dicionário
  const { experience } = dict; 

  // Early return caso não haja itens, evitando renderização de containers vazios
  if (!experience?.items?.length) return null;

  return (
    <section 
      id="experience" // Ou use getSectionId(NavSection.EXPERIENCE) se preferir dinâmico
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500 antialiased overflow-hidden"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Header da Seção */}
        <header className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <Briefcase size={20} className="md:w-6 md:h-6" aria-hidden="true" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] text-xs">
              {experience.title}
            </span>
          </div>
          <h2 
            id="experience-heading"
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter"
          >
            {experience.title}
          </h2>
        </header>

        {/* Linha do Tempo (Timeline) */}
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800/50 ml-3 md:ml-12 space-y-12 md:space-y-20">
          {experience.items.map((item: ExperienceItem, index: number) => (
            <article 
              key={`${item.company}-${index}`} 
              className="relative pl-8 md:pl-20 group transition-all"
            >
              {/* Indicador Visual (Bolinha na linha) */}
              <div 
                className="absolute -left-[11px] top-2 w-5 h-5 rounded-full 
                           bg-white dark:bg-[#020617] border-4 border-blue-600 
                           group-hover:scale-125 group-hover:bg-blue-600 
                           transition-all duration-300 z-10" 
                aria-hidden="true" 
              />
              
              <div className="flex flex-col gap-4">
                {/* Meta Info: Período e Empresa */}
                <div className="flex flex-wrap items-center gap-3 md:gap-6">
                  <time className="inline-flex px-4 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs md:text-sm font-bold border border-blue-100 dark:border-blue-800/30 whitespace-nowrap">
                    {item.period}
                  </time>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Building2 size={16} className="shrink-0" aria-hidden="true" />
                    <span className="font-bold uppercase tracking-wide text-xs md:text-sm">
                      {item.company}
                    </span>
                  </div>
                </div>

                {/* Conteúdo Principal */}
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                    {item.role}
                  </h3>
                  
                  <div className="max-w-4xl">
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Linha Decorativa Inferior */}
                <div 
                  className="mt-4 h-1 w-8 bg-slate-100 dark:bg-slate-800 
                             group-hover:w-24 group-hover:bg-blue-600 
                             transition-all duration-500 rounded-full" 
                  aria-hidden="true" 
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
>





===== FILE:  src/components/FeaturedArticle.tsx   =====
<conteúdo completo do arquivo


'use client';

/**
 * FEATURED ARTICLE: Card de Autoridade Técnica
 * -----------------------------------------------------------------------------
 * - I18n: Totalmente alinhado com o dicionário e suporte a 5 locales.
 * - Fix: Agora consome o primeiro item de 'articles.items' para evitar hardcoding.
 * - UI: Ajustes de responsividade e animações otimizadas.
 */

import { useEffect, useRef } from 'react';
import { ExternalLink, BookOpen, Award } from 'lucide-react';
import Script from 'next/script';
import type { Locale } from '@/types/dictionary';
import type { Dictionary } from '@/types/dictionary';

interface FeaturedArticleProps {
  readonly dict: Dictionary;
  readonly lang: Locale;
}

export const FeaturedArticle = ({ dict, lang }: FeaturedArticleProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const { articles } = dict;
  
  // Seleciona o primeiro artigo do dicionário como "Destaque"
  const featuredArticle = articles.items[0];

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          currentRef.classList.add('opacity-100', 'translate-y-0');
        }
      },
      { rootMargin: '-10% 0px -10% 0px', threshold: 0.1 }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  // Dados para o SEO Schema baseados no dicionário real
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: featuredArticle?.title || articles.title,
    description: featuredArticle?.description,
    inLanguage: lang,
    author: {
      '@type': 'Person',
      name: dict.meta.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sérgio Santos'
    }
  };

  if (!featuredArticle) return null;

  return (
    <>
      <Script
        id="schema-featured-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article
        ref={ref}
        className="group relative flex flex-col h-full bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-10 md:p-14 overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.15)] opacity-0 translate-y-8"
      >
        {/* Efeito de Brilho no Hover */}
        <div 
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[100px] transition-all duration-1000 group-hover:bg-blue-600/20 pointer-events-none" 
        />

        <header className="flex items-start justify-between gap-4 mb-8 md:mb-10 z-10">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/40 shadow-sm">
            <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-[9px] md:text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-[0.15em]">
              {articles.awardWinner}
            </span>
          </div>

          <div className="p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
          </div>
        </header>

        <div className="flex-grow z-10">
          <h3 className="mb-6 font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[clamp(1.5rem,5vw,2.75rem)] break-words hyphens-auto">
            {featuredArticle.title}
          </h3>

          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic opacity-90 border-l-4 border-slate-100 dark:border-slate-800 pl-5 md:pl-6 group-hover:border-blue-500/30 transition-colors">
            “{featuredArticle.description}”
          </p>
        </div>

        <footer className="mt-10 md:mt-12 z-10">
          <a
            href={featuredArticle.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative flex items-center justify-center gap-4 w-full py-5 md:py-6 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.97] overflow-hidden"
          >
            {/* Shimmer Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            
            <span className="relative z-10">{articles.readMore}</span>
            <ExternalLink className="w-4 h-4 md:w-5 md:h-5 relative z-10 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </a>
        </footer>
      </article>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};


>




===== FILE:   src/components/FeaturedArticleSection.tsx   =====
<conteúdo completo do arquivo

'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { Trophy, ArrowUpRight, Calendar } from 'lucide-react'
import type { Locale, Dictionary } from '@/types/dictionary'

interface FeaturedArticleSectionProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export default FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { articles, common } = dict

  /**
   * ✔ TS-safe:
   * O artigo em destaque pode NÃO existir
   */
  const featuredArticle = articles.items.at(0)
  const mediumLink = common.externalLinks.medium

  /**
   * ✔ Fail-fast
   * Se não houver artigo, a seção não é renderizada
   */
  if (!featuredArticle) {
    return null
  }

  useEffect(() => {
    const currentRef = sectionRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.dispatchEvent(
            new CustomEvent('scrollspy:change', {
              detail: { id: 'articles' }
            })
          )
        }
      },
      { threshold: 0.2, rootMargin: '-10% 0px -70% 0px' }
    )

    observer.observe(currentRef)
    return () => observer.disconnect()
  }, [])

  const schemaPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://sergiosantos.dev/#sergio-santos',
    name: 'Sérgio Santos',
    jobTitle: common.role,
    sameAs: [
      common.externalLinks.linkedin,
      common.externalLinks.github
    ]
  }

  return (
    <section
      ref={sectionRef}
      id="articles"
      aria-labelledby="featured-article-title"
      className="relative scroll-mt-24 py-16 md:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/30 dark:bg-transparent overflow-hidden"
    >
      <Script
        id="schema-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }}
      />

      {/* BACKGROUND */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.05] dark:opacity-[0.12] pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-soft-light" />
        <div className="absolute bottom-0 right-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-indigo-600 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-soft-light" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* TÍTULO */}
        <header className="flex items-center gap-4 md:gap-6 mb-12 md:mb-16">
          <div className="p-3 md:p-4 bg-amber-100 dark:bg-amber-900/40 rounded-2xl text-amber-600 dark:text-amber-400 shadow-lg -rotate-2">
            <Trophy className="w-7 h-7 md:w-10 md:h-10" />
          </div>
          <h2 id="featured-article-title" className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            {articles.title}
          </h2>
        </header>

        {/* CARD */}
        <article className="group bg-white dark:bg-slate-900/40 rounded-[2.5rem] p-6 md:p-12 lg:p-16 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-500 hover:border-blue-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* IMAGEM */}
            <div className="relative overflow-hidden rounded-[2rem] shadow-xl aspect-[4/3] md:aspect-video lg:aspect-square bg-slate-200 dark:bg-slate-800">
              <Image
                src="/images/trofeu-35-edicao.png"
                alt={featuredArticle.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            {/* TEXTO */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-6">
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{articles.publishedAt} {featuredArticle.date}</span>
                </div>

                {featuredArticle.isAward && (
                  <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full">
                    {articles.bestOfMonth}
                  </span>
                )}
              </div>

              <h3 className="text-2xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white">
                {featuredArticle.title}
              </h3>

              <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-10">
                {featuredArticle.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={featuredArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black inline-flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {articles.readMore}
                  <ArrowUpRight className="w-5 h-5" />
                </a>

                <a
                  href={mediumLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl font-black border border-slate-200 dark:border-slate-800"
                >
                  {articles.mediumProfile}
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}


>












===== FILE:     src/components/FeaturedProject.tsx  =====
<conteúdo completo do arquivo

'use client'

/**
 * FEATURED PROJECT: O principal case técnico do portfólio.
 * -----------------------------------------------------------------------------
 * Revisado: 100% Tipado, Multilingue (PT, EN, ES) e Responsivo.
 */

import Script from 'next/script'
import { Github, Star, ArrowRight, ExternalLink, Database, Cpu, Zap } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedProjectProps {
  readonly project: {
    name: string
    description: string | null
    html_url: string
    homepage?: string | null
    topics: string[]
  }
  readonly dict: Dictionary
}

export const FeaturedProject = ({ project, dict }: FeaturedProjectProps) => {
  // Desestruturação segura baseada nas interfaces do seu dictionary.ts
  const { projects, states } = dict;

  // Parsing da descrição do GitHub: "Problema | Solução | Impacto"
  const descriptionParts = project.description?.split('|').map((p) => p.trim()) ?? []
  const mainDescription = descriptionParts[0] || project.description || states.empty;
  const impactText = descriptionParts[2] || descriptionParts[1];

  const displayTopics = project.topics.filter(
    (t) => !['portfolio', 'featured', 'highlight', 'main'].includes(t.toLowerCase())
  )

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: mainDescription,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    author: { '@type': 'Person', name: 'Sérgio Santos' },
    url: project.homepage || project.html_url,
    keywords: displayTopics.join(', ')
  }

  return (
    <>
      <Script
        id={`featured-project-${project.name}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <section className="relative bg-white dark:bg-[#020617] rounded-[2.5rem] lg:rounded-[4rem] border border-slate-200 dark:border-blue-500/10 overflow-hidden group shadow-2xl transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">
          
          {/* COLUNA VISUAL - Totalmente Responsiva */}
          <div className="relative h-72 sm:h-80 lg:h-auto bg-slate-50 dark:bg-slate-950/40 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800/50">
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
              <div className="bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-3 shadow-2xl shadow-blue-500/40 transform -rotate-2">
                <Star size={14} className="fill-amber-300 text-amber-300" />
                {/* Removido o (as any) - Agora usa a chave do dicionário */}
                {projects.featuredLabel}
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full h-full">
              <div className="absolute animate-pulse">
                <Cpu className="w-40 h-40 sm:w-64 sm:h-64 lg:w-[280px] lg:h-[280px] text-blue-500/5 dark:text-blue-400/5" />
              </div>
              <div className="relative transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
                <Database className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-blue-600 dark:text-blue-500 opacity-20 dark:opacity-40" />
                <Zap className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* COLUNA DE CONTEÚDO */}
          <div className="p-6 sm:p-10 lg:p-16 xl:p-20 flex flex-col justify-center relative z-10">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 lg:mb-10 tracking-tighter text-slate-900 dark:text-white leading-tight capitalize">
              {project.name.replace(/[_-]/g, ' ')}
            </h3>

            <div className="space-y-8 lg:space-y-10 mb-10 lg:mb-12">
              <div className="pl-6 border-l-4 border-blue-500">
                <p className="text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-blue-400 mb-3">
                  {projects.firstLabel}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
                  {mainDescription}
                </p>
              </div>

              {impactText && (
                <div className="flex items-center gap-4 p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 rounded-[1.5rem] border border-emerald-100 dark:border-emerald-500/10">
                  <div className="p-2 bg-emerald-500 rounded-lg text-white flex-shrink-0">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black tracking-tighter opacity-70 mb-0.5">
                      {projects.impactLabel}
                    </p>
                    <p className="font-bold text-xs sm:text-sm md:text-base">{impactText}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tags de Tecnologia */}
            <div className="flex flex-wrap gap-2 mb-10 lg:mb-14">
              {displayTopics.slice(0, 8).map((topic) => (
                <span key={topic} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-wider font-black border border-slate-200/50 dark:border-slate-700/50">
                  {topic.replace(/-/g, ' ')}
                </span>
              ))}
            </div>

            {/* Ações / Botões */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn flex-1 bg-slate-900 dark:bg-blue-600 text-white py-5 sm:py-6 px-8 rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-[0.25em] flex items-center justify-center gap-4 shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Github size={20} className="group-hover/btn:rotate-12 transition-transform" />
                {projects.viewProject}
              </a>
              
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 py-5 sm:py-6 px-8 rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-[0.25em] flex items-center justify-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50"
                >
                  <ExternalLink size={20} />
                  {projects.viewDemo}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


>





===== FILE: src/components/Footer.tsx  =====
<conteúdo completo do arquivo

'use client'

import Link from 'next/link'
import {
  Linkedin,
  Github,
  Mail,
  Globe,
  Code2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'

import type { Locale, Dictionary } from '@/types/dictionary'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { NAV_SECTIONS, getNavHash } from '@/domain/navigation'

interface FooterProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export default function Footer({ lang, dict }: FooterProps) {
  // ✅ Extração correta (incluindo articles)
  const { common, seo, contact, articles } = dict

  // ✅ Narrow seguro para evitar erro de possível undefined
  const articlesSeo = seo.pages['articles']

  const email = common.externalLinks.email
  const linkedinUrl = common.externalLinks.linkedin
  const githubUrl = common.externalLinks.github

  const countryLabel = lang === 'en-US' ? 'Brazil' : 'Brasil'

  return (
    <footer
      role="contentinfo"
      className="bg-slate-50 dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800/60 transition-colors mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 space-y-20">

        {/* CTA */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row justify-between gap-10 items-start lg:items-center shadow-2xl shadow-blue-500/20">
          <div className="max-w-xl relative z-10">
            <h3 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">
              {articlesSeo?.title ?? articles.title}
            </h3>

            <p className="text-blue-50/90 leading-relaxed font-medium text-sm md:text-base">
              {articlesSeo?.description ?? ''}
            </p>
          </div>

          <a
            href={`mailto:${email}`}
            className="group relative z-10 inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-blue-50 transition-all shadow-xl active:scale-95"
          >
            {contact.cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* IDENTIDADE */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white uppercase">
                Sérgio<span className="text-blue-600">Santos</span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                {common.role}
              </p>
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              {countryLabel}
            </div>
          </div>

          {/* NAVEGAÇÃO */}
          <nav aria-label={common.navigation}>
            <h4 className={STYLES.footerTitle}>{common.navigation}</h4>
            <ul className="space-y-3">
              {NAV_SECTIONS.map((section) => (
                <li key={section}>
                  <Link
                    href={`/${lang}${getNavHash(section)}`}
                    className={STYLES.footerLink}
                  >
                    {seo.pages[section]?.title ?? section}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* IDIOMA */}
          <div>
            <h4 className={STYLES.footerTitle}>{common.languageSwitcher}</h4>
            <div className="max-w-[200px]">
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>

          {/* CONTATO */}
          <div className="space-y-6">
            <h4 className={STYLES.footerTitle}>Email</h4>
            <a href={`mailto:${email}`} className="group block space-y-3">
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-blue-600 transition-colors font-bold text-sm">
                <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{contact.emailLabel}</span>
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-400 break-all bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-xl border">
                {email}
              </p>
            </a>
          </div>
        </div>

        {/* FOOTER FINAL */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {common.footer}
          </div>

          <div className="flex items-center gap-4">
            <SocialIcon href={linkedinUrl} label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </SocialIcon>

            <SocialIcon href={githubUrl} label="GitHub">
              <Github className="w-4 h-4" />
            </SocialIcon>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
              <Code2 className="w-4 h-4 text-blue-600" />
              {common.builtWith}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer me"
      aria-label={label}
      className="group p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-600/30 hover:-translate-y-1 transition-all flex items-center gap-2"
    >
      {children}
      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
    </a>
  )
}

const STYLES = {
  footerTitle:
    'font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-slate-400 dark:text-slate-500',
  footerLink:
    'font-bold text-sm text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all inline-block',
}


>





===== FILE:  src/components/HeroSection.tsx  =====
<conteúdo completo do arquivo


/**
 * HERO SECTION — SÉRGIO SANTOS
 * Compatível com:
 * - Next.js 16
 * - TypeScript 5.9+
 * - verbatimModuleSyntax enabled
 * - Arquitetura i18n multi-locale
 */

import type { Dictionary, Locale } from "@/types/dictionary";
import { getNavHash, NavSection } from "@/domain/navigation";

interface HeroSectionProps {
  dict: Dictionary;
  lang: Locale;
}

export default function HeroSection({ dict, lang }: HeroSectionProps) {
  const { hero, contact, about, metrics } = dict;

  const cvPath = `/cv-sergio-santos-${dict.meta.locale}.pdf`;
  const projectsHash = getNavHash(NavSection.PROJECTS);

  return (
    <section
      id="inicio"
      className="relative flex min-h-[95vh] w-full items-center justify-center overflow-hidden bg-slate-50 px-6 py-20 dark:bg-slate-950"
    >
      <div className="container relative z-10 mx-auto flex flex-col items-center text-center">

        <div className="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 dark:border-blue-800/50 dark:bg-blue-900/20">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700 dark:text-blue-300 md:text-xs">
            {hero.greeting}
          </span>
        </div>

        <h1 className="mb-6 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {hero.title}{" "}
          <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent sm:inline">
            {hero.subtitle}
          </span>
        </h1>

        <p className="mb-12 max-w-2xl text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
          {hero.headline}
        </p>

        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-6">
          <a
            href={projectsHash}
            className="inline-flex h-14 items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            {hero.ctaPrimary}
          </a>

          <a
            href={cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-white px-8 text-base font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-95"
          >
            {contact.cvLabel}
          </a>
        </div>

        {metrics?.availability && (
          <div className="mt-16 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span>
              {about.stats.availabilityLabel}:{" "}
              <b className="text-slate-700 dark:text-slate-300">
                {metrics.availability}
              </b>
            </span>
          </div>
        )}
      </div>

      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-10 blur-[120px] dark:opacity-[0.05]"
        aria-hidden="true"
      >
        <div className="h-full w-full rounded-full bg-blue-600"></div>
      </div>
    </section>
  );
}


>







===== FILE:    src/components/LanguageSwitcher.tsx =====
<conteúdo completo do arquivo


'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { i18n } from '@/i18n-config'
import type { Locale } from '@/types/dictionary'
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie'

const languageLabels: Record<Locale, string> = {
  'pt-BR': 'PT',
  'en-US': 'EN',
  'es-ES': 'ES',
  'es-AR': 'AR',
  'es-MX': 'MX',
}

interface LanguageSwitcherProps {
  readonly currentLang: Locale
}

function LanguageSwitcherContent({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-9 w-40 sm:w-48 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 animate-pulse" />
    )
  }

  function writeLocaleCookie(locale: Locale) {
    document.cookie =
      `${LOCALE_COOKIE}=${locale}; ` +
      `path=${LOCALE_COOKIE_OPTIONS.path}; ` +
      `max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; ` +
      `SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}` +
      `${location.protocol === 'https:' ? '; Secure' : ''}`
  }

  const availableLocales = i18n.locales as readonly Locale[]

  return (
    <nav
      aria-label="Select language"
      className="inline-flex items-center gap-1 p-1 rounded-xl border
                 border-slate-200/50 dark:border-slate-800/50
                 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm"
    >
      {availableLocales.map((locale) => {
        const isActive = currentLang === locale

        const segments = pathname?.split('/').filter(Boolean) ?? []

        if (segments[0] && availableLocales.includes(segments[0] as Locale)) {
          segments[0] = locale
        } else {
          segments.unshift(locale)
        }

        const path = `/${segments.join('/')}`
        const query = searchParams?.toString()
        const href = query ? `${path}?${query}` : path

        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            onClick={() => writeLocaleCookie(locale)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase
              transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
          >
            {languageLabels[locale]}
          </Link>
        )
      })}
    </nav>
  )
}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense
      fallback={
        <div className="h-9 w-40 sm:w-48 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 animate-pulse" />
      }
    >
      <LanguageSwitcherContent {...props} />
    </Suspense>
  )
}


>









===== FILE:  src/components/Navbar.tsx  =====
<conteúdo completo do arquivo

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import type { Locale, Dictionary } from '@/types/dictionary'
import { NavSection, getSectionId } from '@/domain/navigation'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useScrollSpy } from '@/contexts/ScrollSpyContext'

interface NavbarProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export  default function Navbar({ lang, dict }: NavbarProps) {
  const { common, seo, about, experience, projects, articles, contact } = dict
  const { activeSection } = useScrollSpy()

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll quando menu mobile está aberto
  useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen, mounted])

  // Fecha menu ao trocar idioma
  useEffect(() => {
    setIsOpen(false)
  }, [lang])

  if (!mounted) return null

  // Mapeamento das labels conforme a estrutura real dos seus JSONs
  const navLinks: ReadonlyArray<{
    id: NavSection
    href: string
    label: string
  }> = [
    { id: NavSection.ABOUT, href: `/${lang}#${getSectionId(NavSection.ABOUT)}`, label: about.title },
    { id: NavSection.EXPERIENCE, href: `/${lang}#${getSectionId(NavSection.EXPERIENCE)}`, label: experience.title },
    { id: NavSection.PROJECTS, href: `/${lang}#${getSectionId(NavSection.PROJECTS)}`, label: projects.title },
    { id: NavSection.ARTICLES, href: `/${lang}#${getSectionId(NavSection.ARTICLES)}`, label: articles.title },
    { id: NavSection.CONTACT, href: `/${lang}#${getSectionId(NavSection.CONTACT)}`, label: contact.title },
  ]

  return (
    <nav
      role="navigation"
      aria-label={common.navigation}
      className={`fixed top-0 z-[100] w-full transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#020617]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* LOGO */}
        <Link
          href={`/${lang}`}
          aria-label={seo.siteName}
          className="group rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
            SÉRGIO<span className="text-blue-600">SANTOS</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-8">
            {navLinks.map(link => {
              const isActive = activeSection === link.id

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <ThemeToggle />
          </div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            aria-label={isOpen ? common.menu.aria.close : common.menu.aria.open}
            onClick={() => setIsOpen(prev => !prev)}
            className="p-2 text-slate-900 dark:text-white transition-transform active:scale-90"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full overflow-y-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-6 p-8">
          {navLinks.map(link => {
            const isActive = activeSection === link.id

            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-black tracking-tighter transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-900 dark:text-white hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {common.languageSwitcher}
            </p>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>
    </nav>
  )
}



>






===== FILE:   src/contexts/ScrollSpyContext.tsx   =====
<conteúdo completo do arquivo


'use client'

/**
 * CONTEXT: ScrollSpy
 * -----------------------------------------------------------------------------
 * Gerencia o estado da seção ativa durante a navegação por scroll.
 * Essencial para o feedback visual da Navbar e sincronização de UI.
 * Integrado com o domínio de Navegação (NavSection).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type ActiveSection = string | null

interface ScrollSpyContextValue {
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
  resetActiveSection: () => void
}

const ScrollSpyContext = createContext<ScrollSpyContextValue | undefined>(
  undefined,
)

interface ScrollSpyProviderProps {
  readonly children: React.ReactNode
  readonly sectionIds: readonly string[] | undefined
}

export function ScrollSpyProvider({
  children,
  sectionIds,
}: ScrollSpyProviderProps): JSX.Element {
  const [activeSection, setActiveSectionState] =
    useState<ActiveSection>(null)

  const setActiveSection = useCallback(
    (section: ActiveSection) => {
      setActiveSectionState((prev) =>
        prev === section ? prev : section,
      )
    },
    [],
  )

  const resetActiveSection = useCallback(() => {
    setActiveSectionState(null)
  }, [])

  const value = useMemo<ScrollSpyContextValue>(
    () => ({
      activeSection,
      setActiveSection,
      resetActiveSection,
    }),
    [activeSection, setActiveSection, resetActiveSection],
  )

  return (
    <ScrollSpyContext.Provider value={value}>
      {children}
    </ScrollSpyContext.Provider>
  )
}

/**
 * Hook oficial para consumir o ScrollSpy
 */
export function useScrollSpy(): ScrollSpyContextValue {
  const context = useContext(ScrollSpyContext)

  if (!context) {
    throw new Error(
      'useScrollSpy must be used within a ScrollSpyProvider',
    )
  }

  return context
}


>











===== FILE:   src/components/PageWrapper.tsx =====
<conteúdo completo do arquivo

'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ScrollSpyProvider } from '@/contexts/ScrollSpyContext'
import type { Locale } from '@/types/dictionary'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type interface PageWrapperProps {
  readonly children: ReactNode
  readonly lang: Locale
  /**
   * IDs das seções visíveis na página.
   * Usado por ScrollSpy, navegação e acessibilidade.
   */
  readonly sectionIds?: readonly string[]
}

/* -------------------------------------------------------------------------- */
/* INNER COMPONENT                                                            */
/* -------------------------------------------------------------------------- */

function PageLayoutContent({
  children,
  lang,
}: {
  children: ReactNode
  lang: Locale
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="min-h-screen w-full bg-white dark:bg-[#020617]"
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      lang={lang}
      className="
        relative
        min-h-[100dvh]
        flex
        flex-col
        bg-white
        dark:bg-[#020617]
        transition-colors
        duration-500
        overflow-x-hidden
      "
    >
      {/* BACKGROUND GLOBAL */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
      >
        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-full
            max-w-[1400px]
            h-[400px]
            md:h-[800px]
            opacity-30
            dark:opacity-20
            blur-[100px]
          "
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.25), transparent 70%)',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(#94a3b8 0.5px, transparent 0.5px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <main
        id="main-content"
        role="main"
        className="
          relative
          z-10
          flex-grow
          pt-20
          md:pt-28
          lg:pt-32
          motion-safe:animate-in
          motion-safe:fade-in
          motion-safe:slide-in-from-bottom-2
          motion-safe:duration-700
        "
      >
        {children}
      </main>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MAIN EXPORT                                                                */
/* -------------------------------------------------------------------------- */

export default function PageWrapper({
  children,
  lang,
  sectionIds,
}: PageWrapperProps) {
  return (
    <ScrollSpyProvider sectionIds={sectionIds}>
      <PageLayoutContent lang={lang}>
        {children}
      </PageLayoutContent>
    </ScrollSpyProvider>
  )
}


>



===== FILE:  src/components/PortfolioGrid.tsx    =====
<conteúdo completo do arquivo

'use client'

import { useState, useMemo } from 'react'
import type { ReactElement } from 'react'

import { ProjectCard } from './ProjectCard'
import { Filter, Database, FolderSearch, Sparkles } from 'lucide-react'

import type { Locale, Dictionary } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

interface PortfolioGridProps {
  readonly projects: readonly ProjectDomain[]
  readonly lang: Locale
  readonly dict: Dictionary
}

export const PortfolioGrid = ({
  projects,
  dict,
  lang,
}: PortfolioGridProps): ReactElement => {
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all')

  const projectsDict = dict.projects
  const categoriesDict = projectsDict.categories
  const statesDict = dict.states
  const commonDict = dict.common

  const filteredProjects = useMemo(() => {
    let base = projects.filter((p) => p.isPortfolio)

    if (activeCategory !== 'all') {
      base = base.filter(
        (p) => p.technology.labelKey === activeCategory
      )
    }

    return [...base].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      return 0
    })
  }, [projects, activeCategory])

  return (
    <section
      id="projects"
      aria-labelledby="portfolio-title"
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 gap-10">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Sparkles size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
                {projectsDict.featuredLabel}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 shrink-0">
                <Database className="w-7 h-7 md:w-8 md:h-8" />
              </div>


              <h2
                 id="portfolio-title"
                 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none"
              >
              {dict.seo.pages['projects']?.title ?? dict.projects.title}
             </h2>
              
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-blue-600 rounded-full" />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                {filteredProjects.length} {statesDict.emptyProjects.cta}
              </p>
            </div>
          </div>

          {/* FILTROS */}
          <nav
            className="w-full lg:w-auto"
            aria-label={commonDict.menu.aria.open}
          >
            <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-[0.2em]">
              <Filter className="text-blue-600 w-3.5 h-3.5" strokeWidth={3} />
              <span>{commonDict.navigation}</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                {projectsDict.viewAll}
              </button>

              {Object.entries(categoriesDict).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 whitespace-nowrap ${
                    activeCategory === key
                      ? 'bg-slate-900 text-white'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                lang={lang}
                dict={dict}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl">
              <FolderSearch className="w-12 h-12 mb-4" />
              <h3>{statesDict.emptyProjects.title}</h3>
              <p>{statesDict.emptyProjects.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

>







===== FILE:  src/components/ProjectCard.tsx   =====
<conteúdo completo do arquivo

'use client'

import {
  Github,
  ExternalLink,
  Folder,
  Star,
  Target,
  Lightbulb,
  TrendingUp,
} from 'lucide-react'
import type { Locale, Dictionary } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

interface ProjectCardProps {
  readonly project: ProjectDomain
  readonly lang: Locale
  readonly dict: Dictionary
}

export function ProjectCard({ project, dict }: ProjectCardProps) {
  const { projects: labels } = dict
  
  // No modelo dinâmico (GitHub), a descrição é única, 
  // mas mantemos o suporte ao split por '|' se você escrever assim no Readme/Description do GitHub.
  const descParts = project.description?.split('|').map(p => p.trim()) ?? []
  const problemText = descParts[0] || project.description || ''
  const solutionText = descParts[1] || ''
  const impactText = descParts[2] || ''

  const formatTechTag = (topic: string) => {
    const uppercaseTechs = ['aws', 'ml', 'ai', 'sql', 'etl', 'genai', 'api', 'bi', 'neo4j']
    if (uppercaseTechs.includes(topic.toLowerCase())) return topic.toUpperCase()
    return topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <article
      className={`
        group relative flex flex-col h-full w-full
        p-6 md:p-8 rounded-[2rem] border transition-all duration-500
        ${
          project.isFeatured
            ? 'border-blue-500/30 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/10'
            : 'border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950/40 shadow-sm hover:border-blue-500/20'
        }
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10
      `}
    >
      {project.isFeatured && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-500/20">
            <Star size={10} className="fill-amber-300 text-amber-300" />
            {labels.featuredLabel}
          </span>
        </div>
      )}

      <header className="flex justify-between items-start mb-6">
        <div className={`
          p-3 rounded-xl transition-all duration-500
          ${project.isFeatured ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
          group-hover:rotate-6 group-hover:scale-110
        `}>
          <Folder size={24} strokeWidth={2.5} />
        </div>

        <div className="flex gap-1">
          {project.htmlUrl && (
            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
              title="GitHub Repository"
            >
              <Github size={20} />
            </a>
          )}
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
              title="Live Demo"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </header>

      <div className="flex-grow flex flex-col">
        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {project.name}
        </h3>

        <div className="space-y-4">
          <CaseSection 
            icon={<Target size={14} />} 
            label={labels.firstLabel || "Context"} 
            text={problemText} 
            color="amber" 
          />

          {solutionText && (
            <CaseSection 
              icon={<Lightbulb size={14} />} 
              label={labels.featuredLabel || "Solution"} 
              text={solutionText} 
              color="blue" 
            />
          )}

          {impactText && (
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={12} />
                </div>
                <div>
                  <span className="block text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                    {labels.impactLabel || "Impact"}
                  </span>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase leading-tight italic mt-0.5">
                    {impactText}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/40 flex flex-wrap gap-2">
        {/* Badge da Categoria vinda da labelKey do dicionário */}
        <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800/30">
          {labels.categories[project.technology.labelKey as keyof typeof labels.categories] || project.technology.id}
        </span>

        {/* Tags da Stack (Topics do GitHub) */}
        {project.topics.slice(0, 3).map(tech => (
          <span
            key={tech}
            className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-100 dark:border-slate-700/50"
          >
            {formatTechTag(tech)}
          </span>
        ))}
      </footer>
    </article>
  )
}

function CaseSection({ icon, label, text, color }: { icon: React.ReactNode, label: string, text: string, color: 'amber' | 'blue' }) {
  const themes = {
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  }
  return (
    <div className="flex gap-3 group/section">
      <div className={`mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover/section:-rotate-12 ${themes[color]}`}>
        {icon}
      </div>
      <div>
        <span className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug font-medium line-clamp-3">
          {text}
        </p>
      </div>
    </div>
  )
}


>







===== FILE:    src/components/ProjectSection.tsx  =====
<conteúdo completo do arquivo



'use client'

import { useMemo, useState } from 'react'
import { Database, Filter, FolderSearch } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import type { Locale, Dictionary } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

interface ProjectSectionProps {
  readonly projects: ProjectDomain[]
  readonly lang: Locale
  readonly dict: Dictionary
}

export default function ProjectSection({
  projects = [],
  lang,
  dict,
}: ProjectSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all')

  const projectDict = dict.projects
  const statesDict = dict.states

  // 1. Mapeamento de labels corrigido e preciso
  const uiLabels = {
    all: projectDict.viewAll || "All",
    filter: dict.common.navigation,
    empty: statesDict.emptyProjects.description,
    itemsCount: lang === 'pt-BR' 
      ? 'Itens' 
      : (lang.startsWith('es') ? 'Elementos' : 'Items')
  }

  const filteredProjects = useMemo(() => {
    let base = [...projects]

    if (activeCategory !== 'all') {
      base = base.filter((p) => p.technology.labelKey === activeCategory)
    }

    // Ordenação: Projetos "isFirst" e "isFeatured" primeiro
    return base.sort((a, b) => {
      if (a.isFirst !== b.isFirst) return a.isFirst ? -1 : 1
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
      return 0
    })
  }, [projects, activeCategory])

  return (
    <section
      id="projects-list"
      aria-labelledby="projects-title"
      className="py-16 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                <Database className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 id="projects-title" className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                {projectDict.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-blue-600 rounded-full" />
              {/* 2. JSX Atualizado com a lógica de pluralização/idioma */}
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                {filteredProjects.length} {uiLabels.itemsCount}
              </p>
            </div>
          </div>

          <nav aria-label="Project filters" className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">
              <Filter className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              {uiLabels.filter}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 snap-x">
              <FilterButton 
                active={activeCategory === 'all'} 
                onClick={() => setActiveCategory('all')} 
                label={uiLabels.all} 
              />
              {Object.entries(projectDict.categories).map(([key, label]) => (
                <FilterButton 
                  key={key} 
                  active={activeCategory === key} 
                  onClick={() => setActiveCategory(key)} 
                  label={label as string} 
                />
              ))}
            </div>
          </nav>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 min-h-[300px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProjectCard
                  project={project}
                  lang={lang}
                  dict={dict}
                />
              </div>
            ))
          ) : (
            <EmptyState 
              title={statesDict.emptyProjects.title}
              message={uiLabels.empty} 
            />
          )}
        </div>
      </div>
    </section>
  )
}

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap snap-start ${
        active 
          ? 'bg-slate-900 border-slate-900 dark:bg-blue-600 dark:border-blue-600 text-white shadow-lg' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/40'
      }`}
    >
      {label}
    </button>
  )
}

function EmptyState({ title, message }: { title: string, message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-[2rem] border-4 border-dashed border-slate-100 dark:border-slate-900/50 bg-slate-50/30 dark:bg-slate-900/10">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl mb-6">
        <FolderSearch className="w-12 h-12 text-slate-200 dark:text-slate-800" aria-hidden="true" />
      </div>
      <h3 className="text-slate-900 dark:text-white font-bold mb-2">{title}</h3>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center max-w-sm px-6">
        {message}
      </p>
    </div>
  )
}


>












===== FILE: src/components/ProxyPage.tsx   =====
<conteúdo completo do arquivo

// src/components/ProxyPage.tsx
import type { ReactNode } from "react";
import { getDictionary } from "@/dictionaries";
import type { Locale, Dictionary } from "@/types/dictionary";
import { notFound } from "next/navigation";

interface ProxyPageProps {
  lang: Locale;
  children: (dictionary: Dictionary) => ReactNode;
}

/**
 * ProxyPage (Server Component)
 * Responsável apenas por:
 * - validar locale
 * - carregar dicionário
 * - injetar o dicionário corretamente
 */
export default async function ProxyPage({
  lang,
  children,
}: ProxyPageProps) {
  const supportedLocales: readonly Locale[] = [
    "pt-BR",
    "en-US",
    "es-ES",
    "es-AR",
    "es-MX",
  ] as const;

  if (!supportedLocales.includes(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <>{children(dictionary)}</>;
}



>






===== FILE:   src/components/ThemeToggle.tsx   =====
<conteúdo completo do arquivo


'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'
import type { Locale } from '@/types/dictionary'

/* -------------------------------------------------------------------------- */
/* 1. TYPES & CONTEXT                                                         */
/* -------------------------------------------------------------------------- */

export type ThemeType = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: ThemeType
  isDark: boolean
  mounted: boolean
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

/* -------------------------------------------------------------------------- */
/* 2. UNIFIED INFRASTRUCTURE PROVIDER                                         */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
      storageKey="sergio-portfolio-theme"
    >
      <ThemeInternalProvider mounted={mounted}>
        {/* Camada de visibilidade para evitar flash de cores incorretas */}
        <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
          {children}
        </div>
      </ThemeInternalProvider>
    </NextThemesProvider>
  )
}

function ThemeInternalProvider({ children, mounted }: { children: React.ReactNode, mounted: boolean }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = React.useMemo<ThemeContextValue>(() => ({
    theme: (theme as ThemeType) ?? 'system',
    isDark: resolvedTheme === 'dark',
    mounted,
    toggleTheme,
  }), [theme, resolvedTheme, mounted, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. CUSTOM HOOK & UI TOGGLE                                                 */
/* -------------------------------------------------------------------------- */

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}

export function ThemeToggle() {
  const pathname = usePathname()
  const { toggleTheme, isDark, mounted } = useTheme()

  // i18n Strategy - Alinhada com os dicionários e variações regionais
  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' },
  }

  // Detecta o locale via URL (ex: /es-MX/...) e aplica fallback inteligente
  const langRaw = pathname?.split('/')[1] as Locale | undefined
  const langKey = langRaw?.split('-')[0] as keyof typeof labels // 'pt', 'en' ou 'es'
  const t = labels[langKey] || labels.pt
  const currentLabel = isDark ? t.light : t.dark

  if (!mounted) {
    return (
      <div className="w-11 h-11 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse border border-transparent" />
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={currentLabel}
      title={currentLabel}
      className="group relative w-11 h-11 flex items-center justify-center rounded-xl 
                 bg-white/80 dark:bg-slate-900/80 border border-slate-200 
                 dark:border-slate-800/60 shadow-sm backdrop-blur-md
                 hover:border-blue-500/50 dark:hover:border-amber-500/50
                 transition-all duration-300 active:scale-95"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <Sun 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 text-amber-500
            ${isDark ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-8 opacity-0 -rotate-90'}`} 
        />
        <Moon 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 text-slate-600 dark:text-slate-400
            ${!isDark ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-8 opacity-0 rotate-90'}`} 
        />
      </div>
      <span className="absolute inset-0 rounded-xl ring-0 ring-blue-500/20 group-hover:ring-4 transition-all duration-300" />
    </button>
  )
}


>





===== FILE: src/components/error-display.tsx   =====
<conteúdo completo do arquivo

'use client';

import type { ErrorDictionary } from '@/types/error-dictionary';

export interface ErrorDisplayProps {
  errorKey: keyof ErrorDictionary;
  errorId?: string;
  dictionary: ErrorDictionary;
  reset: () => void;
}

export function ErrorDisplay({
  errorKey,
  errorId,
  dictionary,
  reset,
}: ErrorDisplayProps) {
  const errorData =
    dictionary[errorKey] ?? dictionary.InternalServerError;

  return (
    <div className="flex min-h-[400px] w-full max-w-xl flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <h2 className="mb-3 text-2xl font-bold text-red-600 dark:text-red-500 md:text-3xl">
        {errorData.title}
      </h2>

      <p className="mb-6 max-w-lg text-gray-600 dark:text-gray-400 leading-relaxed">
        {errorData.message}
      </p>

      <div className="mb-8 w-full rounded-xl border border-gray-200 bg-gray-100 p-5 text-sm dark:border-slate-700 dark:bg-slate-800/50">
        <p className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
          {errorData.action}
        </p>

        {errorId && (
          <div className="mt-3 border-t border-gray-200 pt-3 dark:border-slate-700">
            <code className="text-[10px] uppercase tracking-wider text-gray-500">
              ID: {errorId}
            </code>
          </div>
        )}
      </div>

      <button
        onClick={reset}
        className="min-w-[160px] rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
      >
        Tentar novamente
      </button>
    </div>
  );
}

>







===== FILE: src/components/profile-form.tsx  =====
<conteúdo completo do arquivo


'use client';

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/user-actions";
import { ErrorDictionary } from "@/types/error-dictionary";
import ErrorBox from "@/components/ErrorBox";
import { Loader2, Save } from "lucide-react";

// Simulando a importação do dicionário (Em produção, use seu Hook de i18n)
import ptBR from "@/dictionaries/errors/pt-BR.json";

export function ProfileForm() {
  // 1. Hook de estado da Server Action (Padrão Next.js 16)
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  // No seu sistema real, 'dict' viria de um Contexto de Idioma
  const dict = ptBR.errors as ErrorDictionary;

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="name" 
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nome Completo
          </label>
          <input
            id="name"
            name="name"
            disabled={isPending}
            placeholder="Digite seu nome..."
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-400"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>

      {/* 2. Exibição Consistente de Erros */}
      {state?.success === false && state.error && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <ErrorBox
            errorKey={state.error.name as keyof ErrorDictionary}
            dictionary={dict}
            errorId={state.error.errorId}
            onRetry={() => {
              // Lógica opcional de limpar erro ou focar no campo
              const input = document.getElementById('name');
              input?.focus();
            }}
            retryLabel="Corrigir agora"
          />
        </div>
      )}

      {/* 3. Feedback de Sucesso */}
      {state?.success && (
        <p className="text-center text-sm text-green-600 font-medium animate-bounce">
          Perfil atualizado com sucesso!
        </p>
      )}
    </div>
  );
}


>







===== FILE:   src/components/featured/FeaturedGrid.tsx     =====
<conteúdo completo do arquivo

/*
    Está é uma pasta especial 
   src/components/featured


  Transformar o FeaturedGrid em Masonry / Bento layout

focar no Menu de Navegação para garantir que o ScrollSpy funcione visualmente



Vamos entender a logica dessa
Pasta src/components/featured 
E dos arquivos nela contidos

Ela só vai mostrar três projetos do Github 


 no próximo passo:

alinhar isso com o SEO dinâmico

integrar com ScrollSpy

ou adaptar para Grid Masonry / Featured layout


Ele tem que mostrar tres projetos, nessa ordem:

  1) https://github.com/Santosdevbjj/analiseRiscosAtrasoObras


2)
https://github.com/Santosdevbjj/analiseDadosNaPratica


3)
https://github.com/Santosdevbjj/genAIpipeETLPython


src/

 ├─ components/

 │   ├─ featured/

 │   │   ├─ FeaturedProjectsSection.tsx

 │   │   ├─ FeaturedGrid.tsx

 │   │   ├─ ProjectCard.tsx

 │   │   └─ projects.data.ts

 │   └─ hooks/

 │       └─ useScrollSpy.ts 


*/


'use client'

import ProjectCard from './ProjectCard'
import type { FeaturedProject } from './projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedGridProps {
}

export default function FeaturedGrid({ projects, lang, dict }: FeaturedGridProps) {
}


>






===== FILE:    src/components/featured/FeaturedProjectsSection.tsx   =====
<conteúdo completo do arquivo

import FeaturedGrid from './FeaturedGrid'
import { featuredProjects, type FeaturedProject } from './projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedProjectsSectionProps {
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export default function FeaturedProjectsSection({ lang, dict }: FeaturedProjectsSectionProps) {
  const projects = [...featuredProjects].sort((a, b) => a.priority - b.priority).slice(0, 3)

  return (
    <section id="featured-projects" className="relative border-y border-slate-100 bg-white py-24 dark:border-slate-900 dark:bg-[#020617]/50 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {dict.projects.featuredLabel}
          </span>
          <h2 className="mb-6 text-4xl font-black tracking-tight dark:text-white sm:text-5xl">
            {dict.projects.title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {dict.seo.pages.projects.description}
          </p>
        </div>

        <FeaturedGrid projects={projects} lang={lang} dict={dict} />
      </div>
    </section>
  )
}


>







===== FILE:    src/components/featured/ProjectCard.tsx  =====
<conteúdo completo do arquivo

'use client'

import type { FeaturedProject } from './projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface ProjectCardProps {
  readonly project: FeaturedProject
  readonly lang: SupportedLocale
  readonly dict: Dictionary
  readonly featured?: boolean
}

export default function ProjectCard({ project, lang, dict, featured = false }: ProjectCardProps) {
  const projectUrl = `/${lang}/projects#${project.id}`

  return (
    <article
      id={project.id}
      className={`
        relative flex flex-col justify-between rounded-2xl border border-slate-200 
        bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
        dark:border-slate-800 dark:bg-slate-900
        ${featured ? 'lg:col-span-2 lg:row-span-2' : 'col-span-1'}
      `}
    >
      <div>
        <h3 className={`${featured ? 'text-3xl' : 'text-xl'} mb-4 font-bold text-slate-900 dark:text-white`}>
          {project.name}
        </h3>
        <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {project.description[lang]}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {dict.projects.viewProject} 
          <span className="ml-2">→</span>
        </a>
      </div>
    </article>
  )
}


>










===== FILE:    src/components/featured/projects.data.ts   =====
<conteúdo completo do arquivo


import type { SupportedLocale } from '@/dictionaries'
import type { ProjectCategory } from '@/types/project'

export interface FeaturedProject {
  id: string
  name: string
  description: Record<SupportedLocale, string>
  repoUrl: string
  categories: readonly ProjectCategory[]
  priority: number
}

export const featuredProjects = [
  {
    id: 'analise-riscos-atraso-obras',
    name: 'Análise de Riscos de Atraso em Obras',
    repoUrl: 'https://github.com/Santosdevbjj/analiseRiscosAtrasoObras',
    priority: 1,
    categories: ['dataScience', 'analysis'],
    description: {
      pt: 'Projeto de ciência de dados para análise preditiva de riscos de atraso em obras.',
      en: 'Data science project focused on predictive risk analysis for construction delays.',
      es: 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.',
      'es-ES': 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.',
      'es-AR': 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.',
      'es-MX': 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.',
      'pt-BR': 'Projeto de ciência de dados para análise preditiva de riscos de atraso em obras.',
      'en-US': 'Data science project focused on predictive risk analysis for construction delays.'
    },
  },
  {
    id: 'analise-dados-na-pratica',
    name: 'Análise de Dados na Prática',
    repoUrl: 'https://github.com/Santosdevbjj/analiseDadosNaPratica',
    priority: 2,
    categories: ['dataScience', 'graphs'],
    description: {
      pt: 'Projeto prático focado em análise exploratória de dados e insights.',
      en: 'Hands-on project focused on exploratory data analysis and insights.',
      es: 'Proyecto práctico centrado en análisis exploratorio de datos e insights.',
      'es-ES': 'Proyecto práctico centrado en análisis exploratorio de datos e insights.',
      'es-AR': 'Proyecto práctico centrado en análisis exploratorio de datos e insights.',
      'es-MX': 'Proyecto práctico centrado en análisis exploratorio de datos e insights.',
      'pt-BR': 'Projeto prático focado em análise exploratória de dados e insights.',
      'en-US': 'Hands-on project focused on exploratory data analysis and insights.'
    },
  },
  {
    id: 'genai-pipeline-etl-python',
    name: 'GenAI Pipeline ETL em Python',
    repoUrl: 'https://github.com/Santosdevbjj/genAIpipeETLPython',
    priority: 3,
    categories: ['dataScience', 'cloud'],
    description: {
      pt: 'Pipeline ETL moderno em Python com integração de IA generativa.',
      en: 'Modern Python ETL pipeline with generative AI integration.',
      es: 'Pipeline ETL moderno en Python con integración de IA generativa.',
      'es-ES': 'Pipeline ETL moderno en Python con integración de IA generativa.',
      'es-AR': 'Pipeline ETL moderno en Python con integración de IA generativa.',
      'es-MX': 'Pipeline ETL moderno en Python con integración de IA generativa.',
      'pt-BR': 'Pipeline ETL moderno em Python com integração de IA generativa.',
      'en-US': 'Modern Python ETL pipeline with generative AI integration.'
    },
  },
] as const satisfies readonly FeaturedProject[]

export type FeaturedProjectId = (typeof featuredProjects)[number]['id']


>







===== FILE: src/hooks/useScrollSpy.ts =====
<conteúdo completo do arquivo

'use client'

import { useEffect, useState } from 'react'

export function useScrollSpy(sectionIds: readonly string[], offset: number = 100): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `-${offset}px 0px -50% 0px`, threshold: 0.1 }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds, offset])

  return activeId
}

>









===== FILE:  src/components/projects/ProjectCategoryBadge.tsx  =====
<conteúdo completo do arquivo


interface Props {
  readonly label: string
}

export function ProjectCategoryBadge({ label }: Props) {
  if (!label) return null

  return (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 transition-colors dark:bg-blue-900/30 dark:text-blue-300">
      {label}
    </span>
  )
}


>









===== FILE:   src/components/projects/ProjectsGrid.tsx    =====
<conteúdo completo do arquivo

'use client'

import type { FeaturedProject } from '@/components/featured/projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'
import { ProjectCategoryBadge } from './ProjectCategoryBadge'

interface ProjectsGridProps {
  readonly projects: readonly FeaturedProject[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export function ProjectsGrid({ projects, lang, dict }: ProjectsGridProps) {
  if (!projects.length) return null

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
      {projects.map((project) => (
        <article key={project.id} className="flex flex-col justify-between rounded-2xl border border-neutral-200 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{project.description[lang]}</p>
            <div className="flex flex-wrap gap-2">
              {project.categories.map((cat) => (
                <ProjectCategoryBadge key={cat} label={dict.projects.categories[cat as keyof typeof dict.projects.categories]} />
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}


>








===== FILE:   src/components/error/ErrorBoundaryView.tsx     =====
<conteúdo completo do arquivo

'use client';

import { useEffect, useMemo } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import type { ErrorDictionary } from '@/types/error-dictionary';

import ptBR from '@/dictionaries/errors/pt-BR.json';
import enUS from '@/dictionaries/errors/en-US.json';
import esES from '@/dictionaries/errors/es-ES.json';
import esAR from '@/dictionaries/errors/es-AR.json';
import esMX from '@/dictionaries/errors/es-MX.json';

const dictionaries = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
  'es-AR': esAR,
  'es-MX': esMX,
} as const;

type SupportedLocale = keyof typeof dictionaries;

interface ErrorBoundaryViewProps {
  error: Error & { digest?: string };
  reset: () => void;
  withHtmlWrapper?: boolean;
}

export function ErrorBoundaryView({
  error,
  reset,
  withHtmlWrapper = false,
}: ErrorBoundaryViewProps) {
  const locale: SupportedLocale = useMemo(() => {
    if (typeof navigator === 'undefined') return 'pt-BR';

    const lang = navigator.language;

    if (lang in dictionaries) return lang as SupportedLocale;
    if (lang.startsWith('en')) return 'en-US';
    if (lang.startsWith('es')) {
      if (lang.includes('AR')) return 'es-AR';
      if (lang.includes('MX')) return 'es-MX';
      return 'es-ES';
    }

    return 'pt-BR';
  }, []);

  const dictionary: ErrorDictionary = dictionaries[locale].errors;

  const errorKey: keyof ErrorDictionary =
    error.name in dictionary
      ? (error.name as keyof ErrorDictionary)
      : 'InternalServerError';

  useEffect(() => {
    console.error('APP_ERROR', {
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  const content = (
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-4 dark:bg-slate-950">
      <ErrorDisplay
        errorKey={errorKey}
        dictionary={dictionary}
        reset={reset}
        {...(error.digest ? { errorId: error.digest } : {})}
      />
    </main>
  );

  if (!withHtmlWrapper) {
    return content;
  }

  return (
    <html lang={locale.split('-')[0]}>
      <body className="antialiased">{content}</body>
    </html>
  );
}


>






===== FILE:    src/components/navigation/Breadcrumbs.tsx =====
<conteúdo completo do arquivo

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Importação otimizada para Tree-shaking conforme documentação
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/types/dictionary';

interface BreadcrumbsProps {
  lang: Locale;
  baseUrl: string;
}

/**
 * Componente Visual de Breadcrumbs (Navegação estrutural)
 * - Responsivo (scroll horizontal em telas pequenas)
 * - Acessível (Aria labels e ícones ocultos para SR)
 * - Multilingue (Integração com Dicionário e SEO)
 */
export function Breadcrumbs({ lang, baseUrl }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Memoização para evitar re-renderizações desnecessárias
  const dict = useMemo(() => getDictionary(lang), [lang]);

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    return generateBreadcrumbs(pathname, lang, dict, baseUrl);
  }, [pathname, lang, dict, baseUrl]);

  // Se estiver na Home do idioma, não exibimos a barra de navegação
  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex py-4 px-2 text-sm text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar scroll-smooth"
    >
      <ol className="flex items-center space-x-2 whitespace-nowrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.item} className="flex items-center">
              {/* Separador: Não aparece antes do primeiro item */}
              {index > 0 && (
                <ChevronRight 
                  size={16} 
                  strokeWidth={2}
                  className="mx-1 text-slate-400 flex-shrink-0" 
                  aria-hidden="true" 
                />
              )}
              
              {isLast ? (
                // Último item (página atual): Apenas texto em destaque, sem link
                <span 
                  className="font-bold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-none"
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                // Itens clicáveis
                <Link
                  href={crumb.item}
                  className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {/* Ícone de Home apenas no primeiro item */}
                  {index === 0 && (
                    <Home 
                      size={16} 
                      className="mr-1.5 flex-shrink-0" 
                      aria-hidden="true" 
                    />
                  )}
                  <span>{crumb.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


>









===== FILE:     src/components/seo/BreadcrumbsJsonLd.tsx  =====
<conteúdo completo do arquivo


'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/types/dictionary';

interface BreadcrumbsJsonLdProps {
  lang: Locale;
  baseUrl: string;
}

/**
 * Injeta Schema.org JSON-LD para Breadcrumbs.
 * Crucial para que o Google exiba a estrutura de pastas nos resultados de busca.
 */
export function BreadcrumbsJsonLd({
  lang,
  baseUrl,
}: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();

  const normalizedBaseUrl = useMemo(
    () => baseUrl.replace(/\/+$/, ''),
    [baseUrl]
  );

  // Obtém o dicionário (já validado pelo getDictionary)
  const dict = useMemo(() => getDictionary(lang), [lang]);

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    return generateBreadcrumbs(pathname, lang, dict, normalizedBaseUrl);
  }, [pathname, lang, dict, normalizedBaseUrl]);

  useEffect(() => {
    if (!breadcrumbs.length) return;

    const scriptId = `breadcrumbs-jsonld-${lang}`;
    
    try {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      };

      // Gerenciamento do Script no DOM
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(jsonLd);

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[BreadcrumbsJsonLd Error]:', error);
      }
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [breadcrumbs, lang]);

  return null;
}


>





















===== FILE:   src/proxy.ts      =====
<conteúdo completo do arquivo

import { NextRequest, NextResponse } from 'next/server'
import { Locale } from '@/types/dictionary'

const SUPPORTED_LOCALES: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]
const DEFAULT_LOCALE: Locale = "pt-BR"

export default function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Proteção otimizada para Next.js 16
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') || 
    pathname === '/favicon.ico' ||
    pathname.startsWith('/assets/') // Adicionado para garantir performance de imagens
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Redirecionamento limpo
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`
  
  return NextResponse.redirect(url)
}



>











===== FILE:    src/ProxyClient.tsx =====
<conteúdo completo do arquivo


'use client'

import React from 'react'
import { notFound } from 'next/navigation'

// 1. Imports de Tipos (Metadados - SEMpre com .js no final em 2026)
import type { Locale, Dictionary } from '@/types/dictionary.js'
import type { ProjectDomain } from '@/domain/projects.js'

// 2. Imports de Valores (Componentes - Removido o 'type' para permitir o uso no JSX)
// Nota: Em 2026, usamos a extensão .js mesmo para arquivos .tsx no ESM nativo
import PageWrapper from '@/components/PageWrapper.js'
import Navbar from '@/components/Navbar.js'
import HeroSection from '@/components/HeroSection.js'
import AboutSection from '@/components/AboutSection.js'
import ExperienceSection from '@/components/ExperienceSection.js'
import FeaturedProjectsSection from '@/components/featured/FeaturedProjectsSection.js'
import ProjectSection from '@/components/ProjectSection.js'
import FeaturedArticleSection from '@/components/FeaturedArticleSection.js'
import ContactSection from '@/components/ContactSection.js'
import Footer from '@/components/Footer.js'

interface ProxyClientProps {
  readonly lang: Locale
  readonly initialProjects: ProjectDomain[]
  readonly dictionary: Dictionary
}

export default function ProxyClient({
  lang,
  initialProjects,
  dictionary,
}: ProxyClientProps): React.JSX.Element {
  
  // Verificação robusta do dicionário
  if (!dictionary || !dictionary.hero) {
    return notFound()
  }

  return (
    <PageWrapper lang={lang} sectionIds={['sobre', 'trajetoria', 'projetos', 'artigos', 'contato']}>
      <Navbar lang={lang} dict={dictionary} />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white antialiased dark:bg-[#020617]">
        {/* HERO - Prioridade de carregamento (LCP) */}
        <section id="hero">
          <HeroSection lang={lang} dict={dictionary} />
        </section>

        {/* ABOUT - Layout Responsivo Adaptável */}
        <section
          id="sobre"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12"
        >
          <AboutSection lang={lang} dict={dictionary} />
        </section>

        {/* EXPERIENCE - Alternância de fundo para escaneabilidade */}
        <section
          id="trajetoria"
          className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <ExperienceSection lang={lang} dict={dictionary} />
          </div>
        </section>

        {/* PROJECTS - Grid de Projetos Críticos */}
        <section
          id="projetos"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedProjectsSection lang={lang} dict={dictionary} />

          <div className="mt-12 border-t pt-12 dark:border-slate-800">
            <ProjectSection
              projects={initialProjects}
              lang={lang}
              dict={dictionary}
            />
          </div>
        </section>

        {/* ARTICLES - Integração com Medium */}
        <section
          id="artigos"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedArticleSection lang={lang} dict={dictionary} />
        </section>

        {/* CONTACT - Conversão e CTA Final */}
        <section
          id="contato"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <ContactSection lang={lang} dict={dictionary} />
        </section>
      </main>

      <Footer lang={lang} dict={dictionary} />
    </PageWrapper>
  )
}



>






===== FILE: src/i18n-config.ts   =====
<conteúdo completo do arquivo


/**
 * I18N CONFIG — FONTE ÚNICA DE VERDADE
 * -----------------------------------------------------------------------------
 * Sincronizado com: src/types/dictionary.ts e src/dictionaries/index.ts
 */

import type { Locale } from '@/types/dictionary';

export const i18n = {
  defaultLocale: 'pt-BR' as const,
  /**
   * Lista exaustiva baseada nos arquivos JSON e no tipo Locale.
   * Manter em sincronia com src/types/dictionary.ts
   */
  locales: ['pt-BR', 'en-US', 'es-ES', 'es-AR', 'es-MX'] as const,
} as const;

/**
 * Metadata por idioma para SEO e UI (Language Switcher)
 */
export const localeMetadata: Record<
  Locale,
  {
    name: string;
    label: string;
    region: string;
    flag: string;
    hrefLang: string;
    description: string;
  }
> = {
  'pt-BR': {
    name: 'Português',
    label: 'PT',
    region: 'pt-BR',
    flag: '🇧🇷',
    hrefLang: 'pt-BR',
    description: 'Engenharia de Dados, Ciência de Dados, IA e Sistemas de Missão Crítica.',
  },
  'en-US': {
    name: 'English',
    label: 'EN',
    region: 'en-US',
    flag: '🇺🇸',
    hrefLang: 'en-US',
    description: 'Data Engineering, Data Science, AI, and Mission-Critical Systems.',
  },
  'es-ES': {
    name: 'Español (España)',
    label: 'ES',
    region: 'es-ES',
    flag: '🇪🇸',
    hrefLang: 'es-ES',
    description: 'Ingeniería de Datos, Ciencia de Datos, IA y Sistemas de Misión Crítica.',
  },
  'es-AR': {
    name: 'Español (Argentina)',
    label: 'AR',
    region: 'es-AR',
    flag: '🇦🇷',
    hrefLang: 'es-AR',
    description: 'Ingeniería de Datos, Ciencia de Datos, IA y Sistemas de Misión Crítica.',
  },
  'es-MX': {
    name: 'Español (México)',
    label: 'MX',
    region: 'es-MX',
    flag: '🇲🇽',
    hrefLang: 'es-MX',
    description: 'Ingeniería de Datos, Ciencia de Datos, IA y Sistemas de Misión Crítica.',
  },
};

export const DEFAULT_HREFLANG = 'x-default';

/**
 * Validação segura de locale
 * Verifica se uma string de rota é um locale suportado pela aplicação.
 */
export function isSupportedLocale(locale: string): locale is Locale {
  return (i18n.locales as readonly string[]).includes(locale as Locale);
}



>









===== FILE: src/lib/github.ts   =====
<conteúdo completo do arquivo


import type { Locale } from '@/i18n-config';
import { ProjectCoreTag, resolveProjectFlags, resolveProjectTechnology } from '@/domain/projects';
import type { Project } from '@/domain/projects';

export async function getGitHubProjects(lang: Locale): Promise<Project[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const url = `https://api.github.com/users/Santosdevbjj/repos?per_page=100&sort=updated`;

  // Criamos um controle de interrupção (Timeout manual de 4 segundos)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, {
      headers: { 
        'Accept': 'application/vnd.github+json', 
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'User-Agent': 'Portfolio-Vercel'
      },
      next: { revalidate: 3600 },
      signal: controller.signal // Conecta o timeout à requisição
    });

    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const repos = await res.json();
    if (!Array.isArray(repos)) return [];

    return repos
      .filter((r: any) => !r.fork && r.topics?.includes(ProjectCoreTag.PORTFOLIO))
      .map((repo: any) => {
        const topics = repo.topics || [];
        const tech = resolveProjectTechnology(topics);
        if (!tech) return null;

        const langIndex = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2;
        const parts = repo.description?.split('|') || [];
        const description = parts[langIndex]?.trim() || repo.description || '';

        return {
          id: String(repo.id),
          name: repo.name.replace(/[-_]/g, ' '),
          description,
          htmlUrl: repo.html_url,
          homepage: repo.homepage,
          topics,
          technology: tech,
          ...resolveProjectFlags(topics)
        } as Project;
      })
      .filter((p): p is Project => p !== null);

  } catch (e: any) {
    if (e.name === 'AbortError') {
      console.error('[GitHub] Timeout: API demorou demais para responder.');
    } else {
      console.error('[GitHub] Erro na busca:', e);
    }
    return []; // Retorna vazio mas NÃO deixa a função da Vercel estourar o tempo
  }
}


>












===== FILE:  src/lib/getServerDictionary.ts    =====
<conteúdo completo do arquivo

import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/types/dictionary";

export async function getServerDictionary(locale: Locale) {
  return await getDictionary(locale);
}



>









===== FILE: src/lib/analytics.ts     =====
<conteúdo completo do arquivo


/**
 * LIB: Analytics Unified Layer (Versão Sênior - Anti-Hydration Error)
 */

import {
  CONSENT_COOKIE_NAME,
  DEFAULT_CONSENT,
  getSafeConsent,
  type ConsentPreferences,
} from '@/lib/consent';

export interface AnalyticsEvent {
  readonly name: string;
  readonly props?: Record<string, unknown>;
}

declare global {
  interface Window {
    gtag?: (command: any, targetId: any, config?: any) => void;
    plausible?: (event: string, options?: { props?: any }) => void;
    posthog?: { capture: (event: string, props?: any) => void };
  }
}

/**
 * Recupera o consentimento apenas no lado do cliente.
 */
function getActiveConsent(): ConsentPreferences {
  // Se não estiver no navegador, retorna o padrão restritivo imediatamente
  if (typeof window === 'undefined') return DEFAULT_CONSENT;

  try {
    const cookies = document.cookie.split('; ');
    const consentRow = cookies.find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (!consentRow || !consentRow.includes('=')) return DEFAULT_CONSENT;

    const value = consentRow.split('=')[1];
    if (!value) return DEFAULT_CONSENT;

    const rawValue = decodeURIComponent(value).trim();
    
    // Proteção crucial: Só tenta o parse se a string parecer um objeto
    if (rawValue.startsWith('{') && rawValue.endsWith('}')) {
      const parsedValue = JSON.parse(rawValue);
      return getSafeConsent(parsedValue);
    }
    
    return DEFAULT_CONSENT;
  } catch (error) {
    console.warn('[Analytics] Consent recovery silent fail:', error);
    return DEFAULT_CONSENT;
  }
}

/**
 * Dispara eventos de forma segura.
 */
export function track({ name, props }: AnalyticsEvent): void {
  // 1. Bloqueio de execução no servidor (Hydration Shield)
  if (typeof window === 'undefined') return;

  try {
    const consent = getActiveConsent();
    
    // 2. Só prossegue se o usuário deu ok para analytics
    if (!consent?.analytics) return;

    const eventProps = props || {};

    // 3. Execução segura nos provedores
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, eventProps);
    }

    if (typeof window.plausible === 'function') {
      window.plausible(name, { props: eventProps });
    }

    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(name, eventProps);
    }
  } catch (err) {
    // 4. Erros de tracking nunca devem derrubar a aplicação principal
    console.error('[Analytics] Track failed:', err);
  }
}


>





===== FILE:   src/lib/consent.ts   =====
<conteúdo completo do arquivo


/**
 * LIB: Consent Management
 * -----------------------------------------------------------------------------
 * Gerencia preferências de consentimento do usuário em conformidade com LGPD / GDPR.
 * * * Foco: Integridade de dados para Analytics e Cookies Essenciais.
 * * Este arquivo é o contrato de verdade para o Cookie Banner e Scripts de Terceiros.
 */

/**
 * Versão do schema de consentimento.
 * Incrementada apenas se a estrutura da interface mudar.
 */
export const CONSENT_VERSION = 'v1';

/**
 * Nome canônico do cookie de consentimento.
 */
export const CONSENT_COOKIE_NAME = `portfolio_consent_${CONSENT_VERSION}`;

/**
 * Estrutura oficial de preferências de consentimento.
 * O uso de 'readonly' garante que as preferências não sejam alteradas acidentalmente em runtime.
 */
export interface ConsentPreferences {
  /**
   * Cookies estritamente necessários (Sessão, Idioma, Segurança).
   * Obrigatório por lei → sempre true.
   */
  readonly necessary: true;

  /**
   * Cookies de performance e analytics (Google Analytics, Vercel Analytics).
   */
  readonly analytics: boolean;
}

/**
 * Consentimento padrão (Privacy by Default).
 * Em conformidade com a LGPD, analytics começa como 'false'.
 */
export const DEFAULT_CONSENT: Readonly<ConsentPreferences> = {
  necessary: true,
  analytics: false,
};

/**
 * Opções de persistência para o cookie de consentimento.
 */
export const CONSENT_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: false, // Precisa ser lido via JS para ativar scripts de Analytics
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 365, // 1 ano
} as const;

/**
 * Type Guard: Valida se um objeto desconhecido (vindo do cookie) 
 * respeita o contrato de consentimento.
 */
export function isValidConsent(value: unknown): value is ConsentPreferences {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    candidate.necessary === true &&
    typeof candidate.analytics === 'boolean'
  );
}

/**
 * Helper: Retorna um objeto de consentimento seguro.
 * Protege a aplicação contra valores corrompidos ou schemas antigos no navegador do usuário.
 */
export function getSafeConsent(value: unknown): ConsentPreferences {
  if (isValidConsent(value)) {
    return value;
  }
  return DEFAULT_CONSENT;
}

/**
 * Nota Técnica:
 * Para salvar o consentimento, utilize:
 * cookieStore.set(CONSENT_COOKIE_NAME, JSON.stringify(preferences), CONSENT_COOKIE_OPTIONS);
 */


>








===== FILE: src/lib/locale-cookie.ts   =====
<conteúdo completo do arquivo


/**
 * LIB: Locale Cookie
 * -----------------------------------------------------------------------------
 * Responsável por gerenciar a persistência do idioma do usuário via Cookies.
 * Este arquivo garante que a escolha do usuário seja respeitada entre 
 * sessões e requisições, servindo como base para o Middleware e o LanguageSwitcher.
 */

import { i18n, type Locale } from '@/i18n-config';

/**
 * Nome canônico do cookie de idioma.
 * 'NEXT_LOCALE' é o padrão reconhecido pelo ecossistema Next.js.
 */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * ALIAS PARA COMPATIBILIDADE:
 * Adicionado para resolver o erro de build nos componentes que buscam 'LOCALE_COOKIE'.
 */
export const LOCALE_COOKIE = LOCALE_COOKIE_NAME;

/**
 * Reexportação do tipo para manter a independência do domínio de cookies
 */
export type SupportedLocale = Locale;

/**
 * Locale padrão obtido diretamente da configuração global (SSOT - Single Source of Truth)
 */
export const DEFAULT_LOCALE: SupportedLocale = i18n.defaultLocale;

/**
 * Opções de configuração do cookie.
 * Configurado para durar 1 ano e ser acessível via Client/Server.
 */
export const LOCALE_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: false, // Necessário para o LanguageSwitcher (Client Side) ler/gravar
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 365, // 1 ano (31.536.000 segundos)
} as const;

/**
 * Type Guard: Valida se um valor de entrada é um idioma suportado pelo sistema.
 */
export function isValidLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === 'string' && 
    (i18n.locales as readonly string[]).includes(value)
  );
}

/**
 * Helper: Retorna um locale válido garantido.
 * Caso a entrada seja inválida ou nula, retorna o fallback (pt).
 */
export function getSafeLocale(
  value: unknown,
  fallback: SupportedLocale = DEFAULT_LOCALE,
): SupportedLocale {
  return isValidLocale(value) ? value : fallback;
}



>










===== FILE:    src/lib/logger.ts   =====
<conteúdo completo do arquivo


// src/lib/logger.ts
import { BaseError } from "@/lib/errors";

/**
 * Interface para logs estruturados
 * Alinhado com padrões de observabilidade modernos (Datadog/Sentry)
 */
interface LogMetadata {
  level: "INFO" | "WARN" | "ERROR" | "FATAL";
  timestamp: string;
  name?: string;
  message: string;
  errorId?: string;
  requestId?: string;
  location?: string;
  context?: unknown;
  stack?: string;
  env: string;
}

export const logger = {
  /**
   * Registra erros de forma estruturada.
   * Se for uma instância de BaseError, extrai metadados automáticos.
   */
  error: (error: unknown, additionalContext?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const env = process.env.NODE_ENV || "development";

    let logPayload: LogMetadata;

    if (error instanceof BaseError) {
      logPayload = {
        level: "ERROR",
        timestamp,
        env,
        name: error.name,
        message: error.message,
        errorId: error.errorId,
        requestId: error.requestId,
        location: error.errorLocationCode,
        context: {
          ...(typeof error.context === "object" ? error.context : {}),
          ...additionalContext,
        },
        stack: error.stack,
      };
    } else {
      // Fallback para erros nativos ou desconhecidos
      const isError = error instanceof Error;
      logPayload = {
        level: "ERROR",
        timestamp,
        env,
        name: isError ? error.name : "UNKNOWN_ERROR",
        message: isError ? error.message : String(error),
        context: additionalContext,
        stack: isError ? error.stack : undefined,
      };
    }

    // Em Desenvolvimento: Log visualmente rico
    if (env === "development") {
      console.error(
        `🔴 [${logPayload.timestamp}] ${logPayload.name}${
          logPayload.errorId ? ` (${logPayload.errorId})` : ""
        }: ${logPayload.message}`,
        logPayload.context || ""
      );
      
      if (logPayload.stack) {
        // Log trace resumido em dev para não poluir o terminal, mas manter utilidade
        console.error(`🔍 Stack Trace: ${logPayload.stack.split("\n")[1]}`);
      }
    } else {
      // Em Produção: Log estruturado (JSON) para ingestão por CloudWatch/Datadog/BetterStack
      // Omitimos stack traces muito longos dependendo da política de custos/segurança
      console.log(JSON.stringify(logPayload));
    }
  },

  /**
   * Registra informações operacionais
   */
  info: (message: string, context?: Record<string, unknown>) => {
    const payload = {
      level: "INFO",
      timestamp: new Date().toISOString(),
      message,
      context,
      env: process.env.NODE_ENV || "development",
    };

    if (process.env.NODE_ENV === "development") {
      console.log(`🔵 [${payload.timestamp}] INFO: ${message}`, context || "");
    } else {
      console.log(JSON.stringify(payload));
    }
  },
};




>










===== FILE:  src/lib/errors/index.ts    =====
<conteúdo completo do arquivo

// src/lib/errors/index.ts
import crypto from "crypto";

/**
 * Contrato base de construção de erros alinhado com ErrorDictionary
 */
export interface BaseErrorParams {
  name: string;
  title?: string; // Adicionado para consistência com o dicionário
  message: string;
  action?: string;
  statusCode?: number;
  errorId?: string;
  requestId?: string;
  context?: unknown;
  stack?: string;
  cause?: unknown;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;
}

export class BaseError extends Error {
  public readonly title?: string;
  public readonly statusCode: number;
  public readonly errorId: string;
  public readonly requestId?: string;
  public readonly action?: string;
  public readonly context?: unknown;
  public readonly errorLocationCode?: string;
  public readonly key?: string;
  public readonly type?: string;
  public readonly databaseErrorCode?: string;

  constructor(params: BaseErrorParams) {
    super(params.message);

    this.name = params.name;
    this.title = params.title;
    this.statusCode = params.statusCode ?? 500;
    this.errorId = params.errorId ?? crypto.randomUUID();
    this.requestId = params.requestId;
    this.action = params.action;
    this.context = params.context;
    this.errorLocationCode = params.errorLocationCode;
    this.key = params.key;
    this.type = params.type;
    this.databaseErrorCode = params.databaseErrorCode;

    // TypeScript 6.0+ captura de stack trace otimizada
    if (params.stack) {
      this.stack = params.stack;
    }

    if (params.cause) {
      this.cause = params.cause;
    }
  }
}

/* =======================
   Erros específicos
   Nota: As mensagens default aqui servem apenas como "fallback"
   técnico caso o dicionário i18n falhe.
======================= */

export class InternalServerError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "InternalServerError",
      message: params.message ?? "Internal Server Error",
      statusCode: 500,
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "NotFoundError",
      message: params.message ?? "Resource Not Found",
      statusCode: 404,
    });
  }
}

export class ValidationError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "ValidationError",
      message: params.message ?? "Validation Failed",
      statusCode: 400,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "UnauthorizedError",
      message: params.message ?? "Unauthorized",
      statusCode: 401,
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "ForbiddenError",
      message: params.message ?? "Forbidden",
      statusCode: 403,
    });
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "TooManyRequestsError",
      message: params.message ?? "Too Many Requests",
      statusCode: 429,
    });
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "UnprocessableEntityError",
      message: params.message ?? "Unprocessable Entity",
      statusCode: 422,
    });
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "MethodNotAllowedError",
      message: params.message ?? "Method Not Allowed",
      statusCode: 405,
    });
  }
}



>






===== FILE:    src/lib/http/handleApiError.ts =====
<conteúdo completo do arquivo

// src/lib/http/handleApiError.ts
import { NextRequest, NextResponse } from "next/server";
import { BaseError, InternalServerError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { ErrorDictionary } from "@/types/error-dictionary";

// Importação dinâmica dos dicionários (Pode ser ajustado conforme sua estratégia de build)
import ptBR from "@/dictionaries/errors/pt-BR.json";
import enUS from "@/dictionaries/errors/en-US.json";
import esES from "@/dictionaries/errors/es-ES.json";
import esAR from "@/dictionaries/errors/es-AR.json";
import esMX from "@/dictionaries/errors/es-MX.json";

const dictionaries: Record<string, { errors: ErrorDictionary }> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
  "es-AR": esAR,
  "es-MX": esMX,
};

/**
 * Handle API Error
 * Totalmente consistente com o dicionário de erros e suporte i18n.
 */
export function handleApiError(error: unknown, request?: NextRequest) {
  // 1. Normalização do Erro
  const err =
    error instanceof BaseError
      ? error
      : new InternalServerError({
          cause: error,
          message: error instanceof Error ? error.message : undefined,
        });

  // 2. Registro do Log (Backend retém o erro técnico completo)
  logger.error(err);

  // 3. Identificação do Idioma (i18n)
  // Tenta pegar do header Accept-Language, fallback para pt-BR
  const acceptLanguage = request?.headers.get("accept-language")?.split(",")[0] || "pt-BR";
  const locale = dictionaries[acceptLanguage] ? acceptLanguage : "pt-BR";
  const dictionary = dictionaries[locale].errors;

  // 4. Mapeamento da tradução baseada na classe do erro
  // Se o erro for "NotFoundError", buscamos dictionary.NotFoundError
  const errorKey = err.name as keyof ErrorDictionary;
  const translation = dictionary[errorKey] || dictionary.InternalServerError;

  // 5. Construção da Resposta para o Cliente
  return NextResponse.json(
    {
      error: {
        name: err.name,
        title: translation.title, // Consistente com o dicionário
        message: err.message || translation.message, // Prioriza mensagem específica ou a do dicionário
        action: translation.action, // Instrução amigável do dicionário
        error_id: err.errorId,
        request_id: err.requestId,
        // Segurança: Contexto apenas para erros de validação (ex: campos faltando)
        context: err.name === "ValidationError" ? err.context : undefined,
      },
    },
    { status: err.statusCode }
  );
}


>










===== FILE:  src/lib/seo/breadcrumbs.ts   =====
<conteúdo completo do arquivo


import type { Dictionary, Locale } from '@/types/dictionary';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs semânticos e SEO-friendly.
 * Alinhado com a estrutura multi-regional (pt-BR, en-US, es-ES, es-AR, es-MX).
 */
export function generateBreadcrumbs(
  pathname: string,
  locale: Locale,
  dict: Dictionary,
  baseUrl: string
): BreadcrumbItem[] {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  
  // Remove o locale da URL para processar os segmentos de página
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((seg) => seg !== locale);

  // O "Home" agora usa breadcrumb_root conforme seu labels.json
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: dict.labels?.breadcrumb_root || dict.labels?.home || 'Home',
      item: `${normalizedBaseUrl}/${locale}`,
    },
  ];

  let currentPath = `${normalizedBaseUrl}/${locale}`;

  segments.forEach((segment) => {
    const decodedSegment = decodeURIComponent(segment);
    currentPath += `/${segment}`;

    // Lógica de busca de Label:
    // 1. Procura na seção SEO do dicionário (ex: seo.pages.projects.title)
    // 2. Procura em labels genéricos
    // 3. Fallback: Formata o slug (ex: "meus-projetos" -> "Meus Projetos")
    const label = 
      dict.seo?.pages?.[decodedSegment as keyof typeof dict.seo.pages]?.title ||
      (dict.labels as any)?.[decodedSegment] ||
      decodedSegment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

    breadcrumbs.push({
      name: label,
      item: currentPath,
    });
  });

  return breadcrumbs;
}


>








===== FILE:  src/actions/user-actions.ts     =====
<conteúdo completo do arquivo

// src/actions/user-actions.ts
'use server';

import { logger } from "@/lib/logger";
import { ValidationError, InternalServerError } from "@/lib/errors";

/**
 * ACTION: updateProfileAction
 * Descrição: Atualiza os dados do perfil com validação rigorosa e log de observabilidade.
 * Alinhado com: Next.js 16 e TypeScript 5.9+
 */
export async function updateProfileAction(formData: FormData) {
  try {
    // Tratamento seguro do FormData para satisfazer o TypeScript
    const rawName = formData.get("name");
    const name = typeof rawName === 'string' ? rawName.trim() : "";

    // 1. Simulação de Validação
    // Agora o TS sabe que 'name' é string, permitindo o uso de .length
    if (!name || name.length < 3) {
      throw new ValidationError({
        message: "Nome muito curto", // Chave base para tradução
        context: { field: "name", value: name },
        errorLocationCode: "USER_ACTION_001"
      });
    }

    // 2. Lógica de Negócio (Exemplo)
    // No mundo real: await db.user.update({ data: { name } })
    
    return { success: true };

  } catch (error: any) {
    // 3. REGISTRO NO LOGGER (Ciclo de observabilidade para Engenharia de Dados)
    // O erro completo (stack trace + contexto) fica apenas no servidor por segurança.
    logger.error(error, { 
      action: "updateProfileAction",
      timestamp: new Date().toISOString() 
    });

    // 4. RETORNO PARA O CLIENTE (Normalização para o Dicionário de Erros)
    // Retornamos apenas o necessário para a UI buscar a tradução nos JSONs.
    
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          name: "ValidationError", // Deve bater exatamente com a chave no ErrorDictionary
          message: error.message,
          errorId: error.errorId,
          code: error.errorLocationCode
        }
      };
    }

    // Erro genérico/inesperado (Internal Server Error)
    const internalErr = new InternalServerError({ cause: error });
    return {
      success: false,
      error: {
        name: "InternalServerError", // Chave do dicionário para erro 500
        message: internalErr.message,
        errorId: internalErr.errorId
      }
    };
  }
}



>









===== FILE:   src/contexts/ScrollSpyContext.tsx =====
<conteúdo completo do arquivo


'use client'

/**
 * CONTEXT: ScrollSpy
 * -----------------------------------------------------------------------------
 * Gerencia o estado da seção ativa durante a navegação por scroll.
 * Essencial para o feedback visual da Navbar e sincronização de UI.
 * Integrado com o domínio de Navegação (NavSection).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type ActiveSection = string | null

interface ScrollSpyContextValue {
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
  resetActiveSection: () => void
}

const ScrollSpyContext = createContext<ScrollSpyContextValue | undefined>(
  undefined,
)

interface ScrollSpyProviderProps {
  readonly children: React.ReactNode
  readonly sectionIds: readonly string[] | undefined
}

export function ScrollSpyProvider({
  children,
  sectionIds,
}: ScrollSpyProviderProps): JSX.Element {
  const [activeSection, setActiveSectionState] =
    useState<ActiveSection>(null)

  const setActiveSection = useCallback(
    (section: ActiveSection) => {
      setActiveSectionState((prev) =>
        prev === section ? prev : section,
      )
    },
    [],
  )

  const resetActiveSection = useCallback(() => {
    setActiveSectionState(null)
  }, [])

  const value = useMemo<ScrollSpyContextValue>(
    () => ({
      activeSection,
      setActiveSection,
      resetActiveSection,
    }),
    [activeSection, setActiveSection, resetActiveSection],
  )

  return (
    <ScrollSpyContext.Provider value={value}>
      {children}
    </ScrollSpyContext.Provider>
  )
}

/**
 * Hook oficial para consumir o ScrollSpy
 */
export function useScrollSpy(): ScrollSpyContextValue {
  const context = useContext(ScrollSpyContext)

  if (!context) {
    throw new Error(
      'useScrollSpy must be used within a ScrollSpyProvider',
    )
  }

  return context
}


>











===== FILE:  src/dictionaries/pt-BR.json     =====
<conteúdo completo do arquivo

{
  "meta": {
    "version": "1.0.0",
    "locale": "pt-BR",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-ptbr-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Disponível para Projetos Críticos",
    "title": "Analista de Ciência de Dados",
    "subtitle": "Dados e Resiliência",
    "headline": "Especialista em transformar infraestruturas complexas em sistemas de alta disponibilidade e pipelines de dados escaláveis.",
    "ctaPrimary": "Ver Projetos"
  },
  "about": {
    "title": "Sobre Mim",
    "differentialTitle": "Engenharia de Dados com Foco em Missão Crítica",
    "description": "Analista de Ciência de Dados com base sólida em sistemas críticos bancários e foco em transformar dados em decisões, redução de custos e eficiência operacional.",
    "differentialContent": "Atuei por mais de 15 anos no Banco Bradesco em ambientes regulados de missão crítica. Atualmente direciono minha atuação para Ciência de Dados e IA, aplicando o rigor de sistemas críticos à criação de modelos preditivos.",
    "highlights": ["15+ anos em Bancos", "Especialista Cloud", "Data Science & IA"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Anos",
      "availabilityValue": "99.9%",
      "availabilityLabel": "Uptime",
      "automation": "Sistemas 100% Automatizados"
    }
  },
  "contact": {
    "title": "Vamos Conversar?",
    "subtitle": "Busco oportunidades em projetos de governança e modernização.",
    "cta": "Enviar Email",
    "emailLabel": "Copiar Email",
    "cvLabel": "Ver CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Experiência Profissional",
    "items": [
      {
        "company": "Consultor Autônomo / Transição",
        "period": "2008 - Atual",
        "role": "Especialista em Sistemas Críticos",
        "description": "Arquitetura e manutenção de pipelines de dados e infraestrutura resiliente. Foco em Ciência de Dados e automação inteligente."
      }
    ]
  },
  "articles": {
    "title": "Artigos Técnicos",
    "mediumProfile": "Ver perfil no Medium",
    "readMore": "Ler artigo completo",
    "publishedAt": "Publicado em",
    "bestOfMonth": "Destaque do Mês",
    "awardWinner": "Artigo Premiado",
    "items": [
      {
        "title": "A Era dos Dados em Sistemas Críticos",
        "description": "Como a governança de dados transforma sistemas legados em ativos estratégicos.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Projetos e Soluções",
    "featuredLabel": "Destaque Técnico",
    "firstLabel": "Desafio e Arquitetura",
    "impactLabel": "Impacto e Resultado",
    "viewProject": "Repositório GitHub",
    "viewDemo": "Visualizar Demo",
    "viewAll": "Ver Todos",
    "categories": {
      "dataScience": "Ciência de Dados",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI & Análise",
      "excel": "Excel",
      "database": "Banco de Dados",
      "dev": "Desenvolvimento (Python/C#/Java)",
      "security": "Segurança"
    }
  },
  "common": {
    "navigation": "Navegação",
    "role": "Analista de Ciência de Dados | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. Todos os direitos reservados.",
    "rights": "Todos os direitos reservados",
    "builtWith": "Desenvolvido com Next.js 16 & TypeScript",
    "loading": "Carregando...",
    "error": "Algo deu errado.",
    "socialLinks": "Abrir perfil de {platform}",
    "languageSwitcher": "Alterar idioma",
    "errorBoundary": {
      "title": "Ops! Erro inesperado.",
      "description": "Entre em contato se o problema persistir.",
      "actions": { "retry": "Tentar novamente", "home": "Início" }
    },
    "notFound": {
      "title": "Página não encontrada",
      "description": "O link pode estar quebrado.",
      "button": "Voltar"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Abrir", "close": "Fechar", "aria": { "open": "Abrir menu", "close": "Fechar menu" } }
  },
  "intl": {
    "locale": "pt-BR",
    "fallbackLocale": "pt",
    "currency": "BRL",
    "timezone": "America/Sao_Paulo",
    "unitDisplay": "short",
    "numberFormat": "pt-BR"
  },
  "states": {
    "loading": "Carregando...",
    "empty": "Sem dados.",
    "error": "Erro ao carregar.",
    "emptyProjects": { "title": "Nenhum projeto", "description": "Em breve.", "cta": "Voltar" },
    "emptyExperience": "Sem registros.",
    "errorArticles": "Erro nos artigos."
  },
  "cookie": {
    "title": "Cookies",
    "description": "Melhoramos sua experiência.",
    "necessary": "Necessários",
    "alwaysActive": "Ativo",
    "analytics": "Analíticos",
    "acceptAll": "Aceitar",
    "savePreferences": "Salvar"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Ciência de Dados & Sistemas Críticos",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Início", "description": "Portfólio de Sérgio Santos" },
      "projects": { "title": "Projetos", "description": "Soluções de dados" },
      "articles": { "title": "Artigos", "description": "Conteúdo técnico" }
    }
  },
  "metrics": {
    "availability": "99,5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
}


>













===== FILE:  src/dictionaries/en-US.json   =====
<conteúdo completo do arquivo



{
  "meta": {
    "version": "1.0.0",
    "locale": "en-US",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-enus-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Available for Mission-Critical Projects",
    "title": "Data Science Analyst",
    "subtitle": "Data & Resilience",
    "headline": "Specialist in transforming complex infrastructures into high-availability systems and scalable data pipelines.",
    "ctaPrimary": "View Projects"
  },
  "about": {
    "title": "About Me",
    "differentialTitle": "Data Engineering with a Mission-Critical Focus",
    "description": "Data Science Analyst with a solid background in critical banking systems, focusing on transforming data into decisions, cost reduction, and operational efficiency.",
    "differentialContent": "I served for over 15 years at Banco Bradesco in regulated mission-critical environments. Currently, I focus my work on Data Science and AI, applying the rigor of critical systems to the creation of predictive models.",
    "highlights": ["15+ Years in Banking", "Cloud Specialist", "Data Science & AI"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Years",
      "availabilityValue": "99.9%",
      "availabilityLabel": "Uptime",
      "automation": "100% Automated Systems"
    }
  },
  "contact": {
    "title": "Let's Talk?",
    "subtitle": "Seeking opportunities in governance and modernization projects.",
    "cta": "Send Email",
    "emailLabel": "Copy Email",
    "cvLabel": "View CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Professional Experience",
    "items": [
      {
        "company": "Freelance Consultant / Transition",
        "period": "2008 - Present",
        "role": "Critical Systems Specialist",
        "description": "Architecture and maintenance of resilient data pipelines and infrastructure. Focus on Data Science and intelligent automation."
      }
    ]
  },
  "articles": {
    "title": "Technical Articles",
    "mediumProfile": "View Medium Profile",
    "readMore": "Read full article",
    "publishedAt": "Published on",
    "bestOfMonth": "Highlight of the Month",
    "awardWinner": "Award-Winning Article",
    "items": [
      {
        "title": "The Era of Data in Critical Systems",
        "description": "How data governance transforms legacy systems into strategic assets.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Projects and Solutions",
    "featuredLabel": "Technical Highlight",
    "firstLabel": "Challenge & Architecture",
    "impactLabel": "Impact & Results",
    "viewProject": "GitHub Repository",
    "viewDemo": "View Demo",
    "viewAll": "View All",
    "categories": {
      "dataScience": "Data Science",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI & Analysis",
      "excel": "Excel",
      "database": "Database",
      "dev": "Development (Python/C#/Java)",
      "security": "Security"
    }
  },
  "common": {
    "navigation": "Navigation",
    "role": "Data Science Analyst | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. All rights reserved.",
    "rights": "All rights reserved",
    "builtWith": "Built with Next.js 16 & TypeScript",
    "loading": "Loading...",
    "error": "Something went wrong.",
    "socialLinks": "Open {platform} profile",
    "languageSwitcher": "Change language",
    "errorBoundary": {
      "title": "Oops! Unexpected error.",
      "description": "Please contact me if the problem persists.",
      "actions": { "retry": "Try again", "home": "Home" }
    },
    "notFound": {
      "title": "Page not found",
      "description": "The link may be broken.",
      "button": "Go Back"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Open", "close": "Close", "aria": { "open": "Open menu", "close": "Close menu" } }
  },
  "intl": {
    "locale": "en-US",
    "fallbackLocale": "en",
    "currency": "USD",
    "timezone": "America/New_York",
    "unitDisplay": "short",
    "numberFormat": "en-US"
  },
  "states": {
    "loading": "Loading...",
    "empty": "No data.",
    "error": "Error loading.",
    "emptyProjects": { "title": "No projects", "description": "Coming soon.", "cta": "Go Back" },
    "emptyExperience": "No records found.",
    "errorArticles": "Error loading articles."
  },
  "cookie": {
    "title": "Cookies",
    "description": "We improve your experience.",
    "necessary": "Necessary",
    "alwaysActive": "Always Active",
    "analytics": "Analytics",
    "acceptAll": "Accept All",
    "savePreferences": "Save"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Data Science & Critical Systems",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Home", "description": "Portfolio of Sérgio Santos" },
      "projects": { "title": "Projects", "description": "Data solutions" },
      "articles": { "title": "Articles", "description": "Technical content" }
    }
  },
  "metrics": {
    "availability": "99.5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
}


>








===== FILE: src/dictionaries/es-ES.json =====
<conteúdo completo do arquivo

{
  "meta": {
    "version": "1.0.0",
    "locale": "es-ES",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-eses-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Disponible para Proyectos Críticos",
    "title": "Analista de Ciencia de Datos",
    "subtitle": "Datos y Resiliencia",
    "headline": "Especialista en transformar infraestructuras complejas en sistemas de alta disponibilidad y pipelines de datos escalables.",
    "ctaPrimary": "Ver Proyectos"
  },
  "about": {
    "title": "Sobre Mí",
    "differentialTitle": "Ingeniería de Datos con Enfoque en Misión Crítica",
    "description": "Analista de Ciencia de Datos con una base sólida en sistemas críticos bancarios y enfoque en transformar datos en decisiones, reducción de costes y eficiencia operativa.",
    "differentialContent": "Trabajé durante más de 15 años en Banco Bradesco en entornos regulados de misión crítica. Actualmente dirijo mi actividad hacia la Ciencia de Datos e IA, aplicando el rigor de los sistemas críticos a la creación de modelos predictivos.",
    "highlights": ["15+ años en Banca", "Especialista Cloud", "Data Science e IA"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Años",
      "availabilityValue": "99,9%",
      "availabilityLabel": "Uptime",
      "automation": "Sistemas 100% Automatizados"
    }
  },
  "contact": {
    "title": "¿Hablamos?",
    "subtitle": "Busco oportunidades en proyectos de gobernanza y modernización.",
    "cta": "Enviar Correo",
    "emailLabel": "Copiar Correo",
    "cvLabel": "Ver CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Experiencia Profesional",
    "items": [
      {
        "company": "Consultor Autónomo / Transición",
        "period": "2008 - Actualidad",
        "role": "Especialista en Sistemas Críticos",
        "description": "Arquitectura y mantenimiento de pipelines de datos e infraestructura resiliente. Enfoque en Ciencia de Datos y automatización inteligente."
      }
    ]
  },
  "articles": {
    "title": "Artículos Técnicos",
    "mediumProfile": "Ver perfil en Medium",
    "readMore": "Leer artículo completo",
    "publishedAt": "Publicado el",
    "bestOfMonth": "Destacado del Mes",
    "awardWinner": "Artículo Premiado",
    "items": [
      {
        "title": "La Era de los Datos en Sistemas Críticos",
        "description": "Cómo el gobierno de datos transforma sistemas legados en activos estratégicos.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Proyectos y Soluciones",
    "featuredLabel": "Destacado Técnico",
    "firstLabel": "Desafío y Arquitectura",
    "impactLabel": "Impacto y Resultado",
    "viewProject": "Repositorio GitHub",
    "viewDemo": "Visualizar Demo",
    "viewAll": "Ver Todos",
    "categories": {
      "dataScience": "Ciencia de Datos",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI y Análisis",
      "excel": "Excel",
      "database": "Base de Datos",
      "dev": "Desarrollo (Python/C#/Java)",
      "security": "Seguridad"
    }
  },
  "common": {
    "navigation": "Navegación",
    "role": "Analista de Ciencia de Datos | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. Todos los derechos reservados.",
    "rights": "Todos los derechos reservados",
    "builtWith": "Desarrollado con Next.js 16 y TypeScript",
    "loading": "Cargando...",
    "error": "Algo ha salido mal.",
    "socialLinks": "Abrir perfil de {platform}",
    "languageSwitcher": "Cambiar idioma",
    "errorBoundary": {
      "title": "¡Ops! Error inesperado.",
      "description": "Contacte con nosotros si el problema persiste.",
      "actions": { "retry": "Reintentar", "home": "Inicio" }
    },
    "notFound": {
      "title": "Página no encontrada",
      "description": "Es posible que el enlace esté roto.",
      "button": "Volver"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Abrir", "close": "Cerrar", "aria": { "open": "Abrir menú", "close": "Cerrar menú" } }
  },
  "intl": {
    "locale": "es-ES",
    "fallbackLocale": "es",
    "currency": "EUR",
    "timezone": "Europe/Madrid",
    "unitDisplay": "short",
    "numberFormat": "es-ES"
  },
  "states": {
    "loading": "Cargando...",
    "empty": "Sin datos.",
    "error": "Error al cargar.",
    "emptyProjects": { "title": "Ningún proyecto", "description": "Próximamente.", "cta": "Volver" },
    "emptyExperience": "Sin registros.",
    "errorArticles": "Error en los artículos."
  },
  "cookie": {
    "title": "Cookies",
    "description": "Mejoramos tu experiencia.",
    "necessary": "Necesarias",
    "alwaysActive": "Activa",
    "analytics": "Analíticas",
    "acceptAll": "Aceptar",
    "savePreferences": "Guardar"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Ciencia de Datos y Sistemas Críticos",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Inicio", "description": "Portfolio de Sérgio Santos" },
      "projects": { "title": "Proyectos", "description": "Soluciones de datos" },
      "articles": { "title": "Artículos", "description": "Contenido técnico" }
    }
  },
  "metrics": {
    "availability": "99,5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
}


>






===== FILE: src/dictionaries/es-AR.json  =====
<conteúdo completo do arquivo

{
  "meta": {
    "version": "1.0.0",
    "locale": "es-AR",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-esar-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Disponible para Proyectos Críticos",
    "title": "Analista de Ciencia de Datos",
    "subtitle": "Datos y Resiliencia",
    "headline": "Especialista en transformar infraestructuras complejas en sistemas de alta disponibilidad y pipelines de datos escalables.",
    "ctaPrimary": "Ver Proyectos"
  },
  "about": {
    "title": "Sobre Mí",
    "differentialTitle": "Ingeniería de Datos con Foco en Misión Crítica",
    "description": "Analista de Ciencia de Datos con base sólida en sistemas críticos bancarios y foco en transformar datos en decisiones, reducción de costos y eficiencia operativa.",
    "differentialContent": "Laburé por más de 15 años en el Banco Bradesco en ambientes regulados de misión crítica. Actualmente direcciono mi actividad hacia la Ciencia de Datos e IA, aplicando el rigor de sistemas críticos a la creación de modelos predictivos.",
    "highlights": ["15+ años en Bancos", "Especialista Cloud", "Data Science e IA"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Años",
      "availabilityValue": "99,9%",
      "availabilityLabel": "Uptime",
      "automation": "Sistemas 100% Automatizados"
    }
  },
  "contact": {
    "title": "¿Charlamos?",
    "subtitle": "Busco oportunidades en proyectos de gobernanza y modernización.",
    "cta": "Enviar Email",
    "emailLabel": "Copiar Email",
    "cvLabel": "Ver CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Experiencia Profesional",
    "items": [
      {
        "company": "Consultor Autónomo / Transición",
        "period": "2008 - Actualidad",
        "role": "Especialista en Sistemas Críticos",
        "description": "Arquitectura y mantenimiento de pipelines de datos e infraestructura resiliente. Foco en Ciencia de Datos y automatización inteligente."
      }
    ]
  },
  "articles": {
    "title": "Artículos Técnicos",
    "mediumProfile": "Ver perfil en Medium",
    "readMore": "Leer artículo completo",
    "publishedAt": "Publicado el",
    "bestOfMonth": "Destacado del Mes",
    "awardWinner": "Artículo Premiado",
    "items": [
      {
        "title": "La Era de los Datos en Sistemas Críticos",
        "description": "Cómo el gobierno de datos transforma sistemas legados en activos estratégicos.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Proyectos y Soluciones",
    "featuredLabel": "Destacado Técnico",
    "firstLabel": "Desafío y Arquitectura",
    "impactLabel": "Impacto y Resultado",
    "viewProject": "Repositorio GitHub",
    "viewDemo": "Visualizar Demo",
    "viewAll": "Ver Todos",
    "categories": {
      "dataScience": "Ciencia de Datos",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI y Análisis",
      "excel": "Excel",
      "database": "Base de Datos",
      "dev": "Desarrollo (Python/C#/Java)",
      "security": "Seguridad"
    }
  },
  "common": {
    "navigation": "Navegación",
    "role": "Analista de Ciencia de Datos | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. Todos los derechos reservados.",
    "rights": "Todos los derechos reservados",
    "builtWith": "Desarrollado con Next.js 16 y TypeScript",
    "loading": "Cargando...",
    "error": "Algo salió mal.",
    "socialLinks": "Abrir perfil de {platform}",
    "languageSwitcher": "Cambiar idioma",
    "errorBoundary": {
      "title": "¡Upa! Error inesperado.",
      "description": "Ponete en contacto si el problema persiste.",
      "actions": { "retry": "Reintentar", "home": "Inicio" }
    },
    "notFound": {
      "title": "Página no encontrada",
      "description": "El link puede estar roto.",
      "button": "Volver"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Abrir", "close": "Cerrar", "aria": { "open": "Abrir menú", "close": "Cerrar menú" } }
  },
  "intl": {
    "locale": "es-AR",
    "fallbackLocale": "es",
    "currency": "ARS",
    "timezone": "America/Argentina/Buenos_Aires",
    "unitDisplay": "short",
    "numberFormat": "es-AR"
  },
  "states": {
    "loading": "Cargando...",
    "empty": "Sin datos.",
    "error": "Error al cargar.",
    "emptyProjects": { "title": "Ningún proyecto", "description": "Próximamente.", "cta": "Volver" },
    "emptyExperience": "Sin registros.",
    "errorArticles": "Error en los artículos."
  },
  "cookie": {
    "title": "Cookies",
    "description": "Mejoramos tu experiencia.",
    "necessary": "Necesarias",
    "alwaysActive": "Activo",
    "analytics": "Analíticas",
    "acceptAll": "Aceptar",
    "savePreferences": "Guardar"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Ciencia de Datos y Sistemas Críticos",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Inicio", "description": "Portfolio de Sérgio Santos" },
      "projects": { "title": "Proyectos", "description": "Soluciones de datos" },
      "articles": { "title": "Artículos", "description": "Contenido técnico" }
    }
  },
  "metrics": {
    "availability": "99,5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
}


>







===== FILE:  src/dictionaries/es-MX.json =====
<conteúdo completo do arquivo

{
  "meta": {
    "version": "1.0.0",
    "locale": "es-MX",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-esmx-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Disponible para Proyectos Críticos",
    "title": "Analista de Ciencia de Datos",
    "subtitle": "Datos y Resiliencia",
    "headline": "Especialista en transformar infraestructuras complejas en sistemas de alta disponibilidad y pipelines de datos escalables.",
    "ctaPrimary": "Ver Proyectos"
  },
  "about": {
    "title": "Sobre Mí",
    "differentialTitle": "Ingeniería de Datos con Enfoque en Misión Crítica",
    "description": "Analista de Ciencia de Datos con una base sólida en sistemas críticos bancarios y enfoque en transformar datos en decisiones, reducción de costos y eficiencia operativa.",
    "differentialContent": "Colaboré por más de 15 años en Banco Bradesco en entornos regulados de misión crítica. Actualmente enfoco mi labor en Ciencia de Datos e IA, aplicando el rigor de sistemas críticos a la creación de modelos predictivos.",
    "highlights": ["15+ años en Bancos", "Especialista Cloud", "Data Science e IA"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Años",
      "availabilityValue": "99.9%",
      "availabilityLabel": "Uptime",
      "automation": "Sistemas 100% Automatizados"
    }
  },
  "contact": {
    "title": "¿Platicamos?",
    "subtitle": "Busco oportunidades en proyectos de gobernanza y modernización.",
    "cta": "Enviar Correo",
    "emailLabel": "Copiar Correo",
    "cvLabel": "Ver CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Experiencia Profesional",
    "items": [
      {
        "company": "Consultor Autónomo / Transición",
        "period": "2008 - Actualidad",
        "role": "Especialista en Sistemas Críticos",
        "description": "Arquitectura y mantenimiento de pipelines de datos e infraestructura resiliente. Enfoque en Ciencia de Datos y automatización inteligente."
      }
    ]
  },
  "articles": {
    "title": "Artículos Técnicos",
    "mediumProfile": "Ver perfil en Medium",
    "readMore": "Leer artículo completo",
    "publishedAt": "Publicado el",
    "bestOfMonth": "Destacado del Mes",
    "awardWinner": "Artículo Premiado",
    "items": [
      {
        "title": "La Era de los Datos en Sistemas Críticos",
        "description": "Cómo la gobernanza de datos transforma sistemas legados en activos estratégicos.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Proyectos y Soluciones",
    "featuredLabel": "Destacado Técnico",
    "firstLabel": "Desafío y Arquitectura",
    "impactLabel": "Impacto y Resultado",
    "viewProject": "Repositorio GitHub",
    "viewDemo": "Visualizar Demo",
    "viewAll": "Ver Todos",
    "categories": {
      "dataScience": "Ciencia de Datos",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI y Análisis",
      "excel": "Excel",
      "database": "Base de Datos",
      "dev": "Desarrollo (Python/C#/Java)",
      "security": "Seguridad"
    }
  },
  "common": {
    "navigation": "Navegación",
    "role": "Analista de Ciencia de Datos | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. Todos los derechos reservados.",
    "rights": "Todos los derechos reservados",
    "builtWith": "Desarrollado con Next.js 16 y TypeScript",
    "loading": "Cargando...",
    "error": "Algo salió mal.",
    "socialLinks": "Abrir perfil de {platform}",
    "languageSwitcher": "Cambiar idioma",
    "errorBoundary": {
      "title": "¡Ups! Error inesperado.",
      "description": "Ponte en contacto si el problema persiste.",
      "actions": { "retry": "Reintentar", "home": "Inicio" }
    },
    "notFound": {
      "title": "Página no encontrada",
      "description": "El enlace podría estar roto.",
      "button": "Volver"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Abrir", "close": "Cerrar", "aria": { "open": "Abrir menú", "close": "Cerrar menú" } }
  },
  "intl": {
    "locale": "es-MX",
    "fallbackLocale": "es",
    "currency": "MXN",
    "timezone": "America/Mexico_City",
    "unitDisplay": "short",
    "numberFormat": "es-MX"
  },
  "states": {
    "loading": "Cargando...",
    "empty": "Sin datos.",
    "error": "Error al cargar.",
    "emptyProjects": { "title": "Ningún proyecto", "description": "Próximamente.", "cta": "Volver" },
    "emptyExperience": "Sin registros.",
    "errorArticles": "Error en los artículos."
  },
  "cookie": {
    "title": "Cookies",
    "description": "Mejoramos tu experiencia.",
    "necessary": "Necesarias",
    "alwaysActive": "Activo",
    "analytics": "Analíticos",
    "acceptAll": "Aceptar",
    "savePreferences": "Guardar"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Ciencia de Datos y Sistemas Críticos",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Inicio", "description": "Portafolio de Sérgio Santos" },
      "projects": { "title": "Proyectos", "description": "Soluciones de datos" },
      "articles": { "title": "Artículos", "description": "Contenido técnico" }
    }
  },
  "metrics": {
    "availability": "99,5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
}


>













===== FILE: src/dictionaries/index.ts     =====
<conteúdo completo do arquivo


// src/dictionaries/index.ts
import type { Dictionary, Locale } from "@/types/dictionary";

const dictionaries = {
  "pt-BR": () => import("./pt-BR.json").then((m) => m.default as Dictionary),
  "en-US": () => import("./en-US.json").then((m) => m.default as Dictionary),
  "es-ES": () => import("./es-ES.json").then((m) => m.default as Dictionary),
  "es-AR": () => import("./es-AR.json").then((m) => m.default as Dictionary),
  "es-MX": () => import("./es-MX.json").then((m) => m.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const loadDictionary = dictionaries[locale] ?? dictionaries["pt-BR"];
  return loadDictionary();
};



>















===== FILE: src/dictionaries/validator.ts  =====
<conteúdo completo do arquivo


// src/dictionaries/validator.ts

import { Dictionary } from "@/types/dictionary";

export function validateDictionary(
  dictionary: Dictionary
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // --- Função Auxiliar: Validação de SEO ---
  const validateSeo = (seo: any) => {
    if (!seo) {
      errors.push("Missing seo section");
      return;
    }
    if (!seo.siteName) errors.push("Missing seo.siteName");
    if (!Array.isArray(seo.keywords)) errors.push("seo.keywords must be an array");
    
    const requiredPages = ['home', 'projects', 'articles'];
    requiredPages.forEach(page => {
      if (!seo.pages?.[page]?.title) errors.push(`Missing seo.pages.${page}.title`);
      if (!seo.pages?.[page]?.description) errors.push(`Missing seo.pages.${page}.description`);
    });
  };

  // --- 1. Validação de Meta e Internacionalização ---
  if (!dictionary?.meta?.locale) {
    errors.push("Missing meta.locale");
  }
  if (!dictionary?.intl?.currency) {
    errors.push("Missing intl section or currency");
  }

  // --- 2. Validação de SEO ---
  validateSeo(dictionary.seo);

  // --- 3. Validação da Seção Hero ---
  if (!dictionary?.hero) {
    errors.push("Missing hero section");
  } else {
    if (!dictionary.hero.title) errors.push("Missing hero.title");
    if (!dictionary.hero.ctaPrimary) errors.push("Missing hero.ctaPrimary");
  }

  // --- 4. Validação de Experiência Profissional ---
  if (!dictionary?.experience) {
    errors.push("Missing experience section");
  } else {
    if (!dictionary.experience.title) errors.push("Missing experience.title");
    if (!Array.isArray(dictionary.experience.items) || dictionary.experience.items.length === 0) {
      errors.push("experience.items must be a non-empty array");
    } else {
      dictionary.experience.items.forEach((item, index) => {
        if (!item.company) errors.push(`Missing experience.items[${index}].company`);
        if (!item.role) errors.push(`Missing experience.items[${index}].role`);
      });
    }
  }

  // --- 5. Validação de Artigos ---
  if (!dictionary?.articles) {
    errors.push("Missing articles section");
  } else {
    const { articles } = dictionary;
    if (!articles.title) errors.push("Missing articles.title");
    if (!Array.isArray(articles.items)) {
      errors.push("articles.items must be an array");
    } else {
      articles.items.forEach((article, index) => {
        if (!article.title) errors.push(`Missing articles.items[${index}].title`);
        if (!article.link) errors.push(`Missing articles.items[${index}].link`);
        if (typeof article.isAward !== 'boolean') {
          errors.push(`articles.items[${index}].isAward must be a boolean`);
        }
      });
    }
  }

  // --- 6. Validação de Projetos e Categorias ---
  if (!dictionary?.projects?.categories) {
    errors.push("Missing projects.categories section");
  }

  // --- 7. Validação de Contato e Erros ---
  if (!dictionary?.contact?.cta) errors.push("Missing contact.cta");
  
  if (!dictionary?.common?.errorBoundary?.actions?.retry) {
    errors.push("Missing common.errorBoundary.actions.retry");
  }

  // --- 8. Validação de Estados de UI (Empty States) ---
  if (!dictionary?.states?.emptyProjects?.title) {
    errors.push("Missing states.emptyProjects.title");
  }

  // --- 9. Validação de Métricas (Normalização) ---
  if (dictionary?.metrics?.availabilityNormalized) {
    const { value, unit } = dictionary.metrics.availabilityNormalized;
    if (typeof value !== "number") {
      errors.push("metrics.availabilityNormalized.value must be a number");
    }
    if (unit !== "%") {
      errors.push("metrics.availabilityNormalized.unit must be '%'");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}


>













===== FILE: src/dictionaries/fallback.ts  =====
<conteúdo completo do arquivo

// src/dictionaries/fallback.ts

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json"; 
import esMX from "./es-MX.json";

import type { Dictionary, Locale } from "@/types/dictionary";

// Usando o tipo Locale para garantir que as chaves principais estejam corretas
const DICTIONARIES: Record<string, any> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
  "es-AR": esAR,
  "es-MX": esMX
};

const FALLBACK_CHAIN: Record<string, string[]> = {
  "es-AR": ["es-AR", "es-ES", "pt-BR"],
  "es-MX": ["es-MX", "es-ES", "pt-BR"],
  "es-ES": ["es-ES", "pt-BR"],
  "en-US": ["en-US", "pt-BR"],
  "pt-BR": ["pt-BR"]
};

export function getDictionary(locale: string): Dictionary {
  const chain = FALLBACK_CHAIN[locale] || ["pt-BR"];

  for (const lang of chain) {
    if (DICTIONARIES[lang]) {
      return DICTIONARIES[lang] as Dictionary;
    }
  }

  // Fallback definitivo caso nada na corrente seja encontrado
  return ptBR as Dictionary;
}


>







===== FILE:  src/dictionaries/labels.json  =====
<conteúdo completo do arquivo

{
  "pt-BR": {
    "home": "Início",
    "back": "Voltar",
    "retry": "Tentar novamente",
    "close": "Fechar",
    "open": "Abrir",
    "breadcrumb_root": "Início"
  },
  "en-US": {
    "home": "Home",
    "back": "Back",
    "retry": "Try again",
    "close": "Close",
    "open": "Open",
    "breadcrumb_root": "Home"
  },
  "es-ES": {
    "home": "Inicio",
    "back": "Volver",
    "retry": "Intentar de nuevo",
    "close": "Cerrar",
    "open": "Abrir",
    "breadcrumb_root": "Inicio"
  },
  "es-AR": {
    "home": "Inicio",
    "back": "Volver",
    "retry": "Intentar nuevamente",
    "close": "Cerrar",
    "open": "Abrir",
    "breadcrumb_root": "Inicio"
  },
  "es-MX": {
    "home": "Inicio",
    "back": "Volver",
    "retry": "Intentar de nuevo",
    "close": "Cerrar",
    "open": "Abrir",
    "breadcrumb_root": "Inicio"
  }
}


>










===== FILE:   src/dictionaries/validateAllLocales.ts   =====
<conteúdo completo do arquivo


// src/dictionaries/validateAllLocales.ts

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json";
import esMX from "./es-MX.json";

import { validateCrossLocale } from "./validateCrossLocale";
import { Dictionary } from "@/types/dictionary";

/**
 * Valida a consistência estrutural entre todos os dicionários.
 * Garante que chaves presentes no idioma principal (pt-BR) existam nos outros.
 */
export function validateAllLocales() {
  // Cast para Dictionary para garantir que estamos validando contra o contrato correto
  const base = ptBR as Dictionary;
  
  const targets = [
    { data: enUS as Dictionary, code: "en-US" },
    { data: esES as Dictionary, code: "es-ES" },
    { data: esAR as Dictionary, code: "es-AR" },
    { data: esMX as Dictionary, code: "es-MX" }
  ];

  const errors: string[] = [];

  // Executa a validação cruzada para cada idioma contra o pt-BR
  targets.forEach(target => {
    errors.push(...validateCrossLocale(base, target.data, "pt-BR", target.code));
  });

  if (errors.length > 0) {
    console.error("\n❌ i18n validation failed (Alignment Errors):\n");
    errors.forEach(err => console.error(`  - ${err}`));
    
    // Interrompe o build ou execução se houver erro de alinhamento
    if (process.env.NODE_ENV !== "development") {
      process.exit(1);
    }
  } else {
    console.log("✅ i18n dictionaries are fully aligned (5 locales).");
  }
}


>






===== FILE:   src/dictionaries/validateCrossLocale.ts   =====
<conteúdo completo do arquivo


// src/dictionaries/validateCrossLocale.ts

import { Dictionary } from "@/types/dictionary";

/**
 * Função recursiva para extrair todos os caminhos (dots) de um dicionário.
 * Ex: "common.errorBoundary.actions.retry"
 */
function getAllPaths(obj: any, prefix = ""): string[] {
  if (!obj || typeof obj !== "object") return [];

  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    // Continua a recursão se for um objeto, mas ignora arrays (como intl.contract.requiredFields)
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return getAllPaths(value, path);
    }

    return [path];
  });
}

/**
 * Compara o dicionário base (pt-BR) com um dicionário alvo para encontrar 
 * chaves faltantes ou chaves extras não traduzidas.
 */
export function validateCrossLocale(
  base: Dictionary,
  target: Dictionary,
  baseName: string,
  targetName: string
): string[] {
  const basePaths = new Set(getAllPaths(base));
  const targetPaths = new Set(getAllPaths(target));

  const missingInTarget = [...basePaths].filter(p => !targetPaths.has(p));
  const extraInTarget = [...targetPaths].filter(p => !basePaths.has(p));

  const errors: string[] = [];

  if (missingInTarget.length > 0) {
    errors.push(
      `[${targetName}] Faltando chaves presentes em ${baseName}:\n    ${missingInTarget.join("\n    ")}`
    );
  }

  if (extraInTarget.length > 0) {
    errors.push(
      `[${targetName}] Chaves extras que não existem em ${baseName}:\n    ${extraInTarget.join("\n    ")}`
    );
  }

  return errors;
}


>







===== FILE:  src/dictionaries/errors/pt-BR.json  =====
<conteúdo completo do arquivo


"errors": {
  "InternalServerError": {
    "title": "Erro Interno",
    "message": "Um erro inesperado aconteceu em nossos servidores.",
    "action": "Informe o ID do erro ao suporte técnico."
  },
  "NotFoundError": {
    "title": "Não Encontrado",
    "message": "O recurso que você procura não existe ou foi movido.",
    "action": "Verifique a URL ou retorne à página inicial."
  },
  "ValidationError": {
    "title": "Erro de Validação",
    "message": "Os dados enviados são inválidos ou estão incompletos.",
    "action": "Revise os campos destacados e tente novamente."
  },
  "UnauthorizedError": {
    "title": "Não Autenticado",
    "message": "Sua sessão expirou ou você não está logado.",
    "action": "Por favor, faça login para acessar esta área."
  },
  "ForbiddenError": {
    "title": "Acesso Negado",
    "message": "Você não tem permissão para realizar esta ação.",
    "action": "Contate o administrador se acreditar que isso é um erro."
  },
  "TooManyRequestsError": {
    "title": "Muitas Requisições",
    "message": "Você atingiu o limite de tentativas temporário.",
    "action": "Aguarde alguns minutos antes de tentar novamente."
  },
  "UnprocessableEntityError": {
    "title": "Operação Inválida",
    "message": "Não foi possível processar as instruções enviadas.",
    "action": "Verifique a lógica dos dados e tente novamente."
  },
  "MethodNotAllowedError": {
    "title": "Método Não Permitido",
    "message": "A requisição HTTP utilizada não é suportada.",
    "action": "Utilize um método válido (GET, POST, etc)."
  }
}


>






===== FILE:  src/dictionaries/errors/es-ES.json     =====
<conteúdo completo do arquivo

"errors": {
  "InternalServerError": {
    "title": "Error Interno",
    "message": "Ha ocurrido un error inesperado en nuestros servidores.",
    "action": "Facilite el ID del error al soporte técnico."
  },
  "NotFoundError": {
    "title": "No Encontrado",
    "message": "El recurso que busca no existe o ha sido movido.",
    "action": "Compruebe la URL o vuelva a la página de inicio."
  },
  "ValidationError": {
    "title": "Error de Validación",
    "message": "Los datos enviados son inválidos o están incompletos.",
    "action": "Revise los campos marcados e inténtelo de nuevo."
  },
  "UnauthorizedError": {
    "title": "No Autenticado",
    "message": "Su sesión ha caducado o no ha iniciado sesión.",
    "action": "Por favor, inicie sesión para acceder a esta área."
  },
  "ForbiddenError": {
    "title": "Acceso Denegado",
    "message": "No tiene permiso para realizar esta acción.",
    "action": "Contacte con el administrador si cree que es un error."
  },
  "TooManyRequestsError": {
    "title": "Demasiadas Peticiones",
    "message": "Ha alcanzado el límite temporal de peticiones.",
    "action": "Espere unos minutos antes de intentarlo de nuevo."
  },
  "UnprocessableEntityError": {
    "title": "Operación Inválida",
    "message": "No se han podido procesar las instrucciones enviadas.",
    "action": "Verifique la lógica de los datos y reintente."
  },
  "MethodNotAllowedError": {
    "title": "Método No Permitido",
    "message": "El método HTTP utilizado no está permitido.",
    "action": "Utilice un método válido (GET, POST, etc)."
  }
}



>










===== FILE: src/dictionaries/errors/en-US.json  =====
<conteúdo completo do arquivo


"errors": {
  "InternalServerError": {
    "title": "Internal Error",
    "message": "An unexpected error occurred on our servers.",
    "action": "Provide the error ID to technical support."
  },
  "NotFoundError": {
    "title": "Not Found",
    "message": "The resource you are looking for doesn't exist.",
    "action": "Check the URL or return to the home page."
  },
  "ValidationError": {
    "title": "Validation Error",
    "message": "The provided data is invalid or incomplete.",
    "action": "Review the highlighted fields and try again."
  },
  "UnauthorizedError": {
    "title": "Unauthorized",
    "message": "Your session has expired or you are not logged in.",
    "action": "Please log in to access this area."
  },
  "ForbiddenError": {
    "title": "Access Denied",
    "message": "You do not have permission to perform this action.",
    "action": "Contact the admin if you believe this is an error."
  },
  "TooManyRequestsError": {
    "title": "Too Many Requests",
    "message": "You have reached the temporary request limit.",
    "action": "Wait a few minutes before trying again."
  },
  "UnprocessableEntityError": {
    "title": "Invalid Operation",
    "message": "Unable to process the submitted instructions.",
    "action": "Verify the data logic and try again."
  },
  "MethodNotAllowedError": {
    "title": "Method Not Allowed",
    "message": "The HTTP method used is not supported.",
    "action": "Use a valid method (GET, POST, etc)."
  }
}


>






===== FILE:   src/dictionaries/errors/es-AR.json    =====
<conteúdo completo do arquivo


"errors": {
  "InternalServerError": {
    "title": "Error Interno",
    "message": "Hubo un error inesperado en nuestros servidores.",
    "action": "Pasale el ID del error al soporte técnico."
  },
  "NotFoundError": {
    "title": "No Encontrado",
    "message": "El recurso que buscás no existe o fue movido.",
    "action": "Revisá la URL o volvé a la página de inicio."
  },
  "ValidationError": {
    "title": "Error de Validación",
    "message": "Los datos enviados no son válidos o están incompletos.",
    "action": "Revisá los campos marcados e intentá de nuevo."
  },
  "UnauthorizedError": {
    "title": "No Autenticado",
    "message": "Tu sesión expiró o no estás logueado.",
    "action": "Por favor, iniciá sesión para entrar acá."
  },
  "ForbiddenError": {
    "title": "Acceso Denegado",
    "message": "No tenés permiso para hacer esto.",
    "action": "Ponete en contacto con el admin si es un error."
  },
  "TooManyRequestsError": {
    "title": "Muchas Peticiones",
    "message": "Llegaste al límite temporal de peticiones.",
    "action": "Esperá unos minutos antes de intentar otra vez."
  },
  "UnprocessableEntityError": {
    "title": "Operación Inválida",
    "message": "No pudimos procesar las instrucciones enviadas.",
    "action": "Chequeá la lógica de los datos y reintentá."
  },
  "MethodNotAllowedError": {
    "title": "Método No Permitido",
    "message": "El método HTTP no está soportado.",
    "action": "Usá un método válido (GET, POST, etc)."
  }
}


>








===== FILE:   src/dictionaries/errors/es-MX.json =====
<conteúdo completo do arquivo


"errors": {
  "InternalServerError": {
    "title": "Error Interno",
    "message": "Ocurrió un error inesperado en nuestros servidores.",
    "action": "Proporciona el ID del error al equipo de soporte."
  },
  "NotFoundError": {
    "title": "No Encontrado",
    "message": "El recurso que buscas no existe o se movió.",
    "action": "Checa la URL o regresa al inicio."
  },
  "ValidationError": {
    "title": "Error de Validación",
    "message": "Los datos enviados son inválidos o están incompletos.",
    "action": "Revisa los campos señalados e intenta de nuevo."
  },
  "UnauthorizedError": {
    "title": "No Autenticado",
    "message": "Tu sesión expiró o no has iniciado sesión.",
    "action": "Por favor, inicia sesión para acceder."
  },
  "ForbiddenError": {
    "title": "Acceso Denegado",
    "message": "No tienes permiso para realizar esta acción.",
    "action": "Contacta al administrador si crees que es un error."
  },
  "TooManyRequestsError": {
    "title": "Demasiadas Peticiones",
    "message": "Superaste el límite temporal de intentos.",
    "action": "Espera unos minutos antes de intentar de nuevo."
  },
  "UnprocessableEntityError": {
    "title": "Operación Inválida",
    "message": "No se pudieron procesar las instrucciones.",
    "action": "Verifica la lógica de los datos e intenta de nuevo."
  },
  "MethodNotAllowedError": {
    "title": "Método No Permitido",
    "message": "El método HTTP no está permitido aquí.",
    "action": "Usa un método válido (GET, POST, etc)."
  }
}

>












===== FILE:   src/domain/career.ts   =====
<conteúdo completo do arquivo


// src/domain/career.ts

export enum CareerRole {
  DATA_SPECIALIST = 'data_specialist',
  SYSTEMS_EXPERT = 'systems_expert',
  STRATEGIC_LEAD = 'strategic_lead',
}

export interface CareerExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  // Achievements podem vir de uma lista complementar ou metadados
  achievements?: string[]; 
} 


>












===== FILE:  src/domain/navigation.ts   =====
<conteúdo completo do arquivo

// src/domain/navigation.ts

export enum NavSection {
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  PROJECTS = 'projects',
  ARTICLES = 'articles',
  CONTACT = 'contact',
}

export const NAV_SECTIONS: readonly NavSection[] = [
  NavSection.ABOUT,
  NavSection.EXPERIENCE,
  NavSection.PROJECTS,
  NavSection.ARTICLES,
  NavSection.CONTACT,
] as const;

/**
 * Mapeia a seção para o ID da âncora no HTML.
 * Útil para scroll suave e SEO.
 */
export const NAV_HASH_MAP: Readonly<Record<NavSection, `#${string}`>> = {
  [NavSection.ABOUT]: '#sobre',
  [NavSection.EXPERIENCE]: '#trajetoria',
  [NavSection.PROJECTS]: '#projetos',
  [NavSection.ARTICLES]: '#artigos',
  [NavSection.CONTACT]: '#contato',
} as const;

export const getNavHash = (section: NavSection): `#${string}` => NAV_HASH_MAP[section];
export const getSectionId = (section: NavSection): string => NAV_HASH_MAP[section].replace('#', '');



>







===== FILE:   src/domain/projects.ts   =====
<conteúdo completo do arquivo


// src/domain/projects.ts

export enum ProjectCoreTag {
  PORTFOLIO = 'portfolio',
  FEATURED = 'featured',
  DESTAQUE = 'destaque',
  PRIMEIRO = 'primeiro',
}

export enum ProjectTechnology {
  DATA_SCIENCE = 'data-science',
  AZURE_DATABRICKS = 'azure-databricks',
  NEO4J = 'neo4j',
  POWER_BI = 'power-bi',
  EXCEL = 'excel',
  DATABASE = 'database',
  PYTHON = 'python',
  DOTNET = 'dotnet',
  JAVA = 'java',
  MACHINE_LEARNING = 'machine-learning',
  ARTIFICIAL_INTELLIGENCE = 'artificial-intelligence',
  AWS = 'aws',
  CYBERSECURITY = 'cybersecurity',
  SECURITY = 'security',
  PROGRAMMING_LOGIC = 'programming-logic',
  HTML = 'html',
  NODE_REACT = 'node-react',
}

export const PROJECT_TECHNOLOGY_ORDER: readonly ProjectTechnology[] = Object.values(ProjectTechnology);

export interface ProjectDomain {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly htmlUrl: string;
  readonly homepage?: string | null;
  readonly topics: readonly string[];
  readonly technology: {
    id: ProjectTechnology;
    labelKey: string; // DEVE bater com projects.categories no JSON
  };
  readonly isPortfolio: boolean;
  readonly isFeatured: boolean;
  readonly isFirst: boolean;
}

/**
 * Resolve a tecnologia principal baseada nas tags do GitHub (topics).
 * O labelKey retornado é usado para buscar a tradução correta.
 */
export const resolveProjectTechnology = (topics: readonly string[]) => {
  const normalizedTopics = topics.map(t => t.toLowerCase());
  
  const techId = PROJECT_TECHNOLOGY_ORDER.find((tech) => normalizedTopics.includes(tech));

  // Mapeamento rigoroso para as chaves em dictionary.projects.categories
  const mapping: Record<ProjectTechnology, string> = {
    [ProjectTechnology.DATA_SCIENCE]: 'dataScience',
    [ProjectTechnology.AZURE_DATABRICKS]: 'cloud',
    [ProjectTechnology.NEO4J]: 'graphs',
    [ProjectTechnology.POWER_BI]: 'analysis',
    [ProjectTechnology.EXCEL]: 'excel',
    [ProjectTechnology.DATABASE]: 'database',
    [ProjectTechnology.PYTHON]: 'dev',
    [ProjectTechnology.DOTNET]: 'dev',
    [ProjectTechnology.JAVA]: 'dev',
    [ProjectTechnology.MACHINE_LEARNING]: 'dataScience',
    [ProjectTechnology.ARTIFICIAL_INTELLIGENCE]: 'dataScience',
    [ProjectTechnology.AWS]: 'cloud',
    [ProjectTechnology.CYBERSECURITY]: 'security',
    [ProjectTechnology.SECURITY]: 'security',
    [ProjectTechnology.PROGRAMMING_LOGIC]: 'dev',
    [ProjectTechnology.HTML]: 'dev',
    [ProjectTechnology.NODE_REACT]: 'dev',
  };

  const selectedTechId = techId || ProjectTechnology.DATA_SCIENCE;
  
  return { 
    id: selectedTechId, 
    labelKey: mapping[selectedTechId] || 'dataScience' 
  };
};

export const resolveProjectFlags = (topics: readonly string[]) => {
  const normalized = topics.map(t => t.toLowerCase());
  return {
    isPortfolio: normalized.includes(ProjectCoreTag.PORTFOLIO),
    isFeatured: normalized.includes(ProjectCoreTag.FEATURED) || normalized.includes(ProjectCoreTag.DESTAQUE),
    isFirst: normalized.includes(ProjectCoreTag.PRIMEIRO),
  };
};


>











===== FILE: src/hooks/useScrollSpy.ts  =====
<conteúdo completo do arquivo


'use client'

import { useEffect, useState } from 'react'

export function useScrollSpy(sectionIds: readonly string[], offset: number = 100): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `-${offset}px 0px -50% 0px`, threshold: 0.1 }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds, offset])

  return activeId
}


>












===== FILE:  src/mappers/projectMapper.ts   =====
<conteúdo completo do arquivo


// src/mappers/projectMapper.ts

import { 
  ProjectDomain, 
  resolveProjectTechnology, 
  resolveProjectFlags 
} from "@/domain/projects";

/**
 * Interface que representa o formato bruto retornado pela API do GitHub.
 * Baseado no esquema oficial da REST API v3.
 */
export interface GitHubRepoResponse {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  created_at: string;
  // Outros campos podem ser adicionados se necessário
}

/**
 * Transforma um repositório bruto da API do GitHub no modelo de domínio da aplicação.
 * * @param repo - O objeto retornado pela API do GitHub
 * @returns ProjectDomain - O objeto formatado e pronto para ser usado na UI
 */
export const mapGitHubToDomain = (repo: GitHubRepoResponse): ProjectDomain => {
  const topics = repo.topics || [];
  
  // Resolve a tecnologia principal e a chave de tradução baseada nos topics
  const { id: techId, labelKey } = resolveProjectTechnology(topics);
  
  // Resolve flags de destaque (Portfolio, Featured, First)
  const { isPortfolio, isFeatured, isFirst } = resolveProjectFlags(topics);

  return {
    id: String(repo.id),
    name: repo.name,
    description: repo.description || "",
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    topics: topics,
    technology: {
      id: techId,
      labelKey: labelKey, // Esta chave buscará o texto correto em dictionary.projects.categories
    },
    isPortfolio,
    isFeatured,
    isFirst,
  };
};

/**
 * Mapeia uma lista de repositórios do GitHub.
 */
export const mapGitHubListToDomain = (repos: GitHubRepoResponse[]): ProjectDomain[] => {
  if (!Array.isArray(repos)) return [];
  
  return repos
    .map(mapGitHubToDomain)
    // Exemplo de regra de negócio: Só mostrar se for marcado como portfolio ou se tiver descrição
    .filter(project => project.isPortfolio || project.description !== "")
    .sort((a, b) => (a.isFirst === b.isFirst ? 0 : a.isFirst ? -1 : 1));
};


>









===== FILE:    src/services/githubService.ts  =====
<conteúdo completo do arquivo


// src/services/githubService.ts

import { ProjectDomain } from "@/domain/projects";
import { GitHubRepoResponse, mapGitHubListToDomain } from "@/mappers/projectMapper";

const GITHUB_API_URL = "https://api.github.com";
const USERNAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN;

/**
 * Serviço especializado em buscar dados do GitHub.
 * Utiliza o modelo de cache do Next.js 16.
 */
export async function getGitHubProjects(): Promise<ProjectDomain[]> {
  if (!USERNAME) {
    console.error("[GitHub Service] Username not found in environment variables.");
    return [];
  }

  try {
    const response = await fetch(`${GITHUB_API_URL}/users/${USERNAME}/repos?sort=updated&per_page=100`, {
      headers: {
        // O uso do Token aumenta o limite de requisições e permite ver repositórios privados se necessário
        ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      // Next.js 16 Cache: Revalida os dados a cada 24 horas (86400 segundos)
      next: { 
        revalidate: 86400,
        tags: ['github-projects'] 
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }

    const data: GitHubRepoResponse[] = await response.json();

    // Transforma os dados brutos em Objetos de Domínio via Mapper
    const domainProjects = mapGitHubListToDomain(data);

    // Filtra apenas o que for relevante para o portfólio (opcional, já que o mapper também filtra)
    return domainProjects.filter(p => p.isPortfolio || p.isFeatured);

  } catch (error) {
    console.error("[GitHub Service] Failed to fetch projects:", error);
    return []; // Retorna lista vazia em caso de falha para não quebrar a UI
  }
}


>



















===== FILE:  src/styles/animations.css    =====
<conteúdo completo do arquivo



/* src/styles/animations.css */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    /* translate3d ativa aceleração de hardware (GPU) */
    transform: translate3d(0, 15px, 0) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes shimmer {
  0% { transform: translate3d(-100%, 0, 0); }
  100% { transform: translate3d(100%, 0, 0); }
}

/* Sistema de Stagger (Entrada Gradual Otimizada) */
.stagger-load {
  isolation: isolate; /* Cria um contexto de empilhamento independente */
}

.stagger-load > * {
  opacity: 0;
  /* Melhora a performance em telas ProMotion/120Hz */
  backface-visibility: hidden;
  will-change: transform, opacity;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Delays baseados na sequência de leitura */
.stagger-load > *:nth-child(1) { animation-delay: 100ms; }
.stagger-load > *:nth-child(2) { animation-delay: 180ms; }
.stagger-load > *:nth-child(3) { animation-delay: 260ms; }
.stagger-load > *:nth-child(4) { animation-delay: 340ms; }
.stagger-load > *:nth-child(5) { animation-delay: 420ms; }
.stagger-load > *:nth-child(n+6) { animation-delay: 500ms; }

/* Skeleton Shimmer de Alta Performance */
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background-color: color-mix(in oklch, currentColor 5%, transparent);
  border-radius: inherit;
  transform: translateZ(0); /* Força nova camada de renderização */
}

.skeleton-shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in oklch, currentColor 8%, transparent) 50%,
    transparent 100%
  );
  animation: shimmer 1.8s ease-in-out infinite;
  will-change: transform;
}

/* Ajustes de Ritmo Cognitivo (Localização) 
   Idiomas latinos (PT/ES) tendem a ter textos mais longos, 
   uma animação levemente mais lenta melhora a legibilidade durante o scroll.
*/
[lang^="es"] .stagger-load > * { animation-duration: 0.9s; }
[lang^="pt"] .stagger-load > * { animation-duration: 0.85s; }
[lang^="en"] .stagger-load > * { animation-duration: 0.7s; }

/* Acessibilidade: Movimento Reduzido (Rigor 2026) */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .stagger-load > * {
    opacity: 1; /* Garante visibilidade imediata sem movimento */
    transform: none !important;
  }
}


>















===== FILE: src/types/dictionary.ts   =====
<conteúdo completo do arquivo


// src/types/dictionary.ts

export type Locale = "pt-BR" | "en-US" | "es-ES" | "es-AR" | "es-MX";

export interface DictionaryMeta {
  version: string;
  locale: Locale;
  direction: "ltr" | "rtl";
  lastUpdated: string;
  author: string;
  source: string;
  contentVersion?: string;
  contentHash?: string;
  sourceType?: string;
}

export interface HeroDictionary {
  greeting: string;
  title: string;
  subtitle: string;
  headline: string;
  ctaPrimary: string;
}

export interface AboutDictionary {
  title: string;
  differentialTitle: string;
  description: string;
  differentialContent: string;
  highlights: string[];
  stats: {
    experienceValue: string;
    experienceLabel: string;
    availabilityValue: string;
    availabilityLabel: string;
    automation: string;
  };
}

export interface ContactDictionary {
  title: string;
  subtitle: string;
  cta: string;
  emailLabel: string;
  cvLabel: string;
  linkedinLabel: string;
}

export interface ExperienceItem {
  company: string;
  period: string;
  role: string;
  description: string;
}

export interface ExperienceDictionary {
  title: string;
  items: ExperienceItem[];
}

export interface ArticleItem {
  title: string;
  description: string;
  date: string;
  category: string;
  isAward: boolean;
  link: string;
}

export interface ArticlesSectionDictionary {
  title: string;
  mediumProfile: string;
  readMore: string;
  publishedAt: string;
  bestOfMonth: string;
  awardWinner: string;
  items: ArticleItem[];
}

export interface ProjectCategories {
  dataScience: string;
  cloud: string;
  graphs: string;
  analysis: string;
  excel: string;
  database: string;
  dev: string;
  security: string;
}

export interface ProjectsSectionDictionary {
  title: string;
  featuredLabel: string;
  firstLabel: string;
  impactLabel: string;
  viewProject: string;
  viewDemo: string;
  viewAll: string;
  categories: ProjectCategories;
}

export interface CommonDictionary {
  navigation: string;
  role: string;
  footer: string;
  rights: string;
  builtWith: string;
  loading: string;
  error: string;
  socialLinks: string;
  languageSwitcher: string;
  errorBoundary: {
    title: string;
    description: string;
    actions: { retry: string; home: string };
  };
  notFound: {
    title: string;
    description: string;
    button: string;
  };
  externalLinks: {
    linkedin: string;
    github: string;
    medium: string;
    email: string;
  };
  menu: {
    open: string;
    close: string;
    aria: { open: string; close: string };
  };
}

export interface StateDictionary {
  loading: string;
  empty: string;
  error: string;
  emptyProjects: { title: string; description: string; cta: string };
  emptyExperience: string;
  errorArticles: string;
}

export interface Dictionary {
  meta: DictionaryMeta;
  hero: HeroDictionary;
  about: AboutDictionary;
  contact: ContactDictionary;
  experience: ExperienceDictionary;
  articles: ArticlesSectionDictionary;
  projects: ProjectsSectionDictionary;
  common: CommonDictionary;
  intl: {
    locale: string;
    fallbackLocale: string;
    currency: string;
    timezone: string;
    unitDisplay: string;
    numberFormat: string;
  };
  states: StateDictionary;
  cookie: {
    title: string;
    description: string;
    necessary: string;
    alwaysActive: string;
    analytics: string;
    acceptAll: string;
    savePreferences: string;
  };
  seo: {
    siteName: string;
    description: string;
    keywords: string[];
    pages: {
      [key: string]: { title: string; description: string };
    };
  };
  metrics: {
    availability: string;
    availabilityNormalized: { value: number; unit: string };
  };
}


>













===== FILE: src/types/error-dictionary.ts     =====
<conteúdo completo do arquivo


export interface ErrorDetail {
  title: string;
  message: string;
  action: string;
}

export interface ErrorDictionary {
  InternalServerError: ErrorDetail;
  NotFoundError: ErrorDetail;
  ValidationError: ErrorDetail;
  UnauthorizedError: ErrorDetail;
  ForbiddenError: ErrorDetail;
  TooManyRequestsError: ErrorDetail;
  UnprocessableEntityError: ErrorDetail;
  MethodNotAllowedError: ErrorDetail;
}



>









===== FILE:  src/types/i18n.d.ts   =====
<conteúdo completo do arquivo


// src/types/i18n.d.ts

import { 
  Locale as LocaleType, 
  Dictionary as DictionaryType 
} from "./dictionary";

/**
 * Tornamos os tipos disponíveis globalmente no projeto 
 * para satisfazer o rigor do TS 6.0 sem precisar de imports em todo lugar.
 */
declare global {
  type Locale = LocaleType;
  type Dictionary = DictionaryType;

  // Tipos auxiliares consistentes com seus dicionários
  interface I18nParams {
    params: {
      lang: Locale;
    };
  }
}

export {};


>








===== FILE:   src/types/project.ts   =====
<conteúdo completo do arquivo

// src/types/project.ts

import { Locale } from "./dictionary";

export type ProjectLocaleContent = {
  title: string;
  description: string;
  summary?: string;
};

export interface ProjectSEO {
  title: string;
  description: string;
  keywords?: string[];
}

export interface ProjectLinks {
  repository?: string;
  demo?: string;
  article?: string;
}

export interface Project {
  id: string;
  slug: string;
  category: string;
  featured: boolean;
  order: number;
  status: "active" | "archived" | "draft";

  /**
   * Conteúdo localizado do projeto.
   * 'pt-BR' é obrigatório, os demais são opcionais.
   */
  content: {
    "pt-BR": ProjectLocaleContent;
  } & Partial<Record<Exclude<Locale, "pt-BR">, ProjectLocaleContent>>;

  /**
   * SEO localizado do projeto.
   */
  seo: {
    "pt-BR": ProjectSEO;
  } & Partial<Record<Exclude<Locale, "pt-BR">, ProjectSEO>>;

  stack: string[];
  links?: ProjectLinks;
  createdAt: string;
  updatedAt?: string;
}

>



