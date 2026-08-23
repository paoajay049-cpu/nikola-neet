import { and, eq } from "drizzle-orm";
import { getAdminUser } from "../../admin-auth";
import { getChatGPTUser } from "../../chatgpt-auth";
import { ensureDatabase } from "../../../db/bootstrap";
import { getDb } from "../../../db";
import { contentItems, enrollments } from "../../../db/schema";

export async function GET(request: Request) {
  await ensureDatabase();
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return new Response("Invalid lecture", { status: 400 });

  const db = await getDb();
  const [item] = await db.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
  if (!item || !["live", "video"].includes(item.contentType)) return new Response("Lecture not found", { status: 404 });
  const admin = await getAdminUser();
  if (item.status !== "published" && !admin) return new Response("Lecture not found", { status: 404 });

  if (item.accessLevel === "paid" && !admin) {
    const user = await getChatGPTUser();
    if (!user) return Response.redirect(new URL(`/signin-with-chatgpt?return_to=${encodeURIComponent(`/api/watch?id=${id}`)}`, request.url));
    const [enrollment] = await db.select().from(enrollments).where(and(
      eq(enrollments.email, user.email.toLowerCase()),
      eq(enrollments.course, item.course),
      eq(enrollments.status, "active"),
    )).limit(1);
    if (!enrollment) return new Response("This lecture requires course enrollment.", { status: 403 });
  }

  if (item.externalUrl) return Response.redirect(item.externalUrl, 302);
  if (!item.objectKey) return new Response("Video is unavailable", { status: 404 });

  const { env } = await import("cloudflare:workers");
  const head = await env.BUCKET.head(item.objectKey);
  if (!head) return new Response("Video file not found", { status: 404 });
  const range = parseRange(request.headers.get("Range"), head.size);
  const object = await env.BUCKET.get(item.objectKey, range ? { range: { offset: range.start, length: range.length } } : undefined);
  if (!object) return new Response("Video file not found", { status: 404 });
  const headers = new Headers({
    "Content-Type": item.mimeType || "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": item.accessLevel === "free" ? "public, max-age=300" : "private, no-store",
    "Content-Disposition": `inline; filename="${item.originalFileName ?? "nikola-neet-lecture.mp4"}"`,
  });
  if (range) {
    headers.set("Content-Range", `bytes ${range.start}-${range.end}/${head.size}`);
    headers.set("Content-Length", String(range.length));
    return new Response(object.body, { status: 206, headers });
  }
  headers.set("Content-Length", String(head.size));
  return new Response(object.body, { headers });
}

function parseRange(value: string | null, size: number) {
  const match = value?.match(/^bytes=(\d+)-(\d*)$/);
  if (!match) return null;
  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isInteger(start) || start < 0 || start >= size) return null;
  const end = Math.min(requestedEnd, size - 1);
  if (end < start) return null;
  return { start, end, length: end - start + 1 };
}
