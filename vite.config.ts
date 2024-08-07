import honox from "honox/vite";
import adapter from "@hono/vite-dev-server/cloudflare";
import pages from "@hono/vite-cloudflare-pages";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
            "@": `${__dirname}/app`
        }
    },
    ssr: {
        external: ["google-auth-library", "react-dom", "deepmerge", "js-beautify"]
    },
    server: { host: "127.0.0.1", port: 4321 },
    plugins: [
        honox({
            client: {
                input: ["/app/style.css"]
            },
            devServer: {
                adapter
            }
        }),
        pages()
    ]
});
