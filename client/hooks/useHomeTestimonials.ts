import { useState, useEffect } from "react";
import type { TestimonialsContent } from "../lib/cms/homePageTypes";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

interface UseHomeTestimonialsResult {
  testimonials: TestimonialsContent | null;
  isLoading: boolean;
}

let cached: TestimonialsContent | null | undefined = undefined; // undefined = not yet fetched

export function useHomeTestimonials(): UseHomeTestimonialsResult {
  const [testimonials, setTestimonials] = useState<TestimonialsContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetch_() {
      try {
        if (cached !== undefined) {
          if (isMounted) {
            setTestimonials(cached);
            setIsLoading(false);
          }
          return;
        }

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/pages?url_path=eq./&status=eq.published&select=content`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          },
        );

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        const result: TestimonialsContent | null =
          Array.isArray(data) && data.length > 0 && data[0].content?.testimonials
            ? (data[0].content.testimonials as TestimonialsContent)
            : null;

        cached = result;

        if (isMounted) {
          setTestimonials(result);
        }
      } catch (err) {
        console.error("[useHomeTestimonials] Error:", err);
        cached = null;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetch_();
    return () => {
      isMounted = false;
    };
  }, []);

  return { testimonials, isLoading };
}
