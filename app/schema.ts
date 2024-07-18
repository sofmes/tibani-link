import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const urls = sqliteTable("urls", {
    id: text("id").notNull().primaryKey(),
    authorId: text("author_id").notNull(),
    url: text("url").notNull(),
    hasAccessLimitation: integer("has_access_limitation", {
        mode: "boolean"
    }).notNull(),
    accessLogSetting: integer("acceess_log_setting").notNull(),
    accessLogId: integer("access_log_id").notNull()
});

export const accessLogs = sqliteTable("access_logs", {
    id: integer("access_log_id").notNull().primaryKey(),
    accessUserId: text("access_user_id"),
    accessDate: integer("access_date", { mode: "timestamp" }).notNull()
});
