import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const url = sqliteTable("url", {
    id: text("id").notNull().primaryKey(),
    authorId: text("author_id").notNull(),
    url: text("url").notNull(),
    hasAccessLimitation: integer("has_access_limitation", {
        mode: "boolean"
    }).notNull(),
    accessLogSetting: integer("acceess_log_setting").notNull()
});

export const accessLog = sqliteTable("access_log", {
    urlId: text("url_id").notNull(),
    accessUserId: text("access_user_id"),
    accessDate: integer("access_date", { mode: "timestamp" }).notNull()
});
