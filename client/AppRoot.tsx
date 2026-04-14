import { useState } from "react";
import * as ReactHelmetAsync from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@site/components/ScrollToTop";
import GlobalScripts from "@site/components/GlobalScripts";
import WcDniManager from "@site/components/WcDniManager";
import {
  PreloadedStateProvider,
  type CmsPreloadedState,
} from "@site/contexts/PreloadedStateContext";
import { SiteSettingsProvider } from "@site/contexts/SiteSettingsContext";
import PublicRoutes from "@site/routes/PublicRoutes";

const helmetAsyncCompat =
  (Reflect.get(ReactHelmetAsync as object, "default") as Record<string, any> | undefined) ||
  ReactHelmetAsync;
const { HelmetProvider } = helmetAsyncCompat;

function RoutedApp({
  includeInteractiveEffects,
}: {
  includeInteractiveEffects: boolean;
}) {
  const routeTree = (
    <>
      {includeInteractiveEffects && (
        <>
          <GlobalScripts />
          <WcDniManager />
          <ScrollToTop />
        </>
      )}
      <PublicRoutes />
    </>
  );

  return routeTree;
}

export function AppProviders({
  children,
  preloadedState,
  helmetContext,
}: {
  children: React.ReactNode;
  preloadedState: CmsPreloadedState | null;
  helmetContext?: object;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <PreloadedStateProvider state={preloadedState}>
          <SiteSettingsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </SiteSettingsProvider>
        </PreloadedStateProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export function PublicAppContent({
  includeInteractiveEffects,
}: {
  includeInteractiveEffects: boolean;
}) {
  return <RoutedApp includeInteractiveEffects={includeInteractiveEffects} />;
}
