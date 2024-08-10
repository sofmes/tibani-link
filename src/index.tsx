import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

import routes from "./routes/other";
import { Env, middleware } from "./middleware";

const app = new Hono<Env>();

app.use(middleware);
app.route("/", routes);

app.get(
    "/*",
    jsxRenderer(({ children, title, head }) => {
        return (
            <html lang="ja">
                <head>
                    <meta charset="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    {head}
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

export default app;
