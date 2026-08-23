"use client";

import { useState } from "react";

export function ProgressButton({ contentId, initialCompleted }: { contentId: number; initialCompleted: boolean }) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !completed;
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, completed: next }),
    });
    if (response.ok) setCompleted(next);
    setBusy(false);
  }

  return <button className={`progress-button ${completed ? "done" : ""}`} onClick={toggle} disabled={busy}>{completed ? "✓ Completed" : "Mark complete"}</button>;
}
