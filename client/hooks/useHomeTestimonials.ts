import { useEffect, useState } from "react";
import type { TestimonialsContent } from "../lib/cms/homePageTypes";
import { getSupabaseRequestKey, getSupabaseUrl } from "@site/lib/runtimeEnv";
import { usePreloadedState } from "@site/contexts/PreloadedStateContext";

interface UseHomeTestimonialsResult {
  testimonials: TestimonialsContent | null;
  isLoading: boolean;
}

let cached: TestimonialsContent | null | undefined = undefined;

export async function loadHomeTestimonials(): Promise<TestimonialsContent | null> {
  if (cached !== undefined) {
    return cached;
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  if (!supabaseUrl || !supabaseKey) {
    cached = null;
    return cached;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/pages?url_path=eq./&status=eq.published&select=content`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  cached =
    Array.isArray(data) && data.length > 0 && data[0].content?.testimonials
      ? (data[0].content.testimonials as TestimonialsContent)
      : null;

  return cached;
}

export function useHomeTestimonials(): UseHomeTestimonialsResult {
  const preloadedState = usePreloadedState();
  const preloadedTestimonials =
    preloadedState?.supportingData.homeTestimonials !== undefined
      ? preloadedState.supportingData.homeTestimonials
      : undefined;

  const [testimonials, setTestimonials] = useState<TestimonialsContent | null>(
    preloadedTestimonials ?? null,
  );
  const [isLoading, setIsLoading] = useState(preloadedTestimonials === undefined);

  useEffect(() => {
    let isMounted = true;

    async function fetchTestimonials() {
      try {
        if (preloadedTestimonials !== undefined) {
          cached = preloadedTestimonials;
          if (isMounted) {
            setTestimonials(preloadedTestimonials);
            setIsLoading(false);
          }
          return;
        }

        const loaded = await loadHomeTestimonials();
        if (isMounted) {
          setTestimonials(loaded);
        }
      } catch (err) {
        console.error("[useHomeTestimonials] Error:", err);
        cached = null;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, [preloadedTestimonials]);

  return { testimonials, isLoading };
}
