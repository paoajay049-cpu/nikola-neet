import type { InferSelectModel } from "drizzle-orm";
import type { contentItems } from "../db/schema";

type ContentItem = InferSelectModel<typeof contentItems>;

const typeLabels: Record<string, string> = {
  live: "Live Class",
  video: "Recorded Lecture",
  book: "Chapter Booklet",
  booklet: "Chapter Booklet",
  notes: "Chapter Notes",
  dpp: "DPP",
  test: "Test Paper",
  formula: "Formula Sheet",
};

export function ContentCard({ item, unlocked = false, completionControl }: { item: ContentItem; unlocked?: boolean; completionControl?: React.ReactNode }) {
  const canOpen = item.accessLevel === "free" || unlocked;
  const isLecture = item.contentType === "video" || item.contentType === "live";
  const href = isLecture ? `/api/watch?id=${item.id}` : `/api/resource?id=${item.id}`;
  const dateLabel = item.scheduledAt ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(item.scheduledAt)) : null;
  return (
    <article className="library-card">
      <div className="library-card-top">
        <span className={`content-icon type-${item.contentType}`}>{item.contentType === "live" ? "LIVE" : item.contentType === "video" ? "▶" : item.contentType === "dpp" ? `D${item.resourceNumber}` : "PDF"}</span>
        <span className={`access-pill ${item.accessLevel}`}>{item.accessLevel === "free" ? "FREE" : canOpen ? "ENROLLED" : "PAID"}</span>
      </div>
      <small>{typeLabels[item.contentType] ?? item.contentType} {item.resourceNumber ? `#${item.resourceNumber}` : ""} · {item.language}</small>
      <h3>{item.title}</h3>
      <p>{item.description || `${item.chapter} के लिए Nikola NEET learning resource.`}</p>
      <div className="library-meta"><span>{dateLabel ?? item.course}</span><b>Ch. {item.chapterNumber} · {item.chapter}</b></div>
      <div className="library-actions">
        {canOpen ? (
          <span className="resource-links">
            <a href={href} target="_blank" rel="noreferrer">{item.contentType === "live" ? "Join live class" : item.contentType === "video" ? "Watch lecture" : "Open PDF"} ↗</a>
            {!isLecture && item.downloadAllowed ? <a className="download-link" href={`${href}&download=1`}>Download</a> : null}
          </span>
        ) : (
          <a href="/dashboard">Login / Enrol to unlock →</a>
        )}
        {completionControl}
      </div>
    </article>
  );
}
