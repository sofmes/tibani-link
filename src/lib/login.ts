import { auth, googleOAuth2Client } from "./middleware";
import { sendAuthMail } from "./sys/mail";

function checkEmail(email: string): boolean {
    return email.endsWith(import.meta.env.VITE_EMAIL_SUFFIX);
}

/** Google認証後の処理をする。
 * これはGoogleから送られてきたコードを使ってGoogleユーザーの情報を取得する。
 * そして得られたメールアドレスが千葉工業大学のものかをチェックする。
 * 返り値はトークンで、もしも返り値が`null`であればメールが千葉工業大学のではなかったということ。
 */
export async function loginByGoogle(code: string): Promise<string | null> {
    const response = await googleOAuth2Client.getToken(code);
    if (!response.tokens.access_token)
        throw Error("GoogleからTokenを取得できませんでした。");

    const data = await googleOAuth2Client.getTokenInfo(
        response.tokens.access_token
    );
    if (!checkEmail(data.email!)) {
        return null;
    }

    return await auth.createToken(data.email!);
}

/** メールを使ってログインを開始する。
 * これを実行するとログインのためだけのメール用トークンが発行され、それを使った
 * 認証用のメールが送られる。
 * 返り値がもし`false`だった場合、サポート外のメールアドレス。（つまり、千葉工業大学のじゃない。）
 */
export async function loginByMail(
    email: string,
    baseUrl: string
): Promise<boolean> {
    if (!checkEmail(email)) {
        return false;
    }

    const params = new URLSearchParams({
        verifyToken: await auth.createMailToken(email)
    }).toString();
    await sendAuthMail(email, `${baseUrl}?${params}`);

    return true;
}

/** メールログイン時のメールにあった認証リンクを開いた後の処理。
 * メールに同梱していたURLのトークンを受け取り、そこから
 * 二週間使えるログイントークンを生成する。`null`の場合トークンが不適切。
 */
export async function loginVerifyByMail(token: string): Promise<string | null> {
    if (token) {
        const email = await auth.verifyMailToken(token);
        if (email) return await auth.createToken(email);
    }

    return null;
}
