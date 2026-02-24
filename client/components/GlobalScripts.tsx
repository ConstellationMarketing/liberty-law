import { useEffect, useRef } from "react";
import { useSiteSettings } from "@site/contexts/SiteSettingsContext";

/**
 * Parses an HTML string and injects any <script> and other tags
 * into the target element (document.head or document.body).
 * Returns a cleanup function that removes all injected elements.
 */
function injectHtml(html: string, target: HTMLElement): () => void {
  const injected: Element[] = [];

  if (!html.trim()) return () => {};

  const template = document.createElement("div");
  template.innerHTML = html;

  Array.from(template.children).forEach((child) => {
    if (child.tagName === "SCRIPT") {
      // Scripts must be recreated as real elements to execute
      const script = document.createElement("script");
      Array.from(child.attributes).forEach((attr) => {
        script.setAttribute(attr.name, attr.value);
      });
      if (child.textContent) {
        script.textContent = child.textContent;
      }
      target.appendChild(script);
      injected.push(script);
    } else {
      // Non-script tags (noscript, link, meta, etc.) can be cloned directly
      const el = child.cloneNode(true) as Element;
      target.appendChild(el);
      injected.push(el);
    }
  });

  return () => {
    injected.forEach((el) => el.remove());
  };
}

export default function GlobalScripts() {
  const { settings } = useSiteSettings();
  const prevHead = useRef<string>("");
  const prevFooter = useRef<string>("");

  // Inject head scripts
  useEffect(() => {
    if (settings.headScripts === prevHead.current) return;
    prevHead.current = settings.headScripts;
    const cleanup = injectHtml(settings.headScripts, document.head);
    return cleanup;
  }, [settings.headScripts]);

  // Inject footer scripts
  useEffect(() => {
    if (settings.footerScripts === prevFooter.current) return;
    prevFooter.current = settings.footerScripts;
    const cleanup = injectHtml(settings.footerScripts, document.body);
    return cleanup;
  }, [settings.footerScripts]);

  return null;
}
