import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

import routes from "./routes";
import { Env, middleware } from "./middleware";
import Layout from "./components/layout";
import { getSession } from "./cookie";

const app = new Hono<Env>();

app.use(middleware);

app.all(
    "*",
    jsxRenderer(({ children, title, head }, c) => {
        return (
            <Layout
                isLoggedIn={getSession(c) != null}
                title={title || "Tibani Link"}
                head={head || <></>}
            >
                {children}
            </Layout>
        );
    }),
);

app.route("/", routes);

export default app;
