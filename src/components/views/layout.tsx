import { HOST } from "@/lib";
import { FC, PropsWithChildren } from "hono/jsx";
import { JSX } from "hono/jsx/jsx-runtime";

const Logout: FC = () => (
    <a href="/_auth/logout" className="text-white sm:text-xl">
        ログアウト
    </a>
);

const Header: FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
    return (
        <header className="bg-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-6">
                <img
                    src="/static/tibani.png"
                    alt="Tibani"
                    className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                />
                <div className="text-3xl sm:text-5xl font-bold">{HOST}</div>
            </div>
            <div className="flex items-center space-x-6">
                {isLoggedIn ? <Logout /> : <></>}
                {/* 
                <button className="text-white text-2xl sm:text-3xl">
                    <i className="far fa-moon"></i>
                </button>*/}
            </div>
        </header>
    );
};

const Main: FC = (props) => {
    return (
        <main className="m-auto flex-grow py-10 w-screen">
            {props.children}
        </main>
    );
};

const Body: FC<PropsWithChildren<{ isLoggedIn: boolean }>> = (props) => {
    return (
        <body className="h-screen flex flex-col">
            <Header isLoggedIn={props.isLoggedIn} />
            <Main>{props.children}</Main>
        </body>
    );
};

type LayoutProps = { head?: JSX.Element; title: string; isLoggedIn: boolean };

const Layout: FC<PropsWithChildren<LayoutProps>> = (props) => {
    return (
        <html lang="ja">
            <head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <script src="https://unpkg.com/htmx.org@2.0.2"></script>
                <script src="https://unpkg.com/htmx-ext-path-params@2.0.2/path-params.js"></script>

                {import.meta.env.PROD ? (
                    <link href="/static/style.css" rel="stylesheet" />
                ) : (
                    <link href="/src/style.css" rel="stylesheet" />
                )}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                />
                <title>
                    {HOST} - {props.title}
                </title>

                {props.head}
            </head>

            <Body isLoggedIn={props.isLoggedIn}>{props.children}</Body>
        </html>
    );
};

export default Layout;
