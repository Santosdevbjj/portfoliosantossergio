import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * FLAT CONFIG - RIGOR TÉCNICO MÁXIMO (2026)
 * Integração: Next.js 16.1.4 + React Hooks 7.0.1 (Flat Config Native)
 */
const eslintConfig = defineConfig([
  // 1. Configurações Base do Next.js (Versão 16 usa spread)
  ...nextVitals,
  ...nextTs,
  
  // 2. Novo Padrão React Hooks v7.0.1 (Flat Config recomendado)
  reactHooks.configs.flat.recommended,
  
  // 3. Prettier para evitar conflitos de formatação
  prettier,
  
  {
    // 4. Plugins Adicionais e Governança
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // --- SEGURANÇA E INTEGRIDADE ---
      'no-duplicate-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      
      // --- GESTÃO DE VARIÁVEIS (CLEAN CODE) ---
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
      
      // Garantindo regras de Hooks do React Compiler (v7.0.1)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
  },

  // 5. Definições Globais de Exclusão
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    'node_modules/**',
    'eslint.config.mjs'
  ]),
]);

export default eslintConfig;
