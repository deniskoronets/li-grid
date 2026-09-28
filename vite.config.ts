import {defineConfig} from "vitest/config";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import {resolve} from "node:path";

export default defineConfig({
    plugins: [
        vue(),
        dts({
            include: ["src"],
            exclude: ["src/**/*.test.ts"],
            tsconfigPath: "./tsconfig.json",
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "LiGrid",
            fileName: "li-grid",
            cssFileName: "style",
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                exports: "named",
                globals: {vue: "Vue"},
            },
        },
    },
    test: {
        environment: "jsdom",
        include: ["tests/**/*.test.ts"],
    },
});
