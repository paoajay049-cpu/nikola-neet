"use client";

import { FormEvent, useMemo, useState } from "react";
import { courseCatalog } from "../course-catalog";

type ContentItem = {
  id: number;
  course: string;
  chapter: string;
  chapterNumber: number;
  resourceNumber: number;
  title: string;
  contentType: string;
  accessLevel: string;
  status: string;
  scheduledAt: string | null;
  createdAt: string;
};

type Enrollment = { id: number; email: string; course: string; status: string; createdAt: string };

const courses = courseCatalog.map((course) => course.title);
const typeLabels: Record<string, string> = {
  live: "Live Class",
  video: "Recorded Lecture",
  booklet: "Chapter Booklet",
  book: "Chapter Booklet",
  notes: "Notes",
  dpp: "DPP",
  test: "Test Paper",
  formula: "Formula Sheet",
};

export function AdminPanel({ initialItems, initialStudents }: { initialItems: ContentItem[]; initialStudents: Enrollment[] }) {
  const [items, setItems] = useState(initialItems);
  const [students, setStudents] = useState(initialStudents);
  const [contentType, setContentType] = useState("live");
  const [videoSource, setVideoSource] = useState<"link" | "upload">("link");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "students">("content");
  const [courseFilter, setCourseFilter] = useState("all");
  const visibleItems = useMemo(() => courseFilter === "all" ? items : items.filter((item) => item.course === courseFilter), [courseFilter, items]);

  async function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/content", { method: "POST", body: new FormData(form) });
    const payload = await response.json() as { item?: ContentItem; error?: string };
    if (response.ok && payload.item) {
      setItems((current) => [payload.item!, ...current]);
      form.reset();
      setContentType("live");
      setVideoSource("link");
      setMessage("Content publish हो गया और सही chapter folder में जुड़ गया।");
    } else setMessage(payload.error ?? "Content save नहीं हुआ।");
    setBusy(false);
  }

  async function toggleStatus(item: ContentItem) {
    const status = item.status === "published" ? "draft" : "published";
    const response = await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, status }) });
    if (response.ok) setItems((current) => current.map((row) => row.id === item.id ? { ...row, status } : row));
  }

  async function removeContent(item: ContentItem) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    const response = await fetch(`/api/admin/content?id=${item.id}`, { method: "DELETE" });
    if (response.ok) setItems((current) => current.filter((row) => row.id !== item.id));
  }

  async function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/admin/enrollments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), course: data.get("course") }) });
    const payload = await response.json() as { enrollments?: Enrollment[]; error?: string };
    if (response.ok) {
      const email = String(data.get("email")).toLowerCase();
      setStudents((current) => [...current.filter((row) => row.email !== email), ...(payload.enrollments ?? [])]);
      form.reset();
      setMessage("Student course access activate हो गया।");
    } else setMessage(payload.error ?? "Enrollment save नहीं हुआ।");
  }

  async function removeStudent(row: Enrollment) {
    if (!window.confirm(`Remove ${row.email} from ${row.course}?`)) return;
    const response = await fetch(`/api/admin/enrollments?id=${row.id}`, { method: "DELETE" });
    if (response.ok) setStudents((current) => current.filter((student) => student.id !== row.id));
  }

  const needsPdf = !["live", "video"].includes(contentType);

  return (
    <>
      <div className="admin-tabs" role="tablist">
        <button className={activeTab === "content" ? "active" : ""} onClick={() => setActiveTab("content")}>Content Manager <span>{items.length}</span></button>
        <button className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}>Student Access <span>{students.length}</span></button>
      </div>
      {message && <div className="admin-message" role="status">{message}<button onClick={() => setMessage("")} aria-label="Close message">×</button></div>}

      {activeTab === "content" ? (
        <div className="admin-grid">
          <section className="admin-card upload-card">
            <div className="admin-section-title"><span>01</span><div><h2>Add course content</h2><p>एक ही chapter number और name वाला content अपने आप उसी folder में रहेगा।</p></div></div>
            <form onSubmit={submitContent}>
              <label>Course<select name="course" required defaultValue=""><option value="" disabled>Select course</option>{courses.map((course) => <option key={course}>{course}</option>)}</select></label>
              <label>Chapter number<input name="chapterNumber" required type="number" min="1" max="999" defaultValue="1" /></label>
              <label className="wide">Chapter / folder name<input name="chapter" required placeholder="e.g. Electric Charges and Fields" /></label>
              <label>Content type<select name="contentType" value={contentType} onChange={(event) => { setContentType(event.target.value); setVideoSource("link"); }}>{Object.entries(typeLabels).filter(([value]) => value !== "book").map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
              <label>Item number<input name="resourceNumber" required type="number" min="1" max="999" defaultValue="1" /><small>Lecture 1, DPP 1, Test 1…</small></label>
              <label className="wide">Title<input name="title" required placeholder="e.g. Electric Charge – Lecture 01" /></label>
              <label>Language<select name="language" defaultValue="Hindi + English"><option>Hindi</option><option>English</option><option>Hindi + English</option></select></label>
              <label>Access<select name="accessLevel" defaultValue="paid"><option value="free">Free for everyone</option><option value="paid">Paid batch only</option></select></label>

              {contentType === "live" ? <>
                <label className="wide">Live class link<input name="externalUrl" type="url" required placeholder="https://zoom.us/... or secure class link" /></label>
                <label className="wide">Class date & time<input name="scheduledAt" type="datetime-local" required /></label>
              </> : null}

              {contentType === "video" ? <>
                <div className="wide source-choice"><b>Recorded lecture source</b><button type="button" className={videoSource === "link" ? "active" : ""} onClick={() => setVideoSource("link")}>Paste secure link</button><button type="button" className={videoSource === "upload" ? "active" : ""} onClick={() => setVideoSource("upload")}>Upload video</button></div>
                {videoSource === "link" ? <label className="wide">Recorded video link<input name="externalUrl" type="url" required placeholder="https://youtube.com/... or private video URL" /><small>Large lectures के लिए recommended</small></label> : <label className="wide file-field">Video file<input name="file" type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" required /><small>MP4/WebM/MOV · maximum 95 MB</small></label>}
              </> : null}

              {needsPdf ? <label className="wide file-field">PDF file<input name="file" type="file" accept="application/pdf,.pdf" required /><small>Maximum 50 MB · PDF only</small></label> : null}
              {needsPdf ? <label className="wide checkbox-field"><input name="downloadAllowed" type="checkbox" defaultChecked /> Students can download this PDF</label> : null}
              <label>Publish status<select name="status" defaultValue="published"><option value="published">Publish now</option><option value="draft">Save draft</option></select></label>
              <label className="wide">Short description<textarea name="description" rows={3} placeholder="Students को इसमें क्या मिलेगा?" /></label>
              <button className="admin-submit wide" type="submit" disabled={busy}>{busy ? "Uploading…" : "Save in chapter folder →"}</button>
            </form>
          </section>

          <section className="admin-card content-list-card">
            <div className="admin-section-title"><span>02</span><div><h2>Uploaded content</h2><p>Course और chapter folders के अनुसार manage करें।</p></div></div>
            <label className="admin-filter">Filter course<select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}><option value="all">All courses</option>{courses.map((course) => <option key={course}>{course}</option>)}</select></label>
            <div className="admin-content-list">
              {visibleItems.length === 0 ? <div className="admin-empty">इस filter में अभी content upload नहीं है।</div> : visibleItems.map((item) => (
                <article key={item.id}>
                  <div className={`mini-type type-${item.contentType}`}>{item.contentType === "live" ? "LIVE" : item.contentType === "video" ? "▶" : item.contentType === "dpp" ? `D${item.resourceNumber}` : "PDF"}</div>
                  <div><small>{item.course} · Ch {item.chapterNumber}: {item.chapter}</small><h3>{item.title}</h3><span>{typeLabels[item.contentType]} #{item.resourceNumber} · {item.accessLevel === "paid" ? "Paid" : "Free"}</span></div>
                  <div className="admin-row-actions"><button className={item.status} onClick={() => toggleStatus(item)}>{item.status}</button><button className="delete" onClick={() => removeContent(item)}>Delete</button></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="admin-grid students-grid">
          <section className="admin-card upload-card">
            <div className="admin-section-title"><span>01</span><div><h2>Give course access</h2><p>Payment confirm होने के बाद student activate करें।</p></div></div>
            <form onSubmit={addStudent}>
              <label className="wide">Student email<input name="email" type="email" required placeholder="student@email.com" /></label>
              <label className="wide">Course<select name="course" required>{courses.map((course) => <option key={course}>{course}</option>)}</select></label>
              <button className="admin-submit wide" type="submit">Activate access →</button>
            </form>
            <div className="price-reference"><h3>Course price reference</h3>{courseCatalog.map((course) => <p key={course.slug}>{course.title} · {course.validity} <b>{course.price}</b></p>)}</div>
          </section>
          <section className="admin-card content-list-card">
            <div className="admin-section-title"><span>02</span><div><h2>Active students</h2><p>Paid course access list.</p></div></div>
            <div className="admin-content-list student-list">
              {students.length === 0 ? <div className="admin-empty">अभी किसी student का paid access active नहीं है।</div> : students.map((row) => (
                <article key={row.id}><div className="student-avatar">{row.email.slice(0, 1).toUpperCase()}</div><div><h3>{row.email}</h3><span>{row.course}</span></div><div className="admin-row-actions"><b>ACTIVE</b><button className="delete" onClick={() => removeStudent(row)}>Remove</button></div></article>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
