import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuthMail(mail: string, url: string) {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: mail,
        subject: "Tibani Linkの認証",
        html: `<p>Tibani Linkにログインするには、以下のリンクを開いてください。</p>
            <a href=${url}>${url}</a>`
    });
}
