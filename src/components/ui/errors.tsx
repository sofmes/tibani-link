import Back from "@/components/ui/back";
import { FC } from "hono/jsx";

export const Error: FC = ({ children }) => {
    return (
        <>
            <p>{children}</p>
            <Back />
        </>
    );
};
