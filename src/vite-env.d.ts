/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_RESEND_API_KEY: string;
    VITE_JWT_SECRET: string;
    VITE_GOOGLE_CLIENT_ID: string;
    VITE_GOOGLE_CLIENT_SECRET: string;
    VITE_GOOGLE_REDIRECT_URI: string;
    VITE_EMAIL_SUFFIX: string;
    VITE_ORIGIN: string;
    VITE_HOST: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}
