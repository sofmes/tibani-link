import { Hono } from "hono";

import routes from "./routes";
import { Env, middleware } from "./middleware";
import { jsxRenderer } from "hono/jsx-renderer";

const app = new Hono<Env>();

app.use(middleware);

app.get(
    "/*",
    jsxRenderer(({ children, title }) => {
        return (
            <html lang="ja">
                <head>
                    <meta charset="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    {import.meta.env.PROD ? (
                        <>
                            <link href="/static/style.css" rel="stylesheet" />
                        </>
                    ) : (
                        <>
                            <link href="/src/style.css" rel="stylesheet" />
                        </>
                    )}
                    <title>{title}</title>
                </head>
                <body>{children}</body>
            </html>
        );
    })
);

app.get("/", async (c) => {
    return c.render(
        <div>
            <h1>Hello</h1>
        </div>
    );
});

app.route("/_/", routes);

export default app;
