import { defineConfig } from "vite";

export default defineConfig({
    plugins: [],
    test: {
        globals: true,
        globalSetup: ["tests/setup.ts"]
    }
});
