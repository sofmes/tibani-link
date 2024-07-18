import { css } from "hono/css";
import { createRoute } from "honox/factory";
import { urls } from "../schema";

export default createRoute(async (c) => {
    const name = c.req.query("name") ?? "Hono";
    const result = await c.var.db.select().from(urls).all();

    return c.render(
        <div class="">
            <h1>Hello, {result}!</h1>
        </div>,
        { title: name }
    );
});
