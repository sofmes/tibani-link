import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { Env } from "@/middleware";
import { AccessError, onAccess } from "@/lib";
import { getSession, setRedirectUriAfterAuth } from "@/cookie";
import { verifyToken } from "@/lib/auth";
import { AccessLogSetting } from "@/lib/sys/data-manager";

const app = new Hono<Env>();

app.get("/", async (c) => {
    if (!getSession(c)) return c.redirect("/_/auth");

    return c.render(
        <div hx-ext="path-params">
            <h1>Tibani Link</h1>

            <form>
                <label for="url">URL: </label>
                <input type="url" name="url" />
                <label for="id">短縮後：</label>
                tibani.link/
                <input type="text" name="id" />
                <button type="submit">作成</button>
            </form>
        </div>,
        { title: "Tibani Link" }
    );
});

const AccessLogSettingEnum = z.nativeEnum(AccessLogSetting);
type AccessLogSettingEnum = z.infer<typeof AccessLogSettingEnum>;

app.post(
    "/",
    zValidator(
        "form",
        z.object({
            id: z
                .string()
                .min(1)
                .max(4096 - "https://tibani.link/".length),
            url: z.string().max(4096),
            hasAccessLimitation: z.boolean(),
            accessLogSetting: z
                .number()
                .max(Object.keys(AccessLogSetting).length / 2)
        })
    ),
    async (c) => {
        let token = getSession(c);
        if (!token) {
            c.status(403);
            return c.render(
                <p>ログインしていないので短縮URLを作成できません。</p>
            );
        }
        let email = await verifyToken(token);
        if (!email) {
            c.status(403);
            return c.render(
                <p>セッションが切れています。もう一度ログインしてください。</p>
            );
        }

        const data = c.req.valid("form");
        if (!(await c.var.data.url.fetch(data.id))) {
            c.status(400);
            return c.render(<p>既にその短縮URLは存在します。</p>);
        }

        await c.var.data.url.create(data.id, email, {
            url: data.url,
            hasAccessLimitation: data.hasAccessLimitation,
            accessLogSetting: AccessLogSettingEnum.parse(data.accessLogSetting)
        });

        c.status(201);
        return c.render(<p>成功しました！</p>);
    }
);

app.get("/:id", async (c) => {
    const result = await onAccess(
        {
            data: c.var.data,
            token: getSession(c)
        },
        c.req.param("id")
    );

    const LOGIN_LINK = (
        <>
            <a href="/_/auth">ここ</a>からログインを行ってください。
        </>
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
            </p>
        );
    } else if (result == AccessError.LoginRequiredForAccessLog) {
        requireRedirect = true;

        response = c.render(
            <p>
                この短縮URLはアクセスログを記録するために
                千葉工業大学のメールアドレスによるログインが必要です。
                <br />
                {LOGIN_LINK}
            </p>
        );
    } else if (result == AccessError.NotFound) {
        c.status(404);
        response = c.render(
            <>
                <h1>404 Not Found</h1>
                短縮URLのリダイレクト先が見つかりませんでした。
            </>
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

export default app;
