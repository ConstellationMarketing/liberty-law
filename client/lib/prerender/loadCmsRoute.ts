import type { CmsPreloadedState, PreloadedRouteKind } from "@site/contexts/PreloadedStateContext";
import { normalizeRoutePath } from "@site/contexts/PreloadedStateContext";
import { loadSiteSettings } from "@site/lib/siteSettings";
import { loadHomeContent } from "@site/hooks/useHomeContent";
import { loadAboutContent } from "@site/hooks/useAboutContent";
import { loadContactContent } from "@site/hooks/useContactContent";
import { loadPracticeAreasContent } from "@site/hooks/usePracticeAreasContent";
import { getPracticePagePath, loadPracticePageContent } from "@site/hooks/usePracticePageContent";
import { loadDynamicPageContent } from "@site/hooks/useDynamicPageContent";
import { loadSimplePageContent } from "@site/hooks/useSimplePageContent";
import { loadHomeTestimonials } from "@site/hooks/useHomeTestimonials";
import {
  defaultComplaintsContent,
  defaultPrivacyPolicyContent,
  defaultTermsContent,
} from "@site/lib/cms/simplePageTypes";

function getPracticeSlugFromPath(routePath: string) {
  const normalized = normalizeRoutePath(routePath);
  if (!normalized.startsWith("/practice-areas/") || normalized === "/practice-areas/") {
    return null;
  }

  return normalized
    .replace(/^\/practice-areas\//, "")
    .replace(/\/+$/, "");
}

async function buildRoutePayload(
  routePath: string,
): Promise<{ kind: PreloadedRouteKind; payload: unknown; supportingData: CmsPreloadedState["supportingData"] } | null> {
  const normalizedPath = normalizeRoutePath(routePath);

  if (normalizedPath === "/") {
    return {
      kind: "home",
      payload: await loadHomeContent(),
      supportingData: {},
    };
  }

  if (normalizedPath === "/about/") {
    return {
      kind: "about",
      payload: await loadAboutContent(),
      supportingData: {},
    };
  }

  if (normalizedPath === "/contact/") {
    return {
      kind: "contact",
      payload: await loadContactContent(),
      supportingData: {},
    };
  }

  if (normalizedPath === "/practice-areas/") {
    return {
      kind: "practice-areas",
      payload: await loadPracticeAreasContent(),
      supportingData: {},
    };
  }

  if (normalizedPath === "/privacy-policy/") {
    return {
      kind: "simple",
      payload: await loadSimplePageContent(
        "/privacy-policy",
        defaultPrivacyPolicyContent,
      ),
      supportingData: {},
    };
  }

  if (normalizedPath === "/terms-and-conditions/") {
    return {
      kind: "simple",
      payload: await loadSimplePageContent(
        "/terms-and-conditions",
        defaultTermsContent,
      ),
      supportingData: {},
    };
  }

  if (normalizedPath === "/complaints-process/") {
    return {
      kind: "simple",
      payload: await loadSimplePageContent(
        "/complaints-process",
        defaultComplaintsContent,
      ),
      supportingData: {},
    };
  }

  const practiceSlug = getPracticeSlugFromPath(normalizedPath);
  if (practiceSlug) {
    const practicePayload = await loadPracticePageContent(practiceSlug);
    if (practicePayload) {
      return {
        kind: "practice-page",
        payload: practicePayload,
        supportingData: {
          homeTestimonials: await loadHomeTestimonials(),
        },
      };
    }
  }

  const dynamicPayload = await loadDynamicPageContent(normalizedPath);
  if (!dynamicPayload) {
    return null;
  }

  const requiresHomeTestimonials = dynamicPayload.contentTemplate === "practice";

  return {
    kind: "dynamic",
    payload: dynamicPayload,
    supportingData: {
      ...(requiresHomeTestimonials
        ? { homeTestimonials: await loadHomeTestimonials() }
        : {}),
    },
  };
}

export async function loadCmsPreloadedState(
  routePath: string,
): Promise<CmsPreloadedState | null> {
  const normalizedPath = normalizeRoutePath(routePath);
  const routePayload = await buildRoutePayload(normalizedPath);

  if (!routePayload) {
    return null;
  }

  return {
    routePath: normalizedPath,
    routeData: {
      kind: routePayload.kind,
      payload: routePayload.payload,
    },
    siteSettings: await loadSiteSettings(),
    supportingData: routePayload.supportingData,
  };
}

export function getStaticOutputPath(routePath: string) {
  const normalizedPath = normalizeRoutePath(routePath);
  if (normalizedPath === "/") {
    return "index.html";
  }

  return `${normalizedPath.replace(/^\//, "")}index.html`;
}

export function getPracticeRoutePathFromSlug(slug: string) {
  return normalizeRoutePath(getPracticePagePath(slug));
}
