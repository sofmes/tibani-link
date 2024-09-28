import { AccessLogSetting, DataManager } from "./sys/data-manager";
import { auth } from "./middleware";

export enum AccessError {
    LoginRequiredForAccessLog,
    AccessIsLimited,
    NotFound
}

export async function onAccess(
    ctx: {
        data: DataManager;
        token?: string;
    },
    id: string
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
