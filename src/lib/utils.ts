/**
 * Utility functions for Creative Learning Platform
 */

/**
 * Universal media and URL formatter.
 * Handles local assets, uploaded files, absolute paths, external web links, and data URLs.
 */
export function formatMediaUrl(url?: string | null): string {
  if (!url) {
    return '/images/branding/creative-learning-logo.png';
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return '/images/branding/creative-learning-logo.png';
  }

  // If it's already an external URL, data URL, or blob
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // If it already starts with a slash
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Prepend single leading slash
  return `/${trimmed}`;
}

/**
 * Parses multiline or semicolon-separated strings into a clean array of items.
 */
export function parseStringList(input?: string | string[] | null): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((s) => s.trim()).filter(Boolean);
  }
  return input
    .split(/[;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Formats an array of strings into a semicolon-separated string.
 */
export function formatStringList(items?: string[] | null): string {
  if (!items || !Array.isArray(items)) return '';
  return items.map((s) => s.trim()).filter(Boolean).join('; ');
}
