import { Hono } from "hono";

import routes from "./routes";
import { Env, middleware } from "./middleware";
import { jsxRenderer } from "hono/jsx-renderer";
import { AccessError, onAccess } from "./lib";
import { getCookie } from "hono/cookie";

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
        </div>,
        { title: "あいうえお" }
    );
});

app.get("/:id", async (c) => {
    const result = await onAccess(
        {
            data: c.var.data,
            getToken() {
                return getCookie(c, "session");
            },
            getAuthenticatePath() {
                return "/_/auth";
            }
        },
        c.req.param("id")
    );

    const LOGIN_LINK = (
        <>
            <a href="/_/auth">ここ</a>からログインを行ってください。
        </>
    );

    if (result == AccessError.AccessIsLimited) {
        c.status(403);
        return c.render(
            <p>
                この短縮URLは千葉工業大学生のみがアクセス可能です。
                <br />
                {LOGIN_LINK}
            </p>
        );
    } else if (result == AccessError.LoginRequiredForAccessLog) {
        return c.render(
            <p>
                この短縮URLはアクセスログを記録するために
                千葉工業大学のメールアドレスによるログインが必要です。
                <br />
                {LOGIN_LINK}
            </p>
        );
    } else if (result == AccessError.NotFound) {
        c.status(404);
        return c.render(
            <>
                <h1>404 Not Found</h1>
                短縮URLのリダイレクト先が見つかりませんでした。
            </>
        );
    }

    return c.redirect(result as string);
});

app.route("/_/", routes);

export default app;
