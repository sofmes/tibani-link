import { type DrizzleD1Database } from "drizzle-orm/d1";
import {} from "hono";
import "typed-htmx";

type Head = {
    title?: string;
};

declare module "hono" {
    interface Env {
        Variables: {
            db: DrizzleD1Database;
        };
        Bindings: {
            DB: D1Database;
        };
    }
    interface ContextRenderer {
        (
            content: string | Promise<string>,
            head?: Head
        ): Response | Promise<Response>;
    }
}

declare module "hono/jsx" {
    namespace JSX {
        interface HTMLAttributes extends HtmxAttributes {}
    }
}
