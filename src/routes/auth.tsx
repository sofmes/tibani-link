import { Context, Hono } from "hono";

import { loginByGoogle, loginByMail, loginVerifyByMail } from "@/lib/auth";
import { setSession, takeRedirectUriAfterAuth } from "@/cookie";
import { googleOAuth2URL } from "@/lib";

const app = new Hono();

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
        return c.redirect("/_/auth");
    }

    return onAuthenticated(c, token);
});

// メール認証のログイン用URL送信
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

// メール認証後のログインURL先
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

// ログアウト
app.get("/logout", (c) => {
    setSession(c, null);
    return c.redirect("/_/auth");
});

// 認証フォーム
app.get("/", async (c) => {
    return c.render(
        <>
            <h2 className="text-2xl font-bold mb-4 text-center">
                アクセスには認証が必要です
            </h2>

            {/* メール認証 */}
            <form className="space-y-4 mb-6">
                <div>
                    <label htmlFor="username" className="block mb-1">
                        大学メールアドレス
                    </label>
                    <input
                        type="email"
                        id="username"
                        placeholder="大学メールアドレスを入力"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white w-full py-3 rounded-lg"
                >
                    認証メールを送信
                </button>
            </form>

            {/* Google認証 */}
            <div className="text-center">
                <p className="text-gray-600 mb-4">または</p>
                <a
                    href={googleOAuth2URL}
                    className="
                        bg-gray-200 text-gray-700 rounded-lg
                        w-full py-3
                        flex items-center justify-center space-x-2
                        hover:bg-gray-300 transition duration-200
                    "
                >
                    <i className="fab fa-google text-lg"></i>
                    <span>Googleでログイン</span>
                </a>
            </div>
        </>,
    );
});

export default app;
