import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./setup/test-setup.ts"],
    testTimeout: 10000,
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "setup/",
        "**/*.config.*",
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@config": resolve(__dirname, "../server/src/config"),
      "@routes": resolve(__dirname, "../server/src/routes"),
    },
  },
});
