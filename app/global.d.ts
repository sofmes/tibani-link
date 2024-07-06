import {} from "hono";
import "typed-htmx";

type Head = {
    title?: string;
};

declare module "hono" {
    interface Env {
        Variables: {};
        Bindings: {};
    }
    interface ContextRenderer {
        (content: string | Promise<string>, head?: Head):
            | Response
            | Promise<Response>;
    }
}

declare module "hono/jsx" {
    namespace JSX {
        interface HTMLAttributes extends HtmxAttributes {}
    }
}
