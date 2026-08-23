import { notFound } from "next/navigation";
import { getChatGPTUser } from "../../chatgpt-auth";
import { ContentCard } from "../../content-card";
import { getCourseBySlug, learningFolders } from "../../course-catalog";
import { PortalHeader } from "../../portal-header";
import { getPublishedContent, getStudentPortalData } from "../../portal-data";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getChatGPTUser();
  const data = user ? await getStudentPortalData(user.email) : { items: await getPublishedContent(), enrollments: [] };
  const items = data.items.filter((item) => item.course === course.title);
  const unlocked = data.enrollments.some((row) => row.course === course.title);
  const chapters = Array.from(new Map(items.map((item) => [`${item.chapterNumber}:${item.chapter}`, { number: item.chapterNumber, title: item.chapter }])).values())
    .sort((a, b) => a.number - b.number || a.title.localeCompare(b.title));

  return (
    <main className="portal-page course-detail-page">
      <PortalHeader actionHref={user ? "/dashboard" : `/signin-with-chatgpt?return_to=${encodeURIComponent(`/learn/${slug}`)}`} actionLabel={user ? "My Dashboard" : "Student Login"} />
      <section className={`course-detail-hero ${course.accent}`}>
        <div><a href="/learn">← All courses</a><span>{course.shortTitle} · {course.validity}</span><h1>{course.title}</h1><p>{course.description}</p></div>
        <aside><small>COURSE ACCESS</small><strong>{course.price}</strong><span>{unlocked ? "✓ Your course is active" : "Login or enrol to open paid content"}</span></aside>
      </section>
      <section className="course-detail-shell">
        <div className="course-tools">
          {learningFolders.map((folder) => {
            const count = items.filter((item) => item.contentType === folder.type || (folder.type === "booklet" && item.contentType === "book")).length;
            return <div key={folder.type}><span>{folder.icon}</span><b>{folder.label}</b><small>{count} uploaded</small></div>;
          })}
        </div>
        <div className="chapter-heading"><div><span>CHAPTER-WISE CONTENT</span><h2>हर chapter, सही क्रम में.</h2></div><p>{chapters.length} chapter folders · {items.length} total resources</p></div>
        {chapters.length === 0 ? (
          <div className="portal-empty"><b>इस course का content upload होना शुरू होगा</b><p>Owner admin panel से chapter, live class, recorded lecture, booklet, DPP और test publish करेगा।</p></div>
        ) : (
          <div className="chapter-list">
            {chapters.map((chapter, index) => {
              const chapterItems = items.filter((item) => item.chapterNumber === chapter.number && item.chapter === chapter.title);
              return (
                <details key={`${chapter.number}-${chapter.title}`} open={index === 0}>
                  <summary><span>CH {String(chapter.number).padStart(2, "0")}</span><div><h2>{chapter.title}</h2><p>{chapterItems.length} resources · Live, lectures, PDFs & practice</p></div><b>+</b></summary>
                  <div className="chapter-content-grid">
                    {learningFolders.map((folder) => {
                      const folderItems = chapterItems.filter((item) => item.contentType === folder.type || (folder.type === "booklet" && item.contentType === "book"));
                      if (!folderItems.length) return null;
                      return <section className="chapter-folder" key={folder.type}><div className="chapter-folder-title"><span>{folder.icon}</span><h3>{folder.label}</h3><small>{folderItems.length}</small></div><div className="library-grid">{folderItems.map((item) => <ContentCard key={item.id} item={item} unlocked={unlocked} />)}</div></section>;
                    })}
                    {chapterItems.some((item) => !learningFolders.some((folder) => folder.type === item.contentType || (folder.type === "booklet" && item.contentType === "book"))) ? (
                      <section className="chapter-folder"><div className="chapter-folder-title"><span>+</span><h3>Extra Resources</h3></div><div className="library-grid">{chapterItems.filter((item) => !learningFolders.some((folder) => folder.type === item.contentType || (folder.type === "booklet" && item.contentType === "book"))).map((item) => <ContentCard key={item.id} item={item} unlocked={unlocked} />)}</div></section>
                    ) : null}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
