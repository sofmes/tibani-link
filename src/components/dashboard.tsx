import { FC } from "hono/jsx";

import Button from "@/components/ui/button";
import Options from "@/components/ui/options";
import { UrlDataWithId } from "@/lib/sys/data-manager";

const Form: FC = () => {
    return (
        <form action="/" method="post">
            <div className="flex flex-col sm:flex-row mb-2">
                <input
                    type="url"
                    name="url"
                    placeholder="短縮したいURLを入力"
                    required
                    className="
                        flex-grow p-3 border border-gray-300
                        rounded-t-lg
                        sm:rounded-l-lg sm:rounded-tr-none sm:rounded-br-none
                    "
                />
                <input
                    type="text"
                    pattern="^[0-9A-Za-z]+$"
                    name="id"
                    placeholder="短縮後（半角英数字）"
                    className="p-3 border border-gray-300"
                />

                <button
                    type="submit"
                    className="
                        bg-gray-300 text-gray-800 px-4 py-3
                        rounded-b-lg
                        sm:rounded-r-lg sm:rounded-bl-none sm:rounded-tl-none
                    "
                >
                    短縮
                </button>
            </div>

            <div
                className="
                    flex flex-col sm:flex-row justify-evenly
                    my-4 space-y-2 sm:space-y-0 sm:space-x-6
                "
            >
                <Options />
            </div>
        </form>
    );
};

const LinkItem: FC<{ url: string; shortenedUrl: string }> = ({
    url,
    shortenedUrl,
}) => {
    return (
        <li
            className="
                flex flex-col sm:flex-row justify-between
                items-start sm:items-center p-4 space-x-2

                border border-gray-300 rounded-lg space-y-2 sm:space-y-0
            "
        >
            <span className="truncate w-3/5">{url}</span>
            <a href={shortenedUrl} className="w-1/5 text-blue-600 truncate">
                {shortenedUrl}
            </a>

            <div className="flex justify-evenly w-1/5 space-x-2">
                <Button className="bg-green-500">編集</Button>
                <Button className="bg-red-500">削除</Button>
            </div>
        </li>
    );
};

const LinkList: FC<{ data: UrlDataWithId[] }> = async ({ data }) => {
    return (
        <ul className="space-y-4">
            {data.map((d) => (
                <LinkItem
                    url={d.url}
                    shortenedUrl={`https://tibani.link/${d.id}`}
                />
            ))}
        </ul>
    );
};

const Dashboard: FC<{ data: UrlDataWithId[] }> = ({ data }) => {
    return (
        <div
            className="
                bg-white py-8 px-4 rounded-lg shadow-lg
                max-w-3xl w-full mx-2 sm:mx-auto
            "
        >
            <Form />
            <LinkList data={data} />
        </div>
    );
};

export default Dashboard;
