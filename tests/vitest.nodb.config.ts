import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        // USA O SETUP NO-DB AO INVÉS DO PADRÃO
        setupFiles: ["./setup/test-setup-nodb.ts"],
        testTimeout: 10000,
        fileParallelism: false,
    },
    resolve: {
        alias: {
            "@config": resolve(__dirname, "../server/src/config"),
            "@routes": resolve(__dirname, "../server/src/routes"),
        },
    },
});
