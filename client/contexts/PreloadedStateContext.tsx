import { createContext, useContext, type ReactNode } from "react";
import type { TestimonialsContent } from "@site/lib/cms/homePageTypes";
import type { SiteSettings } from "@site/lib/siteSettings";

export type PreloadedRouteKind =
  | "home"
  | "about"
  | "contact"
  | "practice-areas"
  | "practice-page"
  | "dynamic"
  | "simple";

export interface CmsPreloadedState {
  routePath: string;
  routeData: {
    kind: PreloadedRouteKind;
    payload: unknown;
  } | null;
  siteSettings: SiteSettings | null;
  supportingData: {
    homeTestimonials?: TestimonialsContent | null;
  };
}

declare global {
  interface Window {
    __CMS_PRELOADED_STATE__?: CmsPreloadedState;
  }
}

const PreloadedStateContext = createContext<CmsPreloadedState | null>(null);

export function normalizeRoutePath(path: string): string {
  if (!path) return "/";
  const [pathname] = path.split(/[?#]/);
  if (!pathname || pathname === "/") return "/";
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return withLeadingSlash.replace(/\/+$/, "") + "/";
}

export function readWindowPreloadedState(): CmsPreloadedState | null {
  if (typeof window === "undefined") return null;
  return window.__CMS_PRELOADED_STATE__ || null;
}

export function serializePreloadedState(state: CmsPreloadedState): string {
  return JSON.stringify(state).replace(/</g, "\\u003c");
}

export function PreloadedStateProvider({
  children,
  state,
}: {
  children: ReactNode;
  state: CmsPreloadedState | null;
}) {
  return (
    <PreloadedStateContext.Provider value={state}>
      {children}
    </PreloadedStateContext.Provider>
  );
}

export function usePreloadedState(): CmsPreloadedState | null {
  return useContext(PreloadedStateContext);
}
