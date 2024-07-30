import { z } from "zod";

const zVar = z.string().min(1);
export const zEnv = z.object({
    RESEND_API_KEY: zVar,
    JWT_SECRET: zVar,
    GOOGLE_CLIENT_ID: zVar,
    GOOGLE_CLIENT_SECRET: zVar,
    GOOGLE_REDIRECT_URI: zVar
});

const result = zEnv.safeParse(import.meta.env);
if (!result.success) {
    throw `env type is invalid\n${result.error.errors
        .map((v) => `${v.message}: env.${v.path[0]}`)
        .join("\n")}`;
}

export default result.data;
