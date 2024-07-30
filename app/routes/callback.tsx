import { createRoute } from "honox/factory";

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export default createRoute(async (c) => {
    const url = new URL(c.req.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return c.text("Authorization code not found", 400);
    }

    const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            code: code,
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
            redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        })
    });

    const tokenData: { access_token: string } = await tokenResponse.json();

    if (!tokenData.access_token) {
        return c.text("Failed to obtain access token", 400);
    }
    return c.text("User account created successfully.");
});
