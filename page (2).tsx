import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { ContentCard } from "../content-card";
import { courseCatalog } from "../course-catalog";
import { PortalHeader } from "../portal-header";
import { getStudentPortalData } from "../portal-data";
import { ProgressButton } from "./progress-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireChatGPTUser("/dashboard");
  const data = await getStudentPortalData(user.email);
  const enrolled = new Set(data.enrollments.map((row) => row.course));
  const completed = new Set(data.progress.filter((row) => row.completed).map((row) => row.contentId));
  const accessible = data.items.filter((item) => item.accessLevel === "free" || enrolled.has(item.course));
  const completionRate = accessible.length ? Math.round((accessible.filter((item) => completed.has(item.id)).length / accessible.length) * 100) : 0;

  return (
    <main className="portal-page dashboard-page">
      <PortalHeader actionHref={chatGPTSignOutPath("/")} actionLabel="Sign out" />
      <section className="dashboard-welcome">
        <div><span>STUDENT DASHBOARD</span><h1>Welcome, {user.fullName ?? "Nikola learner"}.</h1><p>{user.email}</p></div>
        <div className="progress-orb"><strong>{completionRate}%</strong><span>completed</span></div>
      </section>
      <section className="dashboard-stats">
        <article><span>Enrolled courses</span><strong>{enrolled.size}</strong></article>
        <article><span>Available resources</span><strong>{accessible.length}</strong></article>
        <article><span>Completed</span><strong>{accessible.filter((item) => completed.has(item.id)).length}</strong></article>
      </section>
      <section className="dashboard-content">
        <div className="dashboard-heading"><div><span>MY LEARNING</span><h2>Continue your preparation</h2></div><a href="/learn">View complete library →</a></div>
        {accessible.length ? (
          <div>{courseCatalog.map((course) => {
            const courseItems = accessible.filter((item) => item.course === course.title);
            if (!courseItems.length) return null;
            return <section className="course-library" key={course.slug}><div className="course-library-title"><span>→</span><h2>{course.title}</h2><a href={`/learn/${course.slug}`}>Open chapter folders →</a></div><div className="library-grid">{courseItems.slice(0, 6).map((item) => <ContentCard key={item.id} item={item} unlocked completionControl={<ProgressButton contentId={item.id} initialCompleted={completed.has(item.id)} />} />)}</div></section>;
          })}</div>
        ) : (
          <div className="portal-empty"><b>No learning material yet</b><p>Free resources publish होने या course enrollment activate होने के बाद content यहाँ दिखेगा।</p><a href="/learn">Browse library →</a></div>
        )}
      </section>
    </main>
  );
}
