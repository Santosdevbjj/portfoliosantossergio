import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * FLAT CONFIG - RIGOR TÉCNICO MÁXIMO (2026)
 * Versão Final: Next.js 16.1.4 + React Hooks 7.0.1 + Node 24.x
 */
const eslintConfig = defineConfig([
  // 1. Configurações Base do Next.js (Spread obrigatório na v16)
  ...nextVitals,
  ...nextTs,
  
  // 2. Integração Nativa React Hooks v7.0.1 (Flat Config)
  // Isso já ativa 'rules-of-hooks' e 'exhaustive-deps' automaticamente
  reactHooks.configs.flat.recommended,
  
  // 3. Prettier para governança de estilo
  prettier,
  
  {
    // 4. Customização e Governança de Código Limpo
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // --- SEGURANÇA E INTEGRIDADE ---
      'no-duplicate-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      
      // --- GESTÃO DE VARIÁVEIS (CLEAN CODE) ---
      // Desativamos a regra padrão para usar a versão otimizada do plugin de imports
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error', 
      'unused-imports/no-unused-vars': [
        'warn',
        {
          'vars': 'all',
          'varsIgnorePattern': '^_',
          'args': 'after-used',
          'argsIgnorePattern': '^_'
        }
      ],

      // --- COMPATIBILIDADE REACT 19 / NEXT 16 ---
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'error',
    },
  },

  // 5. Definições Globais de Exclusão (Performance de Linting)
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    'node_modules/**',
    'eslint.config.mjs',
    'package.json',
    'package-lock.json'
  ]),
]);

export default eslintConfig;
