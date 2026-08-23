import { getAdminUser, isAdminConfigured } from "../admin-auth";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { PortalHeader } from "../portal-header";
import { getAdminPortalData } from "../portal-data";
import { AdminPanel } from "./admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const signedIn = await requireChatGPTUser("/admin");
  const configured = isAdminConfigured();
  const admin = await getAdminUser();

  if (!configured || !admin) {
    return (
      <main className="portal-page admin-page">
        <PortalHeader actionHref={chatGPTSignOutPath("/")} actionLabel="Sign out" />
        <section className="admin-access-state"><img src="/nikola-neet-logo.jpg" alt="Nikola NEET" /><span>SECURE ADMIN PANEL</span><h1>{configured ? "Admin access नहीं मिला" : "Admin setup का एक step बाकी है"}</h1><p>{configured ? `${signedIn.email} को owner list में अनुमति नहीं है।` : "Nikola NEET owner email जोड़ने के बाद यहीं से lectures, PDFs और student access manage होंगे।"}</p><a href="/">Back to website</a></section>
      </main>
    );
  }

  const data = await getAdminPortalData();
  return (
    <main className="portal-page admin-page">
      <PortalHeader actionHref={chatGPTSignOutPath("/")} actionLabel="Sign out" />
      <section className="admin-hero"><div><span>NIKOLA NEET · SECURE OWNER AREA</span><h1>Content & Student<br /><em>Admin Panel.</em></h1></div><div className="admin-user"><small>Signed in as</small><strong>{admin.fullName ?? "Ajay Yadav"}</strong><span>{admin.email}</span></div></section>
      <section className="admin-shell"><AdminPanel initialItems={data.items} initialStudents={data.students} /></section>
    </main>
  );
}
