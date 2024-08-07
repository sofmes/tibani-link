import { setCookie } from "hono/cookie";
import { createRoute } from "honox/factory";
import { loginByMail } from "@/lib/login";
import { auth } from "@/lib/middleware";

export const POST = createRoute(async (c) => {
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

export default createRoute(async (c) => {
    const { verifyToken } = c.req.query();
    const token = await auth.verifyMailToken(verifyToken);

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
