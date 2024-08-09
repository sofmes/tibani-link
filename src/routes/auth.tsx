import { Hono } from "hono";

import { loginByGoogle, loginByMail, loginVerifyByMail } from "@/lib/login";
import { googleOAuth2URL } from "@/lib/middleware";
import { setCookie } from "hono/cookie";

const app = new Hono();

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
            </p>
        );
    }

    setCookie(c, "session", token);

    return c.text("Google認証完了");
});

app.post("/mail", async (c) => {
    const data = await c.req.parseBody();

    if (data["email"] && !(data["email"] instanceof File)) {
        if (!(await loginByMail(data["email"], c.req.url))) {
            return c.render(
                <p>
                    このウェブサービスは千葉工業大学生にのみ提供を行っています。
                    そのため、メール認証には千葉工業大学のメールアドレスを使用してください。
                    例：<code>s11K4514YJ@s.chibakoudai.jp</code>
                </p>
            );
        }

        return c.render(
            <p>
                ログイン用のメールを送りました。送られてきたメールのURLを開いてください。
            </p>
        );
    }
});

app.get("/mail", async (c) => {
    const { verifyToken } = c.req.query();
    const token = await loginVerifyByMail(verifyToken);

    if (token) {
        setCookie(c, "session", token);
        return c.render(
            <p>
                ログインしました！<a href="/">ここ</a>
                からサービスを利用開始できます。
            </p>
        );
    } else {
        return c.render(
            <p>
                セッションが切れています。メール認証のメール確認は５分以内に行ってください。
            </p>
        );
    }
});

app.get("/", async (c) => {
    return c.render(
        <div>
            <form action="mail" method="POST">
                <label for="email">メール：</label>
                <input type="email" name="email" id="email" required />
                <button type="submit">メールでログイン</button>
            </form>
            <a href={googleOAuth2URL}>Googleでログイン</a>
        </div>
    );
});

export default app;
