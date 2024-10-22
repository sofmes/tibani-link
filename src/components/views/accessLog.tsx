import { AccessLogSetting, AccessRecord } from "@/lib/data-manager";
import { buttonClassName } from "../ui";

const AccessLogTable = ({
    data,
    id,
    previousPage,
    nextPage,
}: {
    data: AccessRecord[];
    id: string;
    previousPage?: number;
    nextPage?: number;
}) => {
    return (
        <>
            <table class="w-full my-5">
                <tr>
                    <th scope="col" class="text-center">
                        アクセス日時
                    </th>
                    <th scope="col" class="text-center">
                        アクセスユーザー
                    </th>
                </tr>
                {data.map((record) => (
                    <tr>
                        <td class="text-center">
                            {record.accessDate.toLocaleString()}
                        </td>
                        <td class="text-center">{record.accessUserId}</td>
                    </tr>
                ))}
            </table>
            <Pagination
                id={id}
                previousPage={previousPage}
                nextPage={nextPage}
            />
        </>
    );
};

const PageButton = ({
    id,
    text,
    page,
}: { id: string; text: string; page: number }) => {
    return (
        <button
            type="button"
            class={`${buttonClassName} bg-gray-500`}
            hx-get={`/${id}/log?page=${page}`}
            hx-target={`#access-log-${id}`}
            hx-swap="outerHtml"
        >
            {text}
        </button>
    );
};

const Pagination = ({
    id,
    previousPage,
    nextPage,
}: {
    id: string;
    previousPage?: number;
    nextPage?: number;
}) => {
    return (
        <div class="flex justify-evenly">
            {previousPage ? (
                <PageButton id={id} text="前へ" page={previousPage} />
            ) : (
                <></>
            )}
            {nextPage ? (
                <PageButton id={id} text="次へ" page={nextPage} />
            ) : (
                <></>
            )}
        </div>
    );
};

const AccessLog = ({
    id,
    accessCount,
    accessLogSetting,
    data,
    previousPage,
    nextPage,
}: {
    id: string;
    accessLogSetting: AccessLogSetting;
    accessCount: number;
    data: AccessRecord[];
    previousPage?: number;
    nextPage?: number;
}) => {
    const hasAccessCount = accessLogSetting & AccessLogSetting.AccessCount;
    const hasAccessUser = accessLogSetting & AccessLogSetting.AccessUser;

    return (
        <div id={`access-log-${id}`}>
            <hr class="my-3" />
            <h1 class="text-3xl">アクセスログ</h1>
            {hasAccessCount ? `アクセス数：${accessCount}` : ""}

            {hasAccessUser ? (
                <AccessLogTable
                    data={data}
                    id={id}
                    previousPage={previousPage}
                    nextPage={nextPage}
                />
            ) : (
                <></>
            )}
        </div>
    );
};

export default AccessLog;
