import { Hono } from "hono";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";

import routes from "./routes";
import { getSession } from "./cookie";
import { DataManager } from "./lib/data-manager";
import { verifyToken } from "./lib/login";

export type Env = {
    Variables: {
        db: DrizzleD1Database;
        data: DataManager;
        authorId: string | null;
        isLoggedIn: boolean;
    };
    Bindings: {
        DB: D1Database;
    };
};

const app = new Hono<Env>();

app.use(async (c, next) => {
    c.set("db", drizzle(c.env.DB));
    c.set("data", new DataManager(c.var.db));

    let token = getSession(c);
    if (token) {
        c.set("authorId", await verifyToken(token));
        c.set("isLoggedIn", true);
    } else {
        c.set("authorId", null);
        c.set("isLoggedIn", false);
    }

    await next();
});

app.route("/", routes);

export default app;
