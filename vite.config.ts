import build from "@hono/vite-build/cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig((mode) => {
    return {
        resolve: {
            alias: {
                "@": `${__dirname}/src`,
            },
        },
        server: {
            port: 4321,
            host: "127.0.0.1",
        },
        build: {
            rollupOptions: {
                input: ["src/style.css"],
            },
        },
        plugins: [
            build(),
            devServer({
                adapter,
                entry: "src/index.tsx",
            }),
        ],
    };
});
