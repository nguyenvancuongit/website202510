export const getTruncatedTextFromHtml = (html?: string, max = 150) => {
  if (!html) return "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const text = doc.body.textContent || "";
    return text.length > max ? `${text.slice(0, max)}...` : text;
  } catch {
    // Fallback: strip tags naively and truncate
    const stripped = html.replace(/<[^>]*>/g, "");
    return stripped.length > max ? `${stripped.slice(0, max)}...` : stripped;
  }
};