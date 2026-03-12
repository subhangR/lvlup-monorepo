import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },
  },
});
