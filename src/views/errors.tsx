import Back from "@/components/back";
import { FC } from "hono/jsx";

export const Error: FC = ({ children }) => {
    return (
        <>
            <p>{children}</p>
            <Back />
        </>
    );
};
