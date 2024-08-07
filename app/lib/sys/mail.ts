import { Resend } from "resend";

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export async function sendAuthMail(mail: string, url: string) {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: mail,
        subject: "Tibani Linkの認証",
        html: `<p>Tibani Linkにログインするには、以下のリンクを開いてください。</p>
            <a href=${url}>${url}</a>`
    });
}
