import { AccessLogSetting, DataManager } from "./data-manager";

export const HOST = import.meta.env.VITE_HOST;
export const ORIGIN = import.meta.env.VITE_ORIGIN;

export enum AccessError {
    LoginRequiredForAccessLog,
    AccessIsLimited,
    NotFound,
}

export async function onAccess(
    ctx: {
        data: DataManager;
        userId: string | null;
    },
    id: string,
): Promise<string | AccessError> {
    const urlData = await ctx.data.url.fetch(id);
    if (!urlData) return AccessError.NotFound;

    const userId = ctx.userId || undefined;

    // アクセスログの記録。
    if (urlData.accessLogSetting & AccessLogSetting.AccessCount) {
        if (!userId && urlData.accessLogSetting & AccessLogSetting.AccessUser)
            return AccessError.LoginRequiredForAccessLog;
        await ctx.data.accessLog.add(id, userId);
    }

    // アクセス制限。
    if (urlData.hasAccessLimitation && !userId) {
        return AccessError.AccessIsLimited;
    }

    return urlData.url;
}
