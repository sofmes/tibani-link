import { Context, Hono } from "hono";

import { setSession, takeRedirectUriAfterAuth } from "@/cookie";
import { loginByGoogle } from "@/lib/login";
import Layout from "@/components/views/layout";
import { type Env } from "@/index";
import Login from "@/components/views/login";

const app = new Hono<Env>();

/**
 * ログイン後の処理を行う。もしリダイレクト先が設定されているのなら、リダイレクトを行う。
 */
function onAuthenticated(c: Context, token: string) {
    setSession(c, token);

    const redirectUri = takeRedirectUriAfterAuth(c);
    if (redirectUri) return c.redirect(redirectUri);
    else return c.redirect("/");
}

// Google認証のCallback
app.get("/google", async (c) => {
    const { code } = c.req.query();
    if (!code) {
        return c.text("Googleから渡されるはずのcodeがありません。", 400);
    }

    const token = await loginByGoogle(code);
    if (!token) {
        return c.redirect("/_auth");
    }

    return onAuthenticated(c, token);
});

// ログアウト
app.get("/logout", (c) => {
    setSession(c, null);
    return c.redirect("/_auth");
});

// 認証フォーム
app.get("/", async (c) => {
    return c.render(
        <Layout isLoggedIn={c.get("isLoggedIn")} title="ログイン">
            <Login />
        </Layout>,
    );
});

export default app;
