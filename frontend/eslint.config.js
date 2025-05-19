import vuePlugin from 'eslint-plugin-vue';
import vueEssential from 'eslint-plugin-vue/lib/configs/vue3-essential.js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        sourceType: 'module',
        ecmaVersion: 2021
      }
    },
    plugins: {
      vue: vuePlugin,
      '@typescript-eslint': typescriptEslint,
      prettier
    },
    rules: {
      ...vueEssential.rules,
      ...typescriptEslint.configs.recommended.rules,
      ...prettierConfig.rules,
      indent: 'off',
      quotes: ['error', 'single'],
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'vue/multi-word-component-names': 'off'
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.vue']
        }
      }
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.d.ts',
      'public/**',
      'eslint.config.js',
      '.prettierrc',
      'package.json',
      'package-lock.json',
      'vite.config.ts',
      'tailwind.config.ts'
    ]
  }
];
