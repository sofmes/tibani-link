import { googleOAuth2Client, googleOAuth2URL } from "@/lib/middleware";
import { drizzle } from "drizzle-orm/d1";
import { OAuth2Client } from "google-auth-library";
import { createRoute } from "honox/factory";

export default createRoute(async (c, next) => {
    c.set("db", drizzle(c.env.DB));
    c.set("googleOAuth2Client", googleOAuth2Client);
    c.set("googleOAuth2URL", googleOAuth2URL);
    await next();
});
