import { Hono } from "hono";

import { Env } from "@/middleware";
import { AccessError, onAccess } from "@/lib";
import { getSession, setRedirectUriAfterAuth } from "@/cookie";

const app = new Hono<Env>();

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
            token: getSession(c)
        },
        c.req.param("id")
    );

    const LOGIN_LINK = (
        <>
            <a href="/_/auth">ここ</a>からログインを行ってください。
        </>
    );

    let requireRedirect = false;
    let response = null;

    if (result == AccessError.AccessIsLimited) {
        requireRedirect = true;

        c.status(403);
        response = c.render(
            <p>
                この短縮URLは千葉工業大学生のみがアクセス可能です。
                <br />
                {LOGIN_LINK}
            </p>
        );
    } else if (result == AccessError.LoginRequiredForAccessLog) {
        requireRedirect = true;

        response = c.render(
            <p>
                この短縮URLはアクセスログを記録するために
                千葉工業大学のメールアドレスによるログインが必要です。
                <br />
                {LOGIN_LINK}
            </p>
        );
    } else if (result == AccessError.NotFound) {
        c.status(404);
        response = c.render(
            <>
                <h1>404 Not Found</h1>
                短縮URLのリダイレクト先が見つかりませんでした。
            </>
        );
    }

    if (response) {
        if (requireRedirect) {
            setRedirectUriAfterAuth(c, c.req.url);
        }

        return response;
    }

    return c.redirect(result as string);
});

export default app;
