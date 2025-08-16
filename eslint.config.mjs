import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', 'eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest, // keep if using Jest
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        // Optional: enforce strict rule loading
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      // --- TypeScript ---
      '@typescript-eslint/consistent-type-imports': 'error', // Prefer `import type`
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Was 'off', but warn is safer
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-misused-promises': 'off', // Turn back on if using `async` in callbacks
      '@typescript-eslint/no-non-null-assertion': 'warn', // Discourage `!`
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',

      // --- Stylistic (from stylisticTypeChecked) ---
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // or 'type' if you prefer
      '@typescript-eslint/no-duplicate-type-constituents': 'error',

      // --- Best Practices ---
      '@typescript-eslint/require-await': 'off', // Can be noisy in NestJS async controllers
      'no-console': 'warn', // Optional: enforce logging practices
      'no-void': 'error', // Avoid `void 0`, use `undefined`

      // --- Node.js ---
      'no-process-env': 'warn', // Encourage ConfigService instead of process.env
      'no-undef': 'off', // Handled by TS
    },
  },

  // --- Test Files (Jest) ---
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/unbound-method': 'off', // Common in Jest mocks
      'no-console': 'off',
    },
  }
);