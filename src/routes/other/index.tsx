import { Hono } from "hono";
import { Env } from "@/middleware";

import authRoute from "./auth";

const app = new Hono<Env>();

app.route("/auth", authRoute);

export default app;
