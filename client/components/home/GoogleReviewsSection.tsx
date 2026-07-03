import { useEffect, useMemo, useState } from "react";
import { SafeHtml } from "@site/components/ui/SafeHtml";
import type { GoogleReviewsContent } from "@site/lib/cms/homePageTypes";
import { defaultHomeContent } from "@site/lib/cms/homePageTypes";

interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription?: string;
  time?: number;
  authorUrl?: string;
}

interface GoogleReviewsResponse {
  placeName: string;
  rating: number | null;
  totalRatings: number | null;
  googleUrl: string | null;
  reviews: GoogleReview[];
}

interface GoogleReviewsSectionProps {
  content?: GoogleReviewsContent;
}

const googleIconUrl =
  "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772026032541-mxc63k-google-icon.webp";
const maxDisplayedReviewWords = 55;
const minimumReviewWords = 20;

function getWordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function limitWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function RatingStars({ rating = 5 }: { rating?: number }) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={index < roundedRating ? "text-[#fbbc04]" : "text-gray-300"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function GoogleRatingBadge({ data }: { data: GoogleReviewsResponse }) {
  const badge = (
    <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <img src={googleIconUrl} alt="Google" loading="lazy" className="h-6 w-6" />
      <div className="flex items-center gap-2">
        <span className="font-outfit text-sm font-semibold uppercase tracking-[0.12em] text-gray-700">
          Google Rating
        </span>
        <span className="font-outfit text-lg font-bold text-law-dark">
          {data.rating?.toFixed(1) || "5.0"}
        </span>
      </div>
      <RatingStars rating={data.rating || 5} />
      {data.totalRatings ? (
        <span className="font-outfit text-sm text-gray-600">
          {data.totalRatings.toLocaleString()} reviews
        </span>
      ) : null}
    </div>
  );

  if (!data.googleUrl) {
    return badge;
  }

  return (
    <a href={data.googleUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
      {badge}
    </a>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const displayedText = limitWords(review.text, maxDisplayedReviewWords);

  return (
    <article className="flex h-full flex-col justify-between border border-[rgb(224,224,224)] bg-white p-6 shadow-sm">
      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <RatingStars rating={review.rating} />
          <img src={googleIconUrl} alt="Google" loading="lazy" className="h-8 w-8" />
        </div>
        <p
          className="font-outfit text-[18px] leading-[30px] text-black md:text-[20px] md:leading-[32px]"
          title={review.text}
        >
          “{displayedText}”
        </p>
      </div>
      <footer className="mt-6 flex items-center justify-between gap-4 font-outfit text-[18px] leading-[28px] text-black">
        {review.authorUrl ? (
          <a
            href={review.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:text-law-accent"
          >
            {review.authorName}
          </a>
        ) : (
          <strong className="font-bold">{review.authorName}</strong>
        )}
        {review.relativeTimeDescription ? (
          <span className="text-sm text-gray-500">{review.relativeTimeDescription}</span>
        ) : null}
      </footer>
    </article>
  );
}

export default function GoogleReviewsSection({ content }: GoogleReviewsSectionProps) {
  const data = content || defaultHomeContent.googleReviews;
  const [reviewData, setReviewData] = useState<GoogleReviewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const placeId = data.placeId?.trim();
  const shouldRender = data.enabled && Boolean(placeId);

  const requestUrl = useMemo(() => {
    if (!shouldRender) return null;

    const params = new URLSearchParams({
      placeId,
      minimumRating: String(data.minimumRating || 5),
      start: String(data.startReviewNumber || 1),
      count: String(data.displayCount || 3),
      nameDisplay: data.reviewerNameDisplay || "first",
      minWords: String(minimumReviewWords + 1),
    });

    return `/api/google-reviews?${params.toString()}`;
  }, [
    shouldRender,
    placeId,
    data.minimumRating,
    data.startReviewNumber,
    data.displayCount,
    data.reviewerNameDisplay,
  ]);

  useEffect(() => {
    if (!requestUrl) return;

    const controller = new AbortController();

    async function loadReviews() {
      setIsLoading(true);
      setError(null);
      setReviewData(null);

      try {
        const response = await fetch(requestUrl, {
          signal: controller.signal,
          cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Unable to load Google reviews");
        }

        setReviewData(payload);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setReviewData(null);
        setError(err instanceof Error ? err.message : "Unable to load Google reviews");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadReviews();

    return () => controller.abort();
  }, [requestUrl]);

  if (!shouldRender) {
    return null;
  }

  const reviews = (reviewData?.reviews || []).filter(
    (review) => getWordCount(review.text) > minimumReviewWords,
  );

  return (
    <section className="bg-white pt-[54px]" aria-labelledby="google-reviews-heading">
      <div className="mx-auto w-[80%] max-w-[1080px] py-[27px]">
        <div className="mb-[10px] text-center">
          <p className="font-outfit text-[24px] leading-[36px] text-law-accent">
            {data.sectionLabel}
          </p>
        </div>
        <div className="text-center">
          <h2
            id="google-reviews-heading"
            className="font-playfair text-[28px] leading-tight text-law-dark pb-[10px] md:text-[40px] md:leading-[54px] lg:text-[54px]"
          >
            {data.heading}
          </h2>
          <SafeHtml
            html={data.description}
            className="font-outfit text-[20px] leading-[32px] text-black md:text-[24px] md:leading-[36px]"
            as="div"
          />
          {reviewData ? (
            <div className="mt-6">
              <GoogleRatingBadge data={reviewData} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-[80%] max-w-[1600px] pb-[54px]">
        {isLoading || (!reviewData && !error) ? (
          <div className="rounded-md border border-gray-200 p-6 text-center font-outfit text-lg text-gray-600">
            Loading Google reviews…
          </div>
        ) : error || reviews.length === 0 ? (
          <div className="rounded-md border border-gray-200 p-6 text-center font-outfit text-lg text-gray-600">
            {data.emptyMessage}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <ReviewCard key={`${review.authorName}-${review.time || index}`} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
