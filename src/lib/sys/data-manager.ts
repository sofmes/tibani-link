import { DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "../../schema";

export enum AccessLogSetting {
    None = 0,
    AccessCount = 1 << 0,
    AccessUser = 1 << 1
}

interface UrlData {
    url: string;
    hasAccessLimitation: boolean;
    accessLogSetting: AccessLogSetting;
}

interface UrlDataWithAuthor extends UrlData {
    authorId: string;
}

interface UrlDataWithId extends UrlData {
    id: string;
}

class URLDataManager {
    constructor(private db: DrizzleD1Database) {}

    async create(id: string, authorId: string, data: UrlData): Promise<void> {
        await this.db.insert(schema.url).values([
            {
                id,
                authorId,
                ...data
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

    async fetch(id: string): Promise<UrlData | undefined> {
        return await this.db
            .select({
                url: schema.url.url,
                hasAccessLimitation: schema.url.hasAccessLimitation,
                accessLogSetting: schema.url.accessLogSetting
            })
            .from(schema.url)
            .where(eq(schema.url.id, id))
            .limit(1)
            .get();
    }

    async fetchMultiple(
        authorId: string,
        page: number
    ): Promise<UrlDataWithId[]> {
        const results = await this.db
            .select({
                id: schema.url.id,
                url: schema.url.url,
                hasAccessLimitation: schema.url.hasAccessLimitation,
                accessLogSetting: schema.url.accessLogSetting
            })
            .from(schema.url)
            .where(eq(schema.url.authorId, authorId))
            .limit(10)
            .offset(10 * (page - 1))
            .all();

        const parsed = [];
        for (const result of results) {
            parsed.push({
                ...result,
                accessLogSetting: result.accessLogSetting as number
            });
        }

        return parsed;
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
