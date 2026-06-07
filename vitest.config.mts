import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.spec.ts'],
        testTimeout: 60000,
        hookTimeout: 60000,
        coverage: {
            provider: 'v8',
            lines: 100,
            functions: 100,
            branches: 100,
            statements: 100
        }
    }
});