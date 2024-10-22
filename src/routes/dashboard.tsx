import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { z } from "zod";

import AccessLog from "@/components/views/accessLog";
import Dashboard from "@/components/views/dashboard";
import { AccessLogSetting, UrlData } from "@/lib/data-manager";
import { type Env } from "@/index";
import Layout from "@/components/views/layout";

const app = new Hono<Env>();

// ログインしなければ使えないようにするためのミドルウェア
app.use("/", async (c: Context, next) => {
    if (!c.get("authorId")) {
        return c.redirect("/_/auth");
    }

    await next();
});

// ダッシュボード画面
app.get("/", async (c) => {
    const authorId = c.get("authorId") as string;

    const page = c.req.param("page");
    const data = await c.var.data.url.fetchMultiple(
        authorId,
        page ? parseInt(page) : 1,
    );

    return c.render(
        <Layout isLoggedIn={c.get("isLoggedIn")} title="ダッシュボード">
            <Dashboard data={data} />
        </Layout>,
    );
});

// 短縮URL作成
const urlFormData = {
    url: z.string().url(),
    hasAccessLimitation: z.string().optional(),
    accessLogCount: z.string().optional(),
    accessLogUser: z.string().optional(),
};
const urlFormDataObject = z.object(urlFormData);
type UrlFormData = z.infer<typeof urlFormDataObject>;

function adjustFormData(data: UrlFormData): UrlData {
    let accessLogSetting = AccessLogSetting.None;
    if (data.accessLogCount && data.accessLogCount.includes("count"))
        accessLogSetting |= AccessLogSetting.AccessCount;
    if (data.accessLogUser && data.accessLogUser.includes("user"))
        accessLogSetting |= AccessLogSetting.AccessUser;

    return {
        url: data.url,
        hasAccessLimitation: data.hasAccessLimitation != null,
        accessLogSetting,
    };
}

app.post(
    "/",
    zValidator(
        "form",
        z.object({
            id: z
                .string()
                .min(1)
                .max(4096 - "https://tibani.link/".length),
            ...urlFormData,
        }),
    ),
    async (c) => {
        const authorId = c.get("authorId") as string;

        const data = c.req.valid("form");
        if (await c.var.data.url.fetch(data.id)) {
            c.status(400);
            return c.render("既にその短縮URLは存在します。");
        }

        await c.var.data.url.create(data.id, authorId, adjustFormData(data));

        c.status(201);
        return c.render("短縮URLを作成しました。");
    },
);

// 短縮URLの編集
app.patch("/:id", zValidator("form", urlFormDataObject), async (c) => {
    let { id } = c.req.param();

    const data = c.req.valid("form");
    await c.var.data.url.edit(id, adjustFormData(data));

    return c.render("編集しました。");
});

// 短縮URL削除
app.delete("/:id", async (c) => {
    let { id } = c.req.param();

    const email = c.get("authorId") as string;

    if (await c.var.data.delete(email, id)) {
        return c.render("削除しました。");
    } else {
        c.status(400);
        return c.render("あなたの持つそのIDの短縮URLはありませんでした。");
    }
});

// アクセスログ
app.get("/:id/log", async (c) => {
    let { id } = c.req.param();
    let pageRaw = c.req.query("page");
    let page = pageRaw ? parseInt(pageRaw) : 1;

    const limit = 10;
    const data = await c.var.data.accessLog.fetchPage(id, page, limit);
    const nextPageLength = await c.var.data.accessLog.countPage(
        id,
        page + 1,
        limit,
    );
    const count = await c.var.data.accessLog.fetchAccessCount(id);

    return c.render(
        <AccessLog
            id={id}
            accessCount={count}
            data={data}
            previousPage={page == 1 ? undefined : page - 1}
            nextPage={nextPageLength ? page + 1 : undefined}
        />,
    );
});

export default app;