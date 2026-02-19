import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@site/contexts/SiteSettingsContext';
import { createFaviconFromLogo } from '@site/utils/createFaviconFromLogo';

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
}

export default function Seo({
  title,
  description,
  canonical,
  image,
  noindex = false
}: SeoProps) {
  const { pathname } = useLocation();
  const { settings } = useSiteSettings();
  const siteUrl = import.meta.env.VITE_SITE_URL || '';
  const [faviconUrl, setFaviconUrl] = useState<string>(settings.logoUrl);

  // Generate inverted favicon from logo (white -> black for visibility)
  useEffect(() => {
    createFaviconFromLogo(settings.logoUrl)
      .then(setFaviconUrl)
      .catch(() => setFaviconUrl(settings.logoUrl));
  }, [settings.logoUrl]);

  // Build full canonical URL
  const fullCanonical = canonical || (siteUrl ? `${siteUrl}${pathname}` : undefined);

  // Build full title from CMS site name
  const fullTitle = title ? `${title} | ${settings.siteName}` : settings.siteName;

  // Merge site-wide noindex with per-page noindex
  const shouldNoindex = noindex || settings.siteNoindex;

  // Default description
  const defaultDescription = 'Protecting your rights with integrity, experience, and relentless advocacy.';
  const fullDescription = description || defaultDescription;

  // Default image
  const defaultImage = siteUrl ? `${siteUrl}/og-image.jpg` : undefined;
  const fullImage = image || defaultImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />

      {/* Favicon - Using inverted logo for visibility (white -> black) */}
      <link rel="icon" type="image/png" href={faviconUrl} />
      <link rel="apple-touch-icon" href={faviconUrl} />

      {shouldNoindex && <meta name="robots" content="noindex, nofollow" />}

      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content="website" />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      {fullImage && <meta property="og:image" content={fullImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      {fullImage && <meta name="twitter:image" content={fullImage} />}
    </Helmet>
  );
}
