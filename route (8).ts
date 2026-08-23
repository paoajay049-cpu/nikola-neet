import { desc, eq } from "drizzle-orm";
import { getAdminUser } from "../../../admin-auth";
import { ensureDatabase } from "../../../../db/bootstrap";
import { getDb } from "../../../../db";
import { enrollments } from "../../../../db/schema";

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
  const rows = await db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
  return Response.json({ enrollments: rows });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await authorize();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });
  const payload = (await request.json()) as { email?: string; course?: string };
  const email = payload.email?.trim().toLowerCase() ?? "";
  const course = payload.course?.trim() ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || !course) {
    return Response.json({ error: "Valid student email and course are required." }, { status: 400 });
  }
  const db = await getDb();
  await db
    .insert(enrollments)
    .values({ email, course, status: "active", createdBy: user.email })
    .onConflictDoUpdate({ target: [enrollments.email, enrollments.course], set: { status: "active" } });
  const rows = await db.select().from(enrollments).where(eq(enrollments.email, email));
  return Response.json({ enrollments: rows }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await authorize();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid enrollment id." }, { status: 400 });
  const db = await getDb();
  await db.delete(enrollments).where(eq(enrollments.id, id));
  return Response.json({ ok: true });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}
