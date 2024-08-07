import { loginByGoogle } from "@/lib/login";
import { createRoute } from "honox/factory";

export default createRoute(async (c) => {
    const { code } = c.req.query();
    if (!code) {
        return c.text("Googleから渡されるはずのcodeがありません。", 400);
    }

    if (!(await loginByGoogle(code))) {
        return c.render(
            <p>
                このウェブサービスは千葉工業大学生にのみ提供を行っています。
                そのため、Googleでログインする場合、千葉工業大学のアカウントを使ってログインしてください。
            </p>
        );
    }

    return c.text("Google認証完了");
});
