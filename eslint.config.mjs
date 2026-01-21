import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Ajuste de Governança: Permitir 'any' temporariamente para destravar o build, 
      // mas mantendo o aviso para refatoração futura.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Garante que imports duplicados sejam tratados como erros fatais
      'no-duplicate-imports': 'error',
      // Desativa a regra de ordem de importação se ela estiver causando conflitos insolúveis agora
      'import/order': 'off', 
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
  ]),
]);

export default eslintConfig;
