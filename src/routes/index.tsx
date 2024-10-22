import { Hono } from "hono";

import { type Env } from "@/index";
import { AccessError, onAccess } from "@/lib";
import { setRedirectUriAfterAuth } from "@/cookie";

import dashboard from "./dashboard";
import routes from "./auth";
import Layout from "@/components/views/layout";
import Login from "@/components/views/login";

const app = new Hono<Env>();

app.route("/_/auth", routes);
app.route("/", dashboard);

// 短縮URLリダイレクト
app.get("/:id", async (c) => {
    const id = c.req.param("id");

    const result = await onAccess(
        {
            data: c.var.data,
            userId: c.var.authorId,
        },
        id,
    );

    let requireRedirect = false;
    let response = null;

    if (result == AccessError.AccessIsLimited) {
        requireRedirect = true;

        c.status(403);
        response = c.render(
            <Layout
                title="千葉工業大学生の認証が必要"
                isLoggedIn={c.var.isLoggedIn}
            >
                <Login title="この先、千葉工業大学生限定のため、認証が必要です。" />
            </Layout>,
        );
    } else if (result == AccessError.LoginRequiredForAccessLog) {
        requireRedirect = true;

        response = c.render(
            <Layout
                title="千葉工業大学の認証が必要"
                isLoggedIn={c.var.isLoggedIn}
            >
                <Login title="アクセスログ記録のために、認証をしてください。" />
            </Layout>,
        );
    } else if (result == AccessError.NotFound) {
        c.status(404);
        response = c.render(
            <Layout
                title="短縮URLが見つかりませんでした。"
                isLoggedIn={c.var.isLoggedIn}
            >
                <h1 class="text-5xl">404 Not Found</h1>
                <p>短縮URLのリダイレクト先が見つかりませんでした。</p>
            </Layout>,
        );
    }

    console.log(requireRedirect, response);
    if (response) {
        if (requireRedirect) {
            setRedirectUriAfterAuth(c, c.req.url);
        }

        return response;
    }

    return c.redirect(result as string);
});

export default app;
