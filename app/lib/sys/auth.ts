import { sign, verify } from "hono/jwt";

function time(): number {
    return Math.floor(Date.now() / 1000);
}

export class AuthManager {
    jwtSecret: string;

    constructor(public mailTokenExp: number, public tokenExp: number) {
        this.jwtSecret = import.meta.env.VITE_JWT_SECRET;
    }

    async createMailToken(email: string): Promise<string> {
        return await sign(
            {
                email,
                email_verified: false,
                exp: time() + this.mailTokenExp
            },
            this.jwtSecret
        );
    }

    async verifyMailToken(token: string): Promise<string | null> {
        try {
            return (await verify(token, this.jwtSecret)).email as string;
        } catch {
            return null;
        }
    }

    async createToken(email: string): Promise<string> {
        return await sign(
            {
                email,
                email_verified: true,
                exp: time() + this.tokenExp
            },
            this.jwtSecret
        );
    }

    verifyRequest(payload: { exp: number }): boolean {
        return payload.exp > time();
    }
}