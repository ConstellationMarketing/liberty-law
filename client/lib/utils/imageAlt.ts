/**
 * Extracts a human-readable alt text from an image URL using the filename.
 * Falls back to the provided fallback string if URL is empty/invalid.
 *
 * Example: "https://cdn.example.com/felony-defense-lawyer.webp" → "Felony Defense Lawyer"
 */
export function getImageAlt(url: string, fallback = ""): string {
  if (!url) return fallback;
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop() || "";
    const name = filename.replace(/\.[^.]+$/, ""); // remove extension
    return (
      name
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim() || fallback
    );
  } catch {
    // If URL parsing fails, try naive split
    const filename = url.split("/").pop()?.split("?")[0] || "";
    const name = filename.replace(/\.[^.]+$/, "");
    return (
      name
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim() || fallback
    );
  }
}
