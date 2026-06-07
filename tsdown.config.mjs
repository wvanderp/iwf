import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: './src/index.ts',
    format: 'cjs',
    outDir: 'lib',
    dts: true,
    sourcemap: true,
    target: 'node16',
    clean: true,
    fixedExtension: false,
});