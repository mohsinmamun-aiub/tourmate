export const ADMIN_EMAILS = [
  "mohsin.aiub@gmail.com",
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.trim().toLowerCase());
}
