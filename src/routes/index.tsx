import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { Env } from "@/middleware";
import { AccessError, onAccess } from "@/lib";
import { getSession, setRedirectUriAfterAuth } from "@/cookie";
import { AccessLogSetting, UrlData } from "@/lib/sys/data-manager";
import Dashboard from "@/components/dashboard";
import { Error } from "@/components/ui/errors";
import routes from "./auth";

const app = new Hono<Env>();
app.route("/_/auth", routes);

// ログインしなければ使えないようにするためのミドルウェア
app.use("/*", async (c, next) => {
    if (!c.get("authorId")) {
        return c.redirect("/_/auth");
    }

    await next();
});

// ダッシュボード
app.get("/", async (c) => {
    const authorId = c.get("authorId") as string;

    const page = c.req.param("page");
    const data = await c.var.data.url.fetchMultiple(
        authorId,
        page ? parseInt(page) : 1,
    );

    return c.render(<Dashboard data={data} />, { title: "Tibani Link" });
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
            return c.render(<Error>既にその短縮URLは存在します。</Error>);
        }

        await c.var.data.url.create(data.id, authorId, adjustFormData(data));

        c.status(201);
        return c.render(<Error>短縮URLを作成しました。</Error>);
    },
);

// 短縮URLリダイレクト
app.get("/:id", async (c) => {
    const result = await onAccess(
        {
            data: c.var.data,
            token: getSession(c),
        },
        c.req.param("id"),
    );

    const LOGIN_LINK = (
        <p>
            <a href="/_/auth">ここ</a>からログインを行ってください。
        </p>
    );

    let requireRedirect = false;
    let response = null;

    if (result == AccessError.AccessIsLimited) {
        requireRedirect = true;

        c.status(403);
        response = c.render(
            <p>
                この短縮URLは千葉工業大学生のみがアクセス可能です。
                <br />
                {LOGIN_LINK}
            </p>,
        );
    } else if (result == AccessError.LoginRequiredForAccessLog) {
        requireRedirect = true;

        response = c.render(
            <p>
                この短縮URLはアクセスログを記録するために
                千葉工業大学のメールアドレスによるログインが必要です。
                <br />
                {LOGIN_LINK}
            </p>,
        );
    } else if (result == AccessError.NotFound) {
        c.status(404);
        response = c.render(
            <>
                <h1>404 Not Found</h1>
                短縮URLのリダイレクト先が見つかりませんでした。
            </>,
        );
    }

    if (response) {
        if (requireRedirect) {
            setRedirectUriAfterAuth(c, c.req.url);
        }

        return response;
    }

    return c.redirect(result as string);
});

// 短縮URLの編集
app.patch("/:id", zValidator("form", urlFormDataObject), async (c) => {
    let { id } = c.req.param();

    const data = c.req.valid("form");
    await c.var.data.url.edit(id, adjustFormData(data));

    return c.render(<p>編集しました。</p>);
});

// 短縮URL削除
app.delete("/:id", async (c) => {
    let { id } = c.req.param();

    const email = c.get("authorId") as string;

    if (await c.var.data.delete(email, id)) {
        c.status(400);
        return c.render(<p>あなたの持つそのIDの短縮URLはありませんでした。</p>);
    } else {
        return c.render(<p>削除しました。</p>);
    }
});

export default app;
