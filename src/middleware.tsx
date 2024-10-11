import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";

import { DataManager } from "./lib/sys/data-manager";
import { verifyToken } from "./lib/auth";
import { getSession } from "./cookie";

export type Env = {
    Variables: {
        db: DrizzleD1Database;
        data: DataManager;
        authorId: string | null;
    };
    Bindings: {
        DB: D1Database;
    };
};

export const middleware = createMiddleware<Env>(async (c, next) => {
    c.set("db", drizzle(c.env.DB));
    c.set("data", new DataManager(c.var.db));

    let token = getSession(c);
    if (token) {
        c.set("authorId", await verifyToken(token));
    } else {
        c.set("authorId", null);
    }

    await next();
});
