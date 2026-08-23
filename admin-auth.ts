import { getChatGPTUser } from "./chatgpt-auth";

function adminEmails() {
  return (process.env.NIKOLA_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAdminUser() {
  const user = await getChatGPTUser();
  if (!user) return null;
  return adminEmails().includes(user.email.toLowerCase()) ? user : null;
}

export function isAdminConfigured() {
  return adminEmails().length > 0;
}
