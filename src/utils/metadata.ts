import { decode } from 'html-entities';

/**
 * Normalizes text metadata from academic sources by:
 * - Decoding HTML/XML entities exactly once (e.g., &#039; -> ', &amp; -> &, etc.)
 * - Trimming leading/trailing whitespace
 * - Removing/collapsing duplicate whitespaces
 * - Preserving Unicode characters and LaTeX/mathematical notation
 * 
 * @param text The raw input string
 * @param isMultiline Whether to preserve paragraph/newline structures (e.g., for abstracts)
 */
export function normalizeMetadataText(text: string, isMultiline = false): string {
  if (typeof text !== 'string') return '';

  // 1. Decode HTML entities using the reliable html-entities library
  let cleaned = decode(text);

  // 2. Normalize Unicode representations to standard NFC
  cleaned = cleaned.normalize("NFC");

  // 3. Remove zero-width spaces, invisible characters, and non-printable control characters
  cleaned = cleaned.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, "");

  // 4. Remove duplicate whitespace while preserving formatting
  if (isMultiline) {
    // Replace multiple spaces or tabs within a line with a single space, but preserve newlines
    cleaned = cleaned.split('\n')
      .map(line => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n');
    // Collapse consecutive newlines to maximum of two newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  } else {
    // Replace all consecutive whitespace with a single space
    cleaned = cleaned.replace(/\s+/g, ' ');
  }

  return cleaned.trim();
}

/**
 * Normalizes an entire paper object's metadata at ingestion.
 * Ensures display-only fields are cleaned while keeping URLs, DOIs, IDs intact.
 */
export function normalizePaperMetadata<T extends {
  title: string;
  authors?: string[] | any[];
  abstract?: string;
  venue?: string;
  [key: string]: any;
}>(paper: T): T {
  if (!paper) return paper;

  const title = normalizeMetadataText(paper.title || '');
  const abstract = normalizeMetadataText(paper.abstract || '', true);
  const venue = paper.venue ? normalizeMetadataText(paper.venue) : undefined;

  let authors: string[] = [];
  if (Array.isArray(paper.authors)) {
    authors = paper.authors.map((author: any) => {
      if (typeof author === 'string') {
        return normalizeMetadataText(author);
      } else if (author && typeof author === 'object' && typeof author.name === 'string') {
        return normalizeMetadataText(author.name);
      }
      return '';
    }).filter(Boolean);
  }

  return {
    ...paper,
    title,
    authors,
    abstract,
    ...(venue !== undefined ? { venue } : {}),
  };
}
