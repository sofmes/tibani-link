import { DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "../schema";

export enum AccessLogSetting {
    AccessCount = 0,
    AccessUser = 1
}

class URLDataManager {
    constructor(private db: DrizzleD1Database) {}

    async create(
        id: string,
        url: string,
        authorId: string,
        hasAccessLimitation: boolean,
        accessLogSetting: AccessLogSetting
    ): Promise<void> {
        await this.db.insert(schema.url).values([
            {
                id,
                url,
                authorId,
                hasAccessLimitation,
                accessLogSetting
            }
        ]);
    }

    async deleteUrl(id: string): Promise<void> {
        await this.db.delete(schema.url).where(eq(schema.url.id, id));
    }

    async edit(
        id: string,
        data: {
            url?: string;
            hasAccessLimitation?: boolean;
            accessLogSetting?: AccessLogSetting;
        }
    ): Promise<void> {
        await this.db.update(schema.url).set(data).where(eq(schema.url.id, id));
    }
}

class AccessLogDataManager {
    constructor(private db: DrizzleD1Database) {}

    async fetchPage(
        page: number
    ): Promise<{ accessUserId: string | null; accessDate: Date }[]> {
        return await this.db
            .select({
                accessUserId: schema.accessLog.accessUserId,
                accessDate: schema.accessLog.accessDate
            })
            .from(schema.accessLog)
            .limit(30)
            .offset(30 * (page - 1))
            .all();
    }

    async add(urlId: string, userId?: string): Promise<void> {
        await this.db.insert(schema.accessLog).values({
            urlId,
            accessUserId: userId,
            accessDate: new Date()
        });
    }

    async deleteAccessLog(urlId: string): Promise<void> {
        await this.db
            .delete(schema.accessLog)
            .where(eq(schema.accessLog.urlId, urlId));
    }
}

export class DataManager {
    url: URLDataManager;
    accessLog: AccessLogDataManager;

    constructor(private db: DrizzleD1Database) {
        this.accessLog = new AccessLogDataManager(this.db);
        this.url = new URLDataManager(this.db);
    }

    async delete(urlId: string): Promise<void> {
        await Promise.all([
            this.url.deleteUrl(urlId),
            this.accessLog.deleteAccessLog(urlId)
        ]);
    }
}
