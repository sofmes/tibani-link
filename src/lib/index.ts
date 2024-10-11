import { AccessLogSetting, DataManager } from "./sys/data-manager";

import { OAuth2Client } from "google-auth-library";
import { AuthManager } from "./sys/auth";

export const auth = new AuthManager(300, 1209600);
export const googleOAuth2Client = new OAuth2Client(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    import.meta.env.VITE_GOOGLE_REDIRECT_URI,
);
export const googleOAuth2URL = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.email",
});

export enum AccessError {
    LoginRequiredForAccessLog,
    AccessIsLimited,
    NotFound,
}

export async function onAccess(
    ctx: {
        data: DataManager;
        token: string | null;
    },
    id: string,
): Promise<string | AccessError> {
    const urlData = await ctx.data.url.fetch(id);
    if (!urlData) return AccessError.NotFound;

    const email = ctx.token ? await auth.verifyToken(ctx.token) : undefined;

    // アクセスログの記録。
    if (urlData.accessLogSetting & AccessLogSetting.AccessCount) {
        if (!email) return AccessError.LoginRequiredForAccessLog;
        ctx.data.accessLog.add(id, email);
    }

    // アクセス制限。
    if (urlData.hasAccessLimitation && !email) {
        return AccessError.AccessIsLimited;
    }

    return urlData.url;
}
