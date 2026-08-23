import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const contentItems = sqliteTable(
  "content_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    course: text("course").notNull(),
    chapter: text("chapter").notNull(),
    chapterNumber: integer("chapter_number").notNull().default(1),
    resourceNumber: integer("resource_number").notNull().default(1),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    contentType: text("content_type").notNull(),
    language: text("language").notNull().default("Hindi + English"),
    accessLevel: text("access_level").notNull().default("free"),
    status: text("status").notNull().default("draft"),
    externalUrl: text("external_url"),
    objectKey: text("object_key"),
    originalFileName: text("original_file_name"),
    mimeType: text("mime_type"),
    fileSize: integer("file_size"),
    scheduledAt: text("scheduled_at"),
    downloadAllowed: integer("download_allowed", { mode: "boolean" }).notNull().default(true),
    createdBy: text("created_by").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("content_course_idx").on(table.course),
    index("content_course_chapter_idx").on(table.course, table.chapterNumber),
    index("content_status_idx").on(table.status),
    index("content_type_idx").on(table.contentType),
  ],
);

export const enrollments = sqliteTable(
  "enrollments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    course: text("course").notNull(),
    status: text("status").notNull().default("active"),
    createdBy: text("created_by").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("enrollment_email_course_idx").on(table.email, table.course),
  ],
);

export const progress = sqliteTable(
  "student_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    contentId: integer("content_id").notNull(),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("progress_email_content_idx").on(table.email, table.contentId),
  ],
);
