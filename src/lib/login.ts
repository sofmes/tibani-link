import { OAuth2Client } from "google-auth-library";

import { auth } from "./auth";

function checkEmail(email: string): boolean {
    return email.endsWith(import.meta.env.VITE_EMAIL_SUFFIX);
}

export async function verifyToken(token: string): Promise<string | null> {
    return await auth.verifyToken(token);
}

export const googleOAuth2Client = new OAuth2Client(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    import.meta.env.VITE_GOOGLE_REDIRECT_URI,
);
export const googleOAuth2URL = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.email",
});

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
        response.tokens.access_token,
    );
    if (!checkEmail(data.email!)) {
        return null;
    }

    return await auth.createToken(data.email!);
}
