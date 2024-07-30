import { createRoute } from "honox/factory";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

export default createRoute(async (c) => {
    const params = new URLSearchParams({
        response_type: "code",
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
        scope: "https://www.googleapis.com/auth/userinfo.email",
        access_type: "offline"
    });
    return c.redirect(`${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`);
});
