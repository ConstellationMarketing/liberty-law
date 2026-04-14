import "./global.css";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ClientApp } from "@site/ClientApp";
import { readWindowPreloadedState } from "@site/contexts/PreloadedStateContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

const preloadedState = readWindowPreloadedState();
const shouldHydrate = Boolean(preloadedState && rootElement.hasChildNodes());

if (shouldHydrate) {
  hydrateRoot(rootElement, <ClientApp preloadedState={preloadedState} />);
} else {
  createRoot(rootElement).render(<ClientApp preloadedState={preloadedState} />);
}
