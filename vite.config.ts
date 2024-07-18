import honox from "honox/vite";
import client from "honox/vite/client";
import adapter from "@hono/vite-dev-server/cloudflare";
import pages from "@hono/vite-cloudflare-pages";
import { defineConfig } from "vite";

const baseConfig = {
    resolve: {
        alias: {
            "@": "/app"
        }
    }
};

export default defineConfig(({ mode }) => {
    if (mode === "client") {
        return {
            ...baseConfig,
            plugins: [client()],
            build: {
                rollupOptions: {
                    input: ["/app/style.css"]
                }
            }
        };
    }

    return {
        ...baseConfig,
        plugins: [
            honox({
                devServer: {
                    adapter
                }
            }),
            pages()
        ]
    };
});
