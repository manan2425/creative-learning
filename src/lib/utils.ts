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

  // Normalize paths copied from local files, admin inputs, and older records.
  const normalized = trimmed.replace(/\\/g, '/').replace(/^\.\//, '');
  const publicPath = normalized.replace(/^public\//, '');

  if (publicPath.startsWith('/')) return publicPath;
  if (publicPath.startsWith('uploads/')) return `/${publicPath}`;
  if (publicPath.startsWith('images/') || publicPath.startsWith('docs/')) return `/${publicPath}`;

  // Prepend single leading slash
  return `/${publicPath}`;
}

/**
 * Cleans individual spec item removing extraneous leading dashes/bullets.
 */
function cleanSpecItem(item: string): string {
  if (!item) return '';
  return item
    .replace(/^[\s•*–—\-#\d\.\)]+/, '') // strip leading bullets, numbers, dashes
    .trim();
}

/**
 * Parses multiline, semicolon, comma, or pipe-separated strings into a clean array of items.
 * Intelligently cleans leading bullets and trims whitespace.
 */
export function parseStringList(input?: string | string[] | null): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((s) => cleanSpecItem(String(s)))
      .filter(Boolean);
  }

  const raw = String(input).trim();
  if (!raw) return [];

  // 1. First attempt splitting by semicolon, newline, or pipe
  let items = raw
    .split(/[;\n\r|]+/)
    .map((s) => cleanSpecItem(s))
    .filter(Boolean);

  // 2. If single chunk but contains multiple key:value pairs separated by commas
  if (items.length <= 1 && raw.includes(',') && (raw.includes(':') || raw.length > 50)) {
    items = raw
      .split(/,\s*(?=[A-Za-z0-9_ -]+:)/)
      .map((s) => cleanSpecItem(s))
      .filter(Boolean);
  }

  return items;
}

/**
 * Parses a specification string into label and value if separated by a colon.
 * e.g. "Operating Voltage: 5V DC" -> { label: "Operating Voltage", value: "5V DC" }
 * e.g. "ATmega328P MCU" -> { value: "ATmega328P MCU" }
 */
export function parseSpecKeyValue(spec: string): { label?: string; value: string } {
  const clean = cleanSpecItem(spec);
  const colonIndex = clean.indexOf(':');
  if (colonIndex > 0 && colonIndex < clean.length - 1) {
    const label = clean.substring(0, colonIndex).trim();
    const value = clean.substring(colonIndex + 1).trim();
    if (label.length <= 40 && value.length > 0) {
      return { label, value };
    }
  }
  return { value: clean };
}

/**
 * Formats an array of strings into a semicolon-separated string.
 */
export function formatStringList(items?: string[] | null): string {
  if (!items || !Array.isArray(items)) return '';
  return items.map((s) => cleanSpecItem(s)).filter(Boolean).join('; ');
}
