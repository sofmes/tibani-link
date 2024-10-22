import { googleOAuth2URL } from "@/lib/login";
import { FC } from "hono/jsx";

const Login = ({ title }: { title?: string }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">
                {title || "アクセスには認証が必要です。"}
            </h2>

            <div className="text-center">
                <p>
                    以下のボタンから、千葉工業大学でのGoogleアカウントでログインしてください。
                </p>
                <a
                    href={googleOAuth2URL}
                    className="
                        bg-gray-200 text-gray-700 rounded-lg
                        w-fit px-4 py-3 mx-auto my-3
                        flex items-center justify-center space-x-2
                        hover:bg-gray-300 transition duration-200
                    "
                >
                    <i className="fab fa-google text-lg"></i>
                    <span>Googleでログイン</span>
                </a>
            </div>
        </div>
    );
};

export default Login;
