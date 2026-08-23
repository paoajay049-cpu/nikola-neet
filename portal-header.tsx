export function PortalHeader({ actionHref = "/dashboard", actionLabel = "Student Login" }: { actionHref?: string; actionLabel?: string }) {
  return (
    <header className="portal-header">
      <a className="brand" href="/" aria-label="Nikola NEET home">
        <img className="brand-logo" src="/nikola-neet-logo.jpg" alt="" width="52" height="52" />
        <span><strong>NIKOLA</strong><small>NEET</small></span>
      </a>
      <nav aria-label="Portal navigation">
        <a href="/">Home</a>
        <a href="/learn">Courses & Material</a>
        <a className="portal-nav-cta" href={actionHref}>{actionLabel}</a>
      </nav>
    </header>
  );
}
