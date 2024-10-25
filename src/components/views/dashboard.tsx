import { FC, PropsWithChildren } from "hono/jsx";

import { buttonClassName } from "@/components/ui";
import { AccessLogSetting, UrlDataWithId } from "@/lib/data-manager";
import { ORIGIN } from "@/lib";

// 短縮URLのオプション
const CheckBox: FC<PropsWithChildren<{ name: string; id: string }>> = ({
    name,
    id,
    children,
}) => {
    return (
        <>
            <input
                type="checkbox"
                name={name}
                value={id}
                id={id}
                className="mr-2"
            />
            <label for={id}>{children}</label>
        </>
    );
};

export const Options: FC = () => {
    return (
        <>
            <div>
                <CheckBox name="hasAccessLimitation" id="access-limitation">
                    千葉工大生に限定公開
                </CheckBox>
            </div>

            <div>
                <CheckBox name="accessLogCount" id="count">
                    アクセス数を記録する
                </CheckBox>
            </div>

            <div>
                <CheckBox name="accessLogUser" id="user">
                    アクセスユーザーを記録する
                </CheckBox>
            </div>
        </>
    );
};

const Form = () => {
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

const LinkItemButtons = ({
    id,
    accessLogSetting,
}: { id: string; accessLogSetting: AccessLogSetting }) => {
    const hasNotLog = accessLogSetting == AccessLogSetting.None;
    const justify = hasNotLog ? "justify-evenly" : "justify-evenly";

    return (
        <div class={`flex ${justify} space-x-2`}>
            <button
                type="button"
                class={`${buttonClassName} bg-green-500`}
                hx-get={`/${id}/log`}
                hx-target={`#access-log-container-${id}`}
                hidden={hasNotLog}
            >
                ログ
            </button>

            <button
                hx-delete={`/${id}`}
                hx-target={`#link-${id}`}
                hx-swap="delete"
                type="button"
                class={`${buttonClassName} bg-red-500`}
            >
                削除
            </button>
        </div>
    );
};

const LinkItem = ({
    url,
    id,
    accessLogSetting,
}: { url: string; id: string; accessLogSetting: AccessLogSetting }) => {
    const shortenedUrl = `${ORIGIN}/${id}`;

    return (
        <li id={`link-${id}`} className="p-4 border border-gray-300 rounded-lg">
            <div
                className="
                    flex flex-col sm:flex-row 
                    justify-between items-start sm:items-center
                    space-x-2 space-y-2 sm:space-y-0
                "
            >
                <span className="truncate w-3/5">{url}</span>
                <a href={shortenedUrl} className="w-1/5 text-blue-600 truncate">
                    {id}
                </a>

                <div className="w-2/5">
                    <LinkItemButtons
                        id={id}
                        accessLogSetting={accessLogSetting}
                    />
                </div>
            </div>

            <div id={`access-log-container-${id}`}></div>
        </li>
    );
};

const LinkList = async ({ data }: { data: UrlDataWithId[] }) => {
    return (
        <ul className="space-y-4">
            {data.map((d) => (
                <LinkItem
                    url={d.url}
                    id={d.id}
                    accessLogSetting={d.accessLogSetting}
                />
            ))}
        </ul>
    );
};

const Dashboard = ({ data }: { data: UrlDataWithId[] }) => {
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
