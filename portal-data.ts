import { and, asc, desc, eq } from "drizzle-orm";
import { ensureDatabase } from "../db/bootstrap";
import { getDb } from "../db";
import { contentItems, enrollments, progress } from "../db/schema";

export async function getPublishedContent() {
  await ensureDatabase();
  const db = await getDb();
  return db
    .select()
    .from(contentItems)
    .where(eq(contentItems.status, "published"))
    .orderBy(
      asc(contentItems.course),
      asc(contentItems.chapterNumber),
      asc(contentItems.chapter),
      asc(contentItems.resourceNumber),
      asc(contentItems.createdAt),
    );
}

export async function getStudentPortalData(email: string) {
  await ensureDatabase();
  const normalizedEmail = email.toLowerCase();
  const db = await getDb();
  const [items, studentEnrollments, studentProgress] = await Promise.all([
    getPublishedContent(),
    db.select().from(enrollments).where(and(eq(enrollments.email, normalizedEmail), eq(enrollments.status, "active"))),
    db.select().from(progress).where(eq(progress.email, normalizedEmail)),
  ]);
  return { items, enrollments: studentEnrollments, progress: studentProgress };
}

export async function getAdminPortalData() {
  await ensureDatabase();
  const db = await getDb();
  const [items, students] = await Promise.all([
    db.select().from(contentItems).orderBy(desc(contentItems.createdAt)),
    db.select().from(enrollments).orderBy(desc(enrollments.createdAt)),
  ]);
  return { items, students };
}
