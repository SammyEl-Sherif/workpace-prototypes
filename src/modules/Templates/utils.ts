/**
 * Converts a template title into a URL-friendly slug.
 * e.g. "Weekly Planner Pro" → "weekly-planner-pro"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (except spaces and hyphens)
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
}
