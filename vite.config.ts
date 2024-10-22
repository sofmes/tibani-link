import build from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
            "@": `${__dirname}/src`
        }
    },
    server: {
        port: 4321,
        host: "127.0.0.1"
    },
    plugins: [
        build(),
        devServer({
            adapter,
            entry: "src/index.tsx"
        })
    ],
});
