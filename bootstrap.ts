let ready: Promise<void> | null = null;

export function ensureDatabase() {
  if (ready) return ready;

  ready = (async () => {
    const { env } = await import("cloudflare:workers");
    const db = env.DB;
    if (!db) throw new Error("Database is not configured.");

    await db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS content_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course TEXT NOT NULL,
        chapter TEXT NOT NULL,
        chapter_number INTEGER NOT NULL DEFAULT 1,
        resource_number INTEGER NOT NULL DEFAULT 1,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        content_type TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'Hindi + English',
        access_level TEXT NOT NULL DEFAULT 'free',
        status TEXT NOT NULL DEFAULT 'draft',
        external_url TEXT,
        object_key TEXT,
        original_file_name TEXT,
        mime_type TEXT,
        file_size INTEGER,
        scheduled_at TEXT,
        download_allowed INTEGER NOT NULL DEFAULT 1,
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`),
      db.prepare("CREATE INDEX IF NOT EXISTS content_course_idx ON content_items (course)"),
      db.prepare("CREATE INDEX IF NOT EXISTS content_status_idx ON content_items (status)"),
      db.prepare("CREATE INDEX IF NOT EXISTS content_type_idx ON content_items (content_type)"),
      db.prepare(`CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        course TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS enrollment_email_course_idx ON enrollments (email, course)"),
      db.prepare(`CREATE TABLE IF NOT EXISTS student_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        content_id INTEGER NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS progress_email_content_idx ON student_progress (email, content_id)"),
    ]);

    const columnInfo = await db.prepare("PRAGMA table_info(content_items)").all();
    const columnNames = new Set(
      (columnInfo.results ?? []).map((row) => String((row as { name?: unknown }).name ?? "")),
    );
    const migrations = [];
    if (!columnNames.has("chapter_number")) migrations.push(db.prepare("ALTER TABLE content_items ADD COLUMN chapter_number INTEGER NOT NULL DEFAULT 1"));
    if (!columnNames.has("resource_number")) migrations.push(db.prepare("ALTER TABLE content_items ADD COLUMN resource_number INTEGER NOT NULL DEFAULT 1"));
    if (!columnNames.has("mime_type")) migrations.push(db.prepare("ALTER TABLE content_items ADD COLUMN mime_type TEXT"));
    if (!columnNames.has("scheduled_at")) migrations.push(db.prepare("ALTER TABLE content_items ADD COLUMN scheduled_at TEXT"));
    if (!columnNames.has("download_allowed")) migrations.push(db.prepare("ALTER TABLE content_items ADD COLUMN download_allowed INTEGER NOT NULL DEFAULT 1"));
    if (migrations.length) await db.batch(migrations);
    await db.prepare("CREATE INDEX IF NOT EXISTS content_course_chapter_idx ON content_items (course, chapter_number)").run();
  })().catch((error) => {
    ready = null;
    throw error;
  });

  return ready;
}
