import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

import routes from "./routes/other";
import { Env, middleware } from "./middleware";

const app = new Hono<Env>();

app.use(middleware);
app.route("/", routes);

app.get(
    "/*",
    jsxRenderer(({ children, title, head }) => {
        return (
            <html lang="ja">
                <head>
                    <meta charset="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    {head}

                    <script src="https://unpkg.com/htmx.org@2.0.2"></script>
                    <script src="https://unpkg.com/htmx-ext-path-params@2.0.2/path-params.js"></script>

                    {import.meta.env.PROD ? (
                        <>
                            <link href="/static/style.css" rel="stylesheet" />
                        </>
                    ) : (
                        <>
                            <link href="/src/style.css" rel="stylesheet" />
                        </>
                    )}
                    <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                    />
                    <title>{title}</title>
                </head>
                <body>{children}</body>
            </html>
        );
    })
);

const Header = () => {
    return (
        <header className="bg-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-6">
                <img
                    src="/static/tibani.png"
                    alt="tibani"
                    className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                />
                <div className="text-3xl sm:text-5xl font-bold">
                    tibani.link
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <button className="text-white sm:text-xl">ログイン</button>
                <button className="text-white text-2xl sm:text-3xl">
                    <i className="far fa-moon"></i>
                </button>
            </div>
        </header>
    );
};

app.get("/", async (c) => {
    return c.render(
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />

            {/* メインコンテンツ */}
            <main className="flex justify-center items-center flex-grow">
                <div className="bg-white py-8 px-4 rounded-lg shadow-lg max-w-3xl w-full mx-2 sm:mx-auto">
                    {/* URL短縮部分 */}
                    <div className="flex flex-col sm:flex-row mb-2">
                        <input
                            type="text"
                            placeholder="短縮したいURLを入力"
                            className="flex-grow p-3 border border-gray-300 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none sm:rounded-br-none"
                        />
                        <button className="bg-gray-300 text-gray-800 px-4 py-3 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none sm:rounded-tl-none">
                            短縮
                        </button>
                    </div>

                    {/* チェックボックスなど */}
                    <div className="flex flex-col sm:flex-row mb-8 space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="restrict-access"
                                className="mr-2"
                            />
                            <label htmlFor="restrict-access">
                                アクセス制限をかける
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="log-access"
                                className="mr-2"
                            />
                            <label htmlFor="log-access">
                                アクセスを記録する
                            </label>
                        </div>
                    </div>

                    {/* リンクリスト部分 */}
                    <ul className="space-y-4">
                        <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-300 rounded-lg space-y-2 sm:space-y-0">
                            <span className="truncate">
                                https://example.com/
                            </span>
                            <a
                                href="https://tibani.link/aaaaaa"
                                className="text-blue-600 truncate"
                            >
                                https://tibani.link/aaaaaa
                            </a>
                            <div className="flex space-x-2">
                                <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                                    編集
                                </button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                                    削除
                                </button>
                            </div>
                        </li>
                        <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-300 rounded-lg space-y-2 sm:space-y-0">
                            <span className="truncate">
                                https://example.com/
                            </span>
                            <a
                                href="https://tibani.link/aaaa123"
                                className="text-blue-600 truncate"
                            >
                                https://tibani.link/aaaa123
                            </a>
                            <div className="flex space-x-2">
                                <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                                    編集
                                </button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                                    削除
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </main>
        </div>,
        { title: "CIT専用 URL短縮サービス tibani.link" }
    );
});

app.get("/auth", async (c) => {
    return c.render(
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />

            {/* メインコンテンツ */}
            <main className="flex justify-center items-center flex-grow">
                <div className="bg-white py-8 px-4 rounded-lg shadow-lg max-w-md w-full mx-2 sm:mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        アクセスには認証が必要です
                    </h2>

                    {/* メール認証 */}
                    <form className="space-y-4 mb-6">
                        <div>
                            <label htmlFor="username" className="block mb-1">
                                大学メールアドレス
                            </label>
                            <input
                                type="email"
                                id="username"
                                placeholder="大学メールアドレスを入力"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white w-full py-3 rounded-lg"
                        >
                            認証メールを送信
                        </button>
                    </form>

                    {/* Google認証 */}
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">または</p>
                        <button className="bg-gray-200 text-gray-700 w-full py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-300 transition duration-200">
                            <i className="fab fa-google text-lg"></i>
                            <span>Googleでログイン</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>,
        { title: "認証 - tibani.link" }
    );
});

app.route("/_/", routes);

export default app;
