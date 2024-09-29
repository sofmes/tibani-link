import { Context, Hono } from "hono";

import { loginByGoogle, loginByMail, loginVerifyByMail } from "@/lib/auth";
import { googleOAuth2URL } from "@/lib/middleware";
import { setSession, takeRedirectUriAfterAuth } from "@/cookie";

const app = new Hono();

function onAuthenticated(c: Context, token: string) {
    setSession(c, token);

    const redirectUri = takeRedirectUriAfterAuth(c);
    if (redirectUri)
        return c.render(
            <p>
                ログインが完了しました。１０秒後に以下のURLへリダイレクトされます。
                <br />
                <a href={redirectUri}>{redirectUri}</a>
            </p>,
            {
                title: "Tibani Linkのログインの成功",
                head: (
                    <meta
                        http-equiv="refresh"
                        content={`10;url=${redirectUri}`}
                    />
                ),
            },
        );
    else
        return c.render(
            <p>
                ログインしました！<a href="/">ここ</a>
                からサービスを利用開始できます。
            </p>,
        );
}

app.get("/google", async (c) => {
    const { code } = c.req.query();
    if (!code) {
        return c.text("Googleから渡されるはずのcodeがありません。", 400);
    }

    const token = await loginByGoogle(code);
    if (!token) {
        return c.render(
            <p>
                このウェブサービスは千葉工業大学生にのみ提供を行っています。
                そのため、Googleでログインする場合、千葉工業大学のアカウントを使ってログインしてください。
            </p>,
        );
    }

    return onAuthenticated(c, token);
});

app.post("/mail", async (c) => {
    const data = await c.req.parseBody();

    if (data["email"] && !(data["email"] instanceof File)) {
        if (!(await loginByMail(data["email"], c.req.url))) {
            c.status(403);
            return c.render(
                <p>
                    このウェブサービスは千葉工業大学生にのみ提供を行っています。
                    そのため、メール認証には千葉工業大学のメールアドレスを使用してください。
                    例：<code>s11K4514YJ@s.chibakoudai.jp</code>
                </p>,
            );
        }

        return c.render(
            <p>
                ログイン用のメールを送りました。送られてきたメールのURLを開いてください。
            </p>,
        );
    }
});

app.get("/mail", async (c) => {
    const { verifyToken } = c.req.query();
    if (!verifyToken) {
        c.status(400);
        return c.render(
            <p>
                トークンがありません。
                本当にメールにあったアドレスからアクセスしましたでしょうか？
            </p>,
        );
    }

    const token = await loginVerifyByMail(verifyToken);

    if (token) {
        return onAuthenticated(c, token);
    } else {
        c.status(400);
        return c.render(
            <p>
                セッションが切れています。メール認証のメール確認は５分以内に行ってください。
            </p>,
        );
    }
});

app.get("/", async (c) => {
    return c.render(
        <div>
            <form action="auth/mail" method="post">
                <label for="email">メール：</label>
                <input type="email" name="email" id="email" required />
                <button type="submit">メールでログイン</button>
            </form>
            <a href={googleOAuth2URL}>Googleでログイン</a>
        </div>,
    );
});

export default app;
