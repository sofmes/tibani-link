import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const REDIRECT_COOKIE = "redirect-uri-after-auth";

export function setRedirectUriAfterAuth(c: Context, uri: string | null) {
    if (uri) setCookie(c, REDIRECT_COOKIE, uri);
    else deleteCookie(c, REDIRECT_COOKIE);
}

export function takeRedirectUriAfterAuth(c: Context): string | undefined {
    const url = getCookie(c, REDIRECT_COOKIE);
    if (url) setRedirectUriAfterAuth(c, null);
    return url;
}

const SESSION_COOKIE = "session";

export function setSession(c: Context, token: string | null) {
    if (token) setCookie(c, SESSION_COOKIE, token);
    else deleteCookie(c, SESSION_COOKIE);
}

export function getSession(c: Context): string | null {
    return getCookie(c, SESSION_COOKIE) || null;
}
