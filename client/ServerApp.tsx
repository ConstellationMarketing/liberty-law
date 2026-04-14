import { StaticRouter } from "react-router-dom/server";
import { AppProviders, PublicAppContent } from "@site/AppRoot";
import type { CmsPreloadedState } from "@site/contexts/PreloadedStateContext";

export function ServerApp({
  location,
  preloadedState,
  helmetContext,
}: {
  location: string;
  preloadedState: CmsPreloadedState | null;
  helmetContext: object;
}) {
  return (
    <AppProviders preloadedState={preloadedState} helmetContext={helmetContext}>
      <StaticRouter location={location}>
        <PublicAppContent includeInteractiveEffects={false} />
      </StaticRouter>
    </AppProviders>
  );
}
