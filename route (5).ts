import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { ensureDatabase } from "../../../db/bootstrap";
import { getDb } from "../../../db";
import { progress } from "../../../db/schema";

export async function POST(request: Request) {
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  await ensureDatabase();
  const payload = (await request.json()) as { contentId?: number; completed?: boolean };
  if (!Number.isInteger(payload.contentId) || typeof payload.completed !== "boolean") {
    return Response.json({ error: "Invalid progress update." }, { status: 400 });
  }
  const email = user.email.toLowerCase();
  const db = await getDb();
  await db
    .insert(progress)
    .values({ email, contentId: payload.contentId!, completed: payload.completed })
    .onConflictDoUpdate({
      target: [progress.email, progress.contentId],
      set: { completed: payload.completed, updatedAt: new Date().toISOString() },
    });
  const [row] = await db.select().from(progress).where(and(eq(progress.email, email), eq(progress.contentId, payload.contentId!))).limit(1);
  return Response.json({ progress: row });
}
