import { createRoute } from "honox/factory";

export default createRoute(async (c) => {
    return c.render(
        <div>
            <form action="auth/mail" method="POST">
                <label for="email">メール：</label>
                <input type="email" name="email" id="email" required />
                <button type="submit">メールでログイン</button>
            </form>
            <a href={c.var.googleOAuth2URL}>Googleでログイン</a>
        </div>
    );
});
