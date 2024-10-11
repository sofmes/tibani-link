import { FC, PropsWithChildren } from "hono/jsx";

const Button: FC<PropsWithChildren<{ className: string }>> = ({
    className,
    children,
}) => {
    return (
        <button className={`${className} text-white px-4 py-2 rounded-lg`}>
            {children}
        </button>
    );
};

export default Button;
