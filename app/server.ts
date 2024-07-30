import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";
import { auth } from "./lib/middleware";
import { jwt } from "hono/jwt";

const app = createApp();

app.use(
    "/",
    jwt({
        secret: auth.jwtSecret
    })
);
showRoutes(app);

export default app;
