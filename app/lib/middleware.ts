import { OAuth2Client } from "google-auth-library";
import { AuthManager } from "./sys/auth";

export const auth = new AuthManager(300, 1209600);
export const googleOAuth2Client = new OAuth2Client(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    import.meta.env.VITE_GOOGLE_REDIRECT_URI
);
export const googleOAuth2URL = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.email"
});
