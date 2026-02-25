/**
 * Client-side image optimization: compress and convert to WebP before upload.
 * Uses the browser Canvas API — no extra dependencies needed.
 */

const MAX_DIMENSION = 2048;
const WEBP_QUALITY = 0.82;

/**
 * Optimizes an image file: resizes if too large, converts to WebP, compresses.
 * Returns the original file unchanged for non-optimizable types (SVG, PDF).
 */
export async function optimizeImage(file: File): Promise<File> {
  // Skip non-raster images
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    // Downscale if either dimension exceeds the cap
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await canvas.convertToBlob({
      type: "image/webp",
      quality: WEBP_QUALITY,
    });

    // Only use the optimized version if it's actually smaller
    if (blob.size >= file.size && file.type === "image/webp") {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  } catch {
    // Fallback: return original if anything goes wrong
    return file;
  }
}
