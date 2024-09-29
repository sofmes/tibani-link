import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

import routes from "./routes";
import { Env, middleware } from "./middleware";
import Layout from "./components/layout";

const app = new Hono<Env>();

app.use(middleware);

app.all(
    "*",
    jsxRenderer(({ children, title, head }) => {
        return (
            <Layout title={title || "Tibani Link"} head={head || <></>}>
                {children}
            </Layout>
        );
    }),
);

app.route("/", routes);

app.get("/auth", async (c) => {
    return c.render(
        <div className="flex flex-col min-h-screen bg-gray-100">
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
        { title: "認証 - tibani.link" },
    );
});

export default app;
