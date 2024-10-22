import { googleOAuth2URL } from "@/lib/login";
import { FC } from "hono/jsx";

const Login: FC = () => {
    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-center">
                アクセスには認証が必要です
            </h2>

            <div className="text-center">
                <p className="text-gray-600 mb-4">または</p>
                <a
                    href={googleOAuth2URL}
                    className="
                        bg-gray-200 text-gray-700 rounded-lg
                        w-full py-3
                        flex items-center justify-center space-x-2
                        hover:bg-gray-300 transition duration-200
                    "
                >
                    <i className="fab fa-google text-lg"></i>
                    <span>Googleでログイン</span>
                </a>
            </div>
        </>
    );
};

export default Login;
