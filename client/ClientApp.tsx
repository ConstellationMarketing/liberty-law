import { BrowserRouter } from "react-router-dom";
import { AppProviders, PublicAppContent } from "@site/AppRoot";
import { SessionAuthProvider } from "@site/contexts/SessionAuthContext";
import type { CmsPreloadedState } from "@site/contexts/PreloadedStateContext";

export function ClientApp({ preloadedState }: { preloadedState: CmsPreloadedState | null }) {
  return (
    <AppProviders preloadedState={preloadedState}>
      <BrowserRouter>
        <SessionAuthProvider>
          <PublicAppContent includeInteractiveEffects />
        </SessionAuthProvider>
      </BrowserRouter>
    </AppProviders>
  );
}
