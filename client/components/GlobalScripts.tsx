import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettings } from "@site/contexts/SiteSettingsContext";
import { refreshWhatConvertsDni } from "@site/lib/whatconvertsRefresh";

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
  const location = useLocation();
  const prevHead = useRef<string>("");
  const prevFooter = useRef<string>("");

  // Inject head scripts
  useEffect(() => {
    if (settings.headScripts === prevHead.current) return;
    prevHead.current = settings.headScripts;
    const cleanup = injectHtml(settings.headScripts, document.head);
    // Force-refresh immediately after injecting head scripts: this is the
    // moment the WC script first lands in the DOM, so we bypass the throttle
    // to guarantee DNI runs regardless of any earlier (failed) attempts.
    refreshWhatConvertsDni("head-scripts", { force: true });
    return cleanup;
  }, [settings.headScripts]);

  // Inject footer scripts
  useEffect(() => {
    if (settings.footerScripts === prevFooter.current) return;
    prevFooter.current = settings.footerScripts;
    const cleanup = injectHtml(settings.footerScripts, document.body);
    return cleanup;
  }, [settings.footerScripts]);

  // GA4: auto-inject gtag.js when a measurement ID is configured
  useEffect(() => {
    const id = settings.ga4MeasurementId;
    if (!id) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).gtag) return; // Already initialized — prevent double-injection

    const loaderScript = document.createElement("script");
    loaderScript.async = true;
    loaderScript.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(loaderScript);

    const configScript = document.createElement("script");
    configScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${id}');
    `;
    document.head.appendChild(configScript);
  }, [settings.ga4MeasurementId]);

  return null;
}
