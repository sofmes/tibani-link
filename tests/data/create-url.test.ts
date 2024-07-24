import { AccessLogSetting } from "../../app/lib/data-manager";
import { test } from "./index";

test("データベースに対する短縮URLの作成", async ({ data }) => {
    await data.url.create(
        "aaa",
        "https://youtu.be/dQw4w9WgXcQ?si=u92dKHPdQ3BW-DV0",
        "tasuren@outlook.jp",
        true,
        AccessLogSetting.None
    );

    console.log(await data.url.fetch("tasuren@outlook.jp", 10));
});
