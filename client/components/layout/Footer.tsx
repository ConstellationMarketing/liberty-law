import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@site/contexts/SiteSettingsContext";

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
};

export default function Footer() {
  const { settings, phoneDisplay, phoneLabel } = useSiteSettings();

  // Build resources links: use footerAboutLinks from CMS, fall back to navigationItems
  const resourceLinks =
    settings.footerAboutLinks.length > 0
      ? settings.footerAboutLinks
      : settings.navigationItems
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((item) => ({ label: item.label, href: item.href }));

  // Only show enabled social links
  const enabledSocialLinks = settings.socialLinks.filter((s) => s.enabled);

  return (
    <footer className="bg-law-dark relative">
      {/* Top Section: Tagline and Call Box */}
      <div className="max-w-[2560px] mx-auto w-[95%] py-[20px] md:py-[27px] flex flex-col lg:flex-row lg:items-center gap-8">
        {/* Left: Tagline */}
        <div className="lg:w-[75%]">
          <div>
            <p className="font-playfair text-[clamp(2rem,6vw,59.136px)] leading-tight md:leading-[70.9632px] font-light text-white">
              Committed to achieving <span className="text-law-accent">the best possible outcome</span> for your situation.
            </p>
          </div>
        </div>

        {/* Right: Call Us Box */}
        <div className="lg:w-[25%]">
          <div className="bg-law-accent p-[8px] w-full ml-auto cursor-pointer transition-all duration-300 hover:bg-law-accent-dark group">
            <div className="table w-full mx-auto max-w-full flex-row-reverse">
              <div className="table-cell w-[32px] leading-[0] mb-[30px]">
                <span className="m-auto">
                  <span className="inline-block bg-white p-[15px] text-black group-hover:bg-black transition-colors duration-300">
                    <Phone
                      className="w-[31px] h-[31px] [&>*]:fill-none [&>*]:stroke-black group-hover:[&>*]:stroke-white transition-colors duration-300"
                      strokeWidth={1.5}
                    />
                  </span>
                </span>
              </div>
              <div className="table-cell align-top pl-[15px]">
                <h4 className="font-outfit text-[16px] md:text-[18px] leading-tight text-white pb-[10px] transition-colors duration-300">
                  {phoneLabel}
                </h4>
                <div>
                  <p className="font-outfit text-[28px] md:text-[40px] leading-tight md:leading-[44px] text-white transition-colors duration-300 whitespace-nowrap">
                    {phoneDisplay}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="border-t border-b border-[#838383] max-w-[2560px] mx-auto w-[95%] py-[20px] md:py-[27px] flex flex-col lg:flex-row lg:items-start gap-6 md:gap-8 lg:gap-[3%]">
        {/* Logo Column */}
        <div className="lg:w-[20%] lg:mr-[3%]">
          <Link to="/" className="block">
            <img
              src={settings.logoUrl}
              alt={settings.logoAlt}
              className="h-[60px] md:h-[80px] w-auto max-w-[280px] object-contain"
            />
          </Link>
          {(settings.addressLine1 || settings.addressLine2) && (
            <div className="mt-4 font-outfit text-[20px] md:text-[24px] font-light leading-[28px] md:leading-[32px] text-white/80">
              {settings.addressLine1 && <p>{settings.addressLine1}</p>}
              {settings.addressLine2 && <p>{settings.addressLine2}</p>}
            </div>
          )}
        </div>

        {/* Resources Column */}
        <div className="lg:w-[20%] lg:mr-[3%]">
          <div className="font-outfit text-[18px] md:text-[24px] font-light leading-tight md:leading-[36px] text-white">
            <h3 className="font-outfit text-[28px] md:text-[36px] leading-tight md:leading-[36px] text-white pb-[10px]">
              Resources
            </h3>
            <ul className="text-[18px] md:text-[24px] font-light leading-tight md:leading-[36px] space-y-1">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href || "#"}
                    className="hover:text-law-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Practice Areas Column */}
        {settings.footerPracticeLinks.length > 0 && (
          <div className="lg:w-[20%] lg:mr-[3%]">
            <div className="font-outfit text-[18px] md:text-[24px] font-light leading-tight md:leading-[36px] text-white">
              <h3 className="font-outfit text-[28px] md:text-[36px] leading-tight md:leading-[36px] text-white pb-[10px]">
                Practice Areas
              </h3>
              <ul className="text-[18px] md:text-[24px] font-light leading-tight md:leading-[36px] space-y-1 columns-1 md:columns-2 lg:columns-1 xl:columns-2 gap-4">
                {settings.footerPracticeLinks.map((link) => (
                  <li key={link.label} className="break-inside-avoid">
                    <Link
                      to={link.href || "/practice-areas"}
                      className="hover:text-law-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Map Column */}
        {settings.mapEmbedUrl && (
          <div className="lg:w-[40%] max-w-[900px]">
            <div className="relative">
              <iframe
                src={settings.mapEmbedUrl}
                width="100%"
                height="350"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[350px]"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Social Media Section */}
      {enabledSocialLinks.length > 0 && (
        <div className="max-w-[1080px] mx-auto w-[80%] py-[20px]">
          <div className="w-full">
            <ul className="text-center leading-[26px]">
              {enabledSocialLinks.map((social, index) => {
                const Icon =
                  SOCIAL_ICONS[social.platform.toLowerCase()] || Facebook;
                const platformLabel =
                  social.platform.charAt(0).toUpperCase() +
                  social.platform.slice(1);
                return (
                  <li key={social.platform} className="inline-block mb-[8px]">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block w-[52px] h-[52px] bg-[#0A2540] border border-[#3C5A73] ${
                        index < enabledSocialLinks.length - 1 ? "mr-[8px]" : ""
                      } align-middle transition-all duration-300 hover:bg-law-accent hover:border-law-accent group flex items-center justify-center`}
                      title={`Follow on ${platformLabel}`}
                    >
                      <Icon className="w-6 h-6 text-white group-hover:text-black transition-colors duration-300" />
                      <span className="sr-only">
                        Follow on {platformLabel}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Copyright Section */}
      <div className="border-t border-[#838383] max-w-[2560px] mx-auto w-full py-[10px] px-[30px]">
        <div className="w-full mx-auto my-auto">
          <div className="font-outfit text-[18px] font-light leading-[27px] text-white text-center">
            <p>{settings.copyrightText}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
