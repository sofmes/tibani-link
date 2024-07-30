/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_RESEND_API_KEY: string;
    VITE_JWT_SECRET: string;
    VITE_GOOGLE_CLIENT_ID: string;
    VITE_GOOGLE_CLIENT_SECRET: string;
    VITE_GOOGLE_REDIRECT_URI: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}
