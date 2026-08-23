import { getChatGPTUser } from "../chatgpt-auth";
import { courseCatalog, learningFolders } from "../course-catalog";
import { PortalHeader } from "../portal-header";
import { getPublishedContent } from "../portal-data";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const [user, items] = await Promise.all([getChatGPTUser(), getPublishedContent()]);
  return (
    <main className="portal-page">
      <PortalHeader actionHref={user ? "/dashboard" : "/signin-with-chatgpt?return_to=%2Fdashboard"} actionLabel={user ? "My Dashboard" : "Student Login"} />
      <section className="portal-hero course-index-hero">
        <div><span>NIKOLA NEET COURSE LIBRARY</span><h1>अपना course चुनें.<br /><em>पूरा chapter खोलें.</em></h1></div>
        <p>हर course में एक ही simple क्रम: Live Classes → Recorded Lectures → Chapter Booklet → DPPs → Tests।</p>
      </section>
      <section className="course-index-shell">
        <div className="folder-strip" aria-label="Every course includes">
          {learningFolders.map((folder) => <div key={folder.type}><span>{folder.icon}</span><b>{folder.label}</b></div>)}
        </div>
        <div className="course-index-grid">
          {courseCatalog.map((course, index) => {
            const total = items.filter((item) => item.course === course.title).length;
            const chapters = new Set(items.filter((item) => item.course === course.title).map((item) => item.chapterNumber)).size;
            return (
              <article className={`course-hub-card ${course.accent}`} key={course.slug}>
                <div className="course-hub-number">{String(index + 1).padStart(2, "0")}</div>
                <span>{course.shortTitle}</span>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <ul><li>● Live + Recorded Classes</li><li>● Booklets, DPPs & Tests</li><li>● Chapter-wise folders</li></ul>
                <div className="course-hub-meta"><span>{chapters} chapters · {total} resources</span><b>{course.price}</b></div>
                <a href={`/learn/${course.slug}`}>Open complete course <span>→</span></a>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
