import { renderToString } from "react-dom/server";
import { ServerApp } from "@site/ServerApp";
import type { CmsPreloadedState } from "@site/contexts/PreloadedStateContext";

export function renderCmsRoute({
  routePath,
  preloadedState,
}: {
  routePath: string;
  preloadedState: CmsPreloadedState;
}) {
  const helmetContext: { helmet?: any } = {};
  const appHtml = renderToString(
    <ServerApp
      location={routePath}
      preloadedState={preloadedState}
      helmetContext={helmetContext}
    />,
  );

  return {
    appHtml,
    helmet: helmetContext.helmet,
  };
}
