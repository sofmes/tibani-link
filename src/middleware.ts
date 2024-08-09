import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";

import { auth } from "./lib/middleware";
import { jwt } from "hono/jwt";

export type Env = {
    Variables: {
        db: DrizzleD1Database;
    };
    Bindings: {
        DB: D1Database;
    };
};

export const middleware = createMiddleware<Env>(async (c, next) => {
    c.set("db", drizzle(c.env.DB));
    await next();
});
export const jwtMiddleware = jwt({
    secret: auth.jwtSecret
});
