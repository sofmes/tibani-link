import { FC, PropsWithChildren } from "hono/jsx";

type CheckBoxProps = { name: string; id: string };

const CheckBox: FC<PropsWithChildren<CheckBoxProps>> = ({
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

const Options: FC = () => {
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

export default Options;
