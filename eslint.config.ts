import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { fixupPluginRules } from '@eslint/compat';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import jsdoc from 'eslint-plugin-jsdoc';
import regexp from 'eslint-plugin-regexp';
import n from 'eslint-plugin-n';
import promise from 'eslint-plugin-promise';
import importX from 'eslint-plugin-import-x';
import vitest from '@vitest/eslint-plugin';
import noSecrets from 'eslint-plugin-no-secrets';
import compat from 'eslint-plugin-compat';
import globals from 'globals';

export default tseslint.config(
    // ──────────────────────────────────────────────
    // Global ignores
    // ──────────────────────────────────────────────
    {
        ignores: [
            'node_modules/**',
            '.vscode/**',
            '.nyc_output/**',
            'coverage/**',
            'dist/**',
            'lib/**',
            '.parcel-cache/**',
            'tests/unit/data/**/*.json',
        ],
    },

    // ──────────────────────────────────────────────
    // Base: ESLint recommended rules
    // ──────────────────────────────────────────────
    eslint.configs.recommended,

    // ──────────────────────────────────────────────
    // TypeScript: recommended type-checked rules
    // ──────────────────────────────────────────────
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: process.cwd(),
            },
        },
    },

    // ──────────────────────────────────────────────
    // Plugin: sonarjs – code quality & bug detection
    // ──────────────────────────────────────────────
    sonarjs.configs!.recommended as unknown as Parameters<typeof tseslint.config>[number],

    // ──────────────────────────────────────────────
    // Plugin: unicorn – misc best practices
    // ──────────────────────────────────────────────
    unicorn.configs['flat/recommended'],

    // ──────────────────────────────────────────────
    // Plugin: jsdoc – documentation rules (TypeScript)
    // ──────────────────────────────────────────────
    jsdoc.configs['flat/recommended-typescript'],

    // ──────────────────────────────────────────────
    // Plugin: regexp – regular expression linting
    // ──────────────────────────────────────────────
    regexp.configs['flat/recommended'],

    // ──────────────────────────────────────────────
    // Plugin: n – Node.js best practices
    // ──────────────────────────────────────────────
    n.configs['flat/recommended'],

    // ──────────────────────────────────────────────
    // Plugin: promise – promise best practices
    // ──────────────────────────────────────────────
    promise.configs['flat/recommended'],

    // ──────────────────────────────────────────────
    // Plugin: import-x – import/export linting
    // ──────────────────────────────────────────────
    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,
    {
        settings: {
            'import-x/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },
        },
    },

    // ──────────────────────────────────────────────
    // Plugin: compat – browser compatibility
    // ──────────────────────────────────────────────
    compat.configs['flat/recommended'],

    // ──────────────────────────────────────────────
    // Plugin: no-secrets – detect hardcoded secrets
    // ──────────────────────────────────────────────
    {
        plugins: {
            'no-secrets': fixupPluginRules(noSecrets),
        },
        rules: {
            'no-secrets/no-secrets': ['error', { tolerance: 4.5 }],
        },
    },

    // ──────────────────────────────────────────────
    // Global settings for all TypeScript files
    // ──────────────────────────────────────────────
    {
        files: ['**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.node,
                BigInt: true,
            },
        },
        settings: {
            jsdoc: {
                ignorePrivate: true,
            },
        },
        rules: {
            // ── Core ESLint ──
            'linebreak-style': 'off',
            'no-await-in-loop': 'off',
            'no-console': 'warn',
            'no-restricted-syntax': [
                'error',
                'LabeledStatement',
                'WithStatement',
            ],
            'max-len': [
                'error',
                {
                    code: 120,
                    ignoreComments: true,
                    ignoreTrailingComments: true,
                    ignoreStrings: true,
                    ignoreRegExpLiterals: true,
                },
            ],
            'no-underscore-dangle': 'off',
            'no-continue': 'off',
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1,
                    outerIIFEBody: 1,
                },
            ],
            'comma-dangle': 'off',

            // ── TypeScript ──
            '@typescript-eslint/ban-ts-comment': 'off',

            // ── Unicorn ──
            'unicorn/filename-case': [
                'error',
                {
                    cases: {
                        camelCase: true,
                        pascalCase: true,
                    },
                },
            ],
            'unicorn/no-null': 'off',
            'unicorn/prevent-abbreviations': [
                'error',
                {
                    replacements: {
                        q: { query: true },
                        props: { properties: false },
                    },
                },
            ],
            'unicorn/no-array-reduce': 'off',
            'unicorn/prefer-node-protocol': 'off',
            'unicorn/prefer-module': 'off',
            'unicorn/prefer-object-from-entries': 'off',
            'unicorn/expiring-todo-comments': 'off',
            'unicorn/numeric-separators-style': 'off',

            // ── JSDoc ──
            // In TypeScript, JSDoc type annotations are redundant; keep as warning
            // to allow gradual cleanup
            'jsdoc/no-types': 'warn',
            'jsdoc/check-tag-names': ['warn', { typed: false }],
            'jsdoc/require-example': [
                'warn',
                {
                    contexts: [
                        'FunctionDeclaration',
                        'FunctionExpression',
                    ],
                },
            ],
            'jsdoc/require-jsdoc': [
                'warn',
                {
                    require: {
                        ArrowFunctionExpression: false,
                        ClassDeclaration: true,
                        FunctionDeclaration: true,
                        FunctionExpression: true,
                        MethodDefinition: true,
                    },
                },
            ],
            'jsdoc/tag-lines': [
                'warn',
                'always',
                {
                    applyToEndTag: false,
                    count: 0,
                    startLines: 1,
                },
            ],

            // ── Node.js (n) ──
            // Allow importing devDependencies in config/test files
            'n/no-unsupported-features/es-syntax': 'off',
            // TypeScript handles module resolution
            'n/no-missing-import': 'off',

            // ── Import-x ──
            'import-x/order': [
                'warn',
                {
                    'groups': [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    'newlines-between': 'always',
                },
            ],
            'import-x/no-duplicates': 'error',
            // TypeScript handles these
            'import-x/no-unresolved': 'off',
            'import-x/named': 'off',
        },
    },

    // ──────────────────────────────────────────────
    // Override: browser-targeted auth modules
    // ──────────────────────────────────────────────
    {
        files: ['src/auth/OAuthAuth.ts', 'src/utils/pkce.ts'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            // These modules intentionally use browser APIs (sessionStorage, crypto, location)
            'n/no-unsupported-features/node-builtins': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
        },
    },

    // ──────────────────────────────────────────────
    // Override: test files
    // ──────────────────────────────────────────────
    {
        files: ['**/*.spec.ts', '**/*.spec.xts'],
        ...vitest.configs.recommended,
        rules: {
            ...vitest.configs.recommended.rules,
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            'func-names': 'off',
            'prefer-arrow-callback': 'off',
            'sonarjs/no-duplicate-string': 'off',
            // Test files can use any import pattern
            'import-x/order': 'off',
            // Vitest global APIs
            'n/no-unpublished-import': 'off',
        },
    },
);
