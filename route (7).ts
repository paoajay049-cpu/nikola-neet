import { desc, eq } from "drizzle-orm";
import { getAdminUser } from "../../../admin-auth";
import { ensureDatabase } from "../../../../db/bootstrap";
import { getDb } from "../../../../db";
import { contentItems } from "../../../../db/schema";

const COURSES = new Set(["Foundation 11th", "Foundation 12th", "Target Batch", "9th Pre-Foundation", "10th Pre-Foundation"]);
const CONTENT_TYPES = new Set(["live", "video", "book", "booklet", "notes", "dpp", "test", "formula"]);
const ACCESS_LEVELS = new Set(["free", "paid"]);
const STATUSES = new Set(["draft", "published"]);
const MAX_PDF_BYTES = 50 * 1024 * 1024;
const MAX_VIDEO_BYTES = 95 * 1024 * 1024;

async function authorize() {
  const user = await getAdminUser();
  if (!user) return null;
  await ensureDatabase();
  return user;
}

export async function GET() {
  const user = await authorize();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });

  const db = await getDb();
  const items = await db.select().from(contentItems).orderBy(desc(contentItems.createdAt));
  return Response.json({ items });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await authorize();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });

  try {
    const form = await request.formData();
    const course = stringField(form, "course");
    const chapter = stringField(form, "chapter");
    const chapterNumber = positiveInteger(form, "chapterNumber");
    const resourceNumber = positiveInteger(form, "resourceNumber");
    const title = stringField(form, "title");
    const description = stringField(form, "description");
    const contentType = stringField(form, "contentType");
    const language = stringField(form, "language") || "Hindi + English";
    const accessLevel = stringField(form, "accessLevel");
    const status = stringField(form, "status");
    const externalUrl = stringField(form, "externalUrl");
    const scheduledAt = stringField(form, "scheduledAt");
    const downloadAllowed = stringField(form, "downloadAllowed") === "on";

    if (!COURSES.has(course) || !chapter || !chapterNumber || !resourceNumber || !title || !CONTENT_TYPES.has(contentType) || !ACCESS_LEVELS.has(accessLevel) || !STATUSES.has(status)) {
      return Response.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    let objectKey: string | null = null;
    let originalFileName: string | null = null;
    let fileSize: number | null = null;
    let mimeType: string | null = null;

    if (contentType === "live") {
      if (!isSafeHttpsUrl(externalUrl)) return Response.json({ error: "Add a valid https live-class link." }, { status: 400 });
      if (!scheduledAt || Number.isNaN(Date.parse(scheduledAt))) return Response.json({ error: "Select the live-class date and time." }, { status: 400 });
    } else if (contentType === "video" && externalUrl) {
      if (!isSafeHttpsUrl(externalUrl)) return Response.json({ error: "Add a valid https video link." }, { status: 400 });
    } else {
      const upload = form.get("file");
      if (!(upload instanceof File) || upload.size === 0) {
        return Response.json({ error: contentType === "video" ? "Upload a video or add its https link." : "Choose a PDF file." }, { status: 400 });
      }
      const isVideo = contentType === "video";
      if (isVideo) {
        const validVideo = upload.type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(upload.name);
        if (!validVideo) return Response.json({ error: "Upload an MP4, WebM or MOV video." }, { status: 400 });
        if (upload.size > MAX_VIDEO_BYTES) return Response.json({ error: "Direct video upload must be 95 MB or less. Use a secure video link for larger lectures." }, { status: 400 });
      } else {
        if (upload.type !== "application/pdf" && !upload.name.toLowerCase().endsWith(".pdf")) return Response.json({ error: "Only PDF files are allowed." }, { status: 400 });
        if (upload.size > MAX_PDF_BYTES) return Response.json({ error: "PDF size must be 50 MB or less." }, { status: 400 });
      }

      const extension = safeExtension(upload.name, isVideo ? "mp4" : "pdf");
      objectKey = `${isVideo ? "videos" : "content"}/${crypto.randomUUID()}.${extension}`;
      originalFileName = safeFileName(upload.name);
      fileSize = upload.size;
      mimeType = upload.type || (isVideo ? "video/mp4" : "application/pdf");
      const bucket = await getBucket();
      await bucket.put(objectKey, upload.stream(), {
        httpMetadata: { contentType: mimeType, contentDisposition: `inline; filename="${originalFileName}"` },
        customMetadata: { uploadedBy: user.email, originalFileName },
      });
    }

    try {
      const db = await getDb();
      const [item] = await db
        .insert(contentItems)
        .values({
          course,
          chapter,
          chapterNumber,
          resourceNumber,
          title,
          description,
          contentType,
          language,
          accessLevel,
          status,
          externalUrl: contentType === "live" || (contentType === "video" && externalUrl) ? externalUrl : null,
          objectKey,
          originalFileName,
          mimeType,
          fileSize,
          scheduledAt: contentType === "live" ? new Date(scheduledAt).toISOString() : null,
          downloadAllowed: contentType === "video" || contentType === "live" ? false : downloadAllowed,
          createdBy: user.email,
        })
        .returning();
      return Response.json({ item }, { status: 201 });
    } catch (error) {
      if (objectKey) await (await getBucket()).delete(objectKey);
      throw error;
    }
  } catch (error) {
    console.error("Nikola NEET content upload failed", error);
    return Response.json({ error: "Upload failed. Please retry." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await authorize();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });
  const payload = (await request.json()) as { id?: number; status?: string };
  if (!payload.id || !STATUSES.has(payload.status ?? "")) {
    return Response.json({ error: "Invalid update." }, { status: 400 });
  }
  const db = await getDb();
  const [item] = await db
    .update(contentItems)
    .set({ status: payload.status, updatedAt: new Date().toISOString() })
    .where(eq(contentItems.id, payload.id))
    .returning();
  return Response.json({ item });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await authorize();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid content id." }, { status: 400 });

  const db = await getDb();
  const [item] = await db.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
  if (!item) return Response.json({ error: "Content not found." }, { status: 404 });
  if (item.objectKey) await (await getBucket()).delete(item.objectKey);
  await db.delete(contentItems).where(eq(contentItems.id, id));
  return Response.json({ ok: true });
}

function stringField(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function positiveInteger(form: FormData, key: string) {
  const value = Number(stringField(form, key));
  return Number.isInteger(value) && value > 0 && value <= 999 ? value : 0;
}

function isSafeHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}

function safeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 120) || "material.pdf";
}

function safeExtension(value: string, fallback: string) {
  const extension = value.toLowerCase().split(".").pop() ?? "";
  return /^[a-z0-9]{2,5}$/.test(extension) ? extension : fallback;
}

async function getBucket() {
  const { env } = await import("cloudflare:workers");
  if (!env.BUCKET) throw new Error("File storage is not configured.");
  return env.BUCKET;
}
