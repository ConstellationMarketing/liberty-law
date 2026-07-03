import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

const placesDetailsUrl = "https://maps.googleapis.com/maps/api/place/details/json";
const allowedNameDisplays = new Set(["full", "first", "initials", "hidden"]);
const placeIdCache = new Map<string, { allowed: boolean; expiresAt: number }>();
const minimumReviewWords = 20;

type ReviewerNameDisplay = "full" | "first" | "initials" | "hidden";

interface GooglePlaceReview {
  author_name?: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  time?: number;
}

function clampNumber(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

function sanitizeText(value: unknown) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
}

function sanitizeUrl(value: unknown) {
  const url = sanitizeText(value);
  if (!url) return "";

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : "";
  } catch {
    return "";
  }
}

function countWords(value: unknown) {
  return sanitizeText(value).split(/\s+/).filter(Boolean).length;
}

async function isAllowedPlaceId(placeId: string) {
  const cached = placeIdCache.get(placeId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.allowed;
  }

  const configuredIds = sanitizeText(process.env.GOOGLE_PLACES_ALLOWED_PLACE_IDS)
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (configuredIds.includes(placeId)) {
    placeIdCache.set(placeId, { allowed: true, expiresAt: Date.now() + 60_000 });
    return true;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    placeIdCache.set(placeId, { allowed: false, expiresAt: Date.now() + 60_000 });
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("pages")
    .select("content")
    .eq("url_path", "/")
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[google-reviews] Failed to verify Place ID", error.message);
    placeIdCache.set(placeId, { allowed: false, expiresAt: Date.now() + 60_000 });
    return false;
  }

  const allowed = sanitizeText(data?.content?.googleReviews?.placeId) === placeId;
  placeIdCache.set(placeId, { allowed, expiresAt: Date.now() + 60_000 });
  return allowed;
}

function formatReviewerName(name: string, display: ReviewerNameDisplay) {
  const cleanName = sanitizeText(name);

  if (!cleanName || display === "hidden") {
    return "Google reviewer";
  }

  if (display === "full") {
    return cleanName;
  }

  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (display === "first") {
    return parts[0] || "Google reviewer";
  }

  return parts
    .slice(0, 3)
    .map((part) => `${part.charAt(0).toUpperCase()}.`)
    .join(" ") || "Google reviewer";
}

function getNameDisplay(value: unknown): ReviewerNameDisplay {
  const requested = String(value || "first");
  return allowedNameDisplays.has(requested)
    ? (requested as ReviewerNameDisplay)
    : "first";
}

export const handleGoogleReviews: RequestHandler = async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: "Google Places API key is not configured",
      });
    }

    const placeId = sanitizeText(req.query.placeId);

    if (!placeId) {
      return res.status(400).json({ error: "Missing Google Place ID" });
    }

    const isAllowed = await isAllowedPlaceId(placeId);

    if (!isAllowed) {
      return res.status(403).json({ error: "Google Place ID is not allowed" });
    }

    const minimumRating = clampNumber(req.query.minimumRating, 5, 1, 5);
    const start = clampNumber(req.query.start, 1, 1, 5);
    const count = clampNumber(req.query.count, 3, 1, 5);
    const minWords = clampNumber(req.query.minWords, minimumReviewWords + 1, 1, 200);
    const nameDisplay = getNameDisplay(req.query.nameDisplay);

    const url = new URL(placesDetailsUrl);
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "name,rating,user_ratings_total,url,reviews");
    url.searchParams.set("reviews_sort", "newest");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url);
    const payload = await response.json();

    if (!response.ok || payload.status !== "OK") {
      const status = payload.status || response.status;
      const message = payload.error_message || "Unable to load Google reviews";

      console.error("[google-reviews] Google Places request failed", {
        status,
        message,
      });

      return res.status(response.ok ? 502 : response.status).json({
        error: "Unable to load Google reviews",
        status,
      });
    }

    const result = payload.result || {};
    const reviews = Array.isArray(result.reviews) ? result.reviews : [];
    const startIndex = start - 1;

    const filteredReviews = reviews
      .filter(
        (review: GooglePlaceReview) =>
          Number(review.rating || 0) >= minimumRating &&
          countWords(review.text) >= minWords,
      )
      .slice(startIndex, startIndex + count)
      .map((review: GooglePlaceReview) => ({
        authorName: formatReviewerName(review.author_name || "", nameDisplay),
        authorUrl: nameDisplay === "full" ? sanitizeUrl(review.author_url) : "",
        rating: clampNumber(review.rating, 5, 1, 5),
        text: sanitizeText(review.text),
        relativeTimeDescription: sanitizeText(review.relative_time_description),
        time: Number.isFinite(Number(review.time)) ? Number(review.time) : null,
      }))
      .filter((review) => review.text);

    res.set("Cache-Control", "no-store");
    return res.json({
      placeName: sanitizeText(result.name),
      rating: Number.isFinite(Number(result.rating)) ? Number(result.rating) : null,
      totalRatings: Number.isFinite(Number(result.user_ratings_total))
        ? Number(result.user_ratings_total)
        : null,
      googleUrl: sanitizeUrl(result.url) || null,
      reviews: filteredReviews,
    });
  } catch (err) {
    console.error("[google-reviews] Unexpected error", err);
    return res.status(500).json({ error: "Unable to load Google reviews" });
  }
};
