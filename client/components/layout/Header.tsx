import { useState } from "react";
import { Link } from "react-router-dom";
import { withTrailingSlash } from "@site/lib/withTrailingSlash";
import { Button } from "@/components/ui/button";
import { Menu, ArrowRight, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSiteSettings } from "@site/contexts/SiteSettingsContext";

type NavItemType = {
  label: string;
  href: string;
  order?: number;
  openInNewTab?: boolean;
  children?: NavItemType[];
};

/** Renders an anchor or React Router Link depending on whether the link
 *  should open in a new tab or is an absolute external URL. */
function NavLink({
  href,
  label,
  openInNewTab,
  className,
  onClick,
}: {
  href: string;
  label: string;
  openInNewTab?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const isExternal =
    openInNewTab ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {label}
      </a>
    );
  }
  return (
    <Link to={withTrailingSlash(href)} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}

function DesktopDropdownItem({ item }: { item: NavItemType }) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);

  if (!hasChildren) {
    return (
      <NavLink
        href={item.href}
        label={item.label}
        openInNewTab={item.openInNewTab}
        className="block px-5 py-3 font-outfit text-[16px] text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
      />
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center hover:bg-white/10 transition-colors">
        <NavLink
          href={item.href}
          label={item.label}
          openInNewTab={item.openInNewTab}
          className="flex-1 px-5 py-3 font-outfit text-[16px] text-white whitespace-nowrap"
        />
        <ChevronDown className="mr-3 h-4 w-4 -rotate-90 text-white" />
      </div>
      <div
        className={`absolute left-full top-0 ml-1 min-w-[220px] rounded-lg border border-law-border bg-law-card shadow-xl transition-all duration-200 ${
          open ? "visible translate-x-0 opacity-100" : "invisible -translate-x-1 opacity-0"
        }`}
      >
        {item.children!.map((grandchild, index) => (
          <NavLink
            key={`${grandchild.href}-${index}`}
            href={grandchild.href}
            label={grandchild.label}
            openInNewTab={grandchild.openInNewTab}
            className="block px-5 py-3 font-outfit text-[16px] text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
          />
        ))}
      </div>
    </div>
  );
}

/** Desktop nav item — plain link or dropdown trigger with flyout. */
function DesktopNavItem({ item }: { item: NavItemType }) {
  const [open, setOpen] = useState(false);
  const hasDropdown = item.children && item.children.length > 0;

  if (!hasDropdown) {
    return (
      <NavLink
        href={item.href}
        label={item.label}
        openInNewTab={item.openInNewTab}
        className="inline-flex items-center font-outfit text-[20px] text-white py-[31px] whitespace-nowrap hover:opacity-80 transition-opacity duration-400"
      />
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink
        href={item.href}
        label={item.label}
        openInNewTab={item.openInNewTab}
        className="font-outfit text-[20px] text-white py-[31px] whitespace-nowrap hover:opacity-80 transition-opacity duration-400 inline-flex items-center gap-1"
      />
      <span className="inline-flex items-center py-[31px] pointer-events-none">
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 text-white ${open ? "rotate-180" : ""}`}
        />
      </span>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full left-0 bg-law-card border border-law-border rounded-lg shadow-xl min-w-[220px] z-50 transition-all duration-200 ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
        }`}
      >
        {item.children!.map((child, index) => (
          <DesktopDropdownItem key={`${child.href}-${index}`} item={child} />
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const { settings, isLoading } = useSiteSettings();

  const navItems = [...settings.navigationItems]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter(
      (item) =>
        item.label.toLowerCase() !== "contact" &&
        item.label.toLowerCase() !== "contact us",
    );

  if (isLoading) {
    return (
      <>
        <div className="bg-law-dark h-[30px]"></div>
        <div className="sticky top-0 z-50">
          <div className="max-w-[2560px] mx-auto w-[95%]">
            <div className="bg-law-card border border-law-border px-[30px] py-[10px] h-[75px]" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Top padding background that scrolls away */}
      <div className="bg-law-dark h-[30px]"></div>

      {/* Sticky header wrapper */}
      <div className="sticky top-0 z-50">
        <div className="max-w-[2560px] mx-auto w-[95%]">
          <div className="bg-law-card border border-law-border px-[30px] py-[10px] flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="mr-[30px]">
                <img
                  src={settings.logoUrl}
                  alt={settings.logoAlt}
                  width={200}
                  height={55}
                  className="h-[55px] w-auto max-w-[280px] object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center flex-1 justify-end mr-6">
              <ul className="flex flex-wrap justify-end -mx-[11px]">
                {navItems.map((item) => (
                  <li key={item.href || item.label} className="px-[11px]">
                    <DesktopNavItem item={item} />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact CTA Button - Desktop */}
            <div className="hidden md:block w-[280px]">
              <Link to={withTrailingSlash(settings.headerCtaUrl)}>
                <Button className="bg-white text-black font-outfit text-[22px] py-[25px] px-[15.4px] h-auto w-[200px] hover:bg-law-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  {settings.headerCtaText}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <MobileMenu navItems={navItems} settings={settings} />
          </div>
        </div>
      </div>
    </>
  );
}

function MobileMenu({
  navItems,
  settings,
}: {
  navItems: NavItemType[];
  settings: ReturnType<typeof useSiteSettings>["settings"];
}) {
  const [open, setOpen] = useState(false);
  const [expandedDropdowns, setExpandedDropdowns] = useState<Set<number>>(
    new Set(),
  );
  const [expandedChildDropdowns, setExpandedChildDropdowns] = useState<Set<string>>(
    new Set(),
  );

  const toggleDropdown = (index: number) => {
    setExpandedDropdowns((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleChildDropdown = (parentIndex: number, childIndex: number) => {
    const key = `${parentIndex}-${childIndex}`;
    setExpandedChildDropdowns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-law-card border-law-border">
        <nav className="flex flex-col gap-1 mt-8">
          {navItems.map((item, index) => {
            const hasDropdown = item.children && item.children.length > 0;
            const isExpanded = expandedDropdowns.has(index);

            return (
              <div key={item.href || item.label}>
                {hasDropdown ? (
                  <>
                    <div className="flex items-center border-b border-black/5">
                      <NavLink
                        href={item.href}
                        label={item.label}
                        openInNewTab={item.openInNewTab}
                        onClick={() => setOpen(false)}
                        className="flex-1 font-outfit text-[20px] text-white py-[10px] px-[5%] hover:opacity-80 transition-opacity"
                      />
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="px-4 py-[10px] text-white hover:opacity-80 transition-opacity"
                        aria-label={`Toggle ${item.label} submenu`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="bg-white/5 rounded-lg mx-2 mb-1">
                        {item.children!.map((child, childIndex) => {
                          const hasGrandchildren = Boolean(child.children?.length);
                          const childKey = `${index}-${childIndex}`;
                          const isChildExpanded = expandedChildDropdowns.has(childKey);

                          return (
                            <div key={`${child.href}-${childIndex}`}>
                              <div className="flex items-center">
                                <NavLink
                                  href={child.href}
                                  label={child.label}
                                  openInNewTab={child.openInNewTab}
                                  onClick={() => setOpen(false)}
                                  className="flex-1 font-outfit text-[17px] text-white py-[8px] px-[8%] hover:opacity-80 transition-opacity"
                                />
                                {hasGrandchildren && (
                                  <button
                                    type="button"
                                    onClick={() => toggleChildDropdown(index, childIndex)}
                                    className="px-4 py-2 text-white hover:opacity-80"
                                    aria-label={`Toggle ${child.label} submenu`}
                                  >
                                    <ChevronDown
                                      className={`h-4 w-4 transition-transform duration-200 ${isChildExpanded ? "rotate-180" : ""}`}
                                    />
                                  </button>
                                )}
                              </div>
                              {hasGrandchildren && isChildExpanded && (
                                <div className="bg-black/10 py-1">
                                  {child.children!.map((grandchild, grandchildIndex) => (
                                    <NavLink
                                      key={`${grandchild.href}-${grandchildIndex}`}
                                      href={grandchild.href}
                                      label={grandchild.label}
                                      openInNewTab={grandchild.openInNewTab}
                                      onClick={() => setOpen(false)}
                                      className="block py-[7px] pl-[14%] pr-[8%] font-outfit text-[15px] text-white hover:opacity-80 transition-opacity"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    href={item.href}
                    label={item.label}
                    openInNewTab={item.openInNewTab}
                    onClick={() => setOpen(false)}
                    className="block font-outfit text-[20px] text-white py-[10px] px-[5%] border-b border-black/5 hover:opacity-80 transition-opacity"
                  />
                )}
              </div>
            );
          })}

          <Link to={settings.headerCtaUrl} className="mt-4" onClick={() => setOpen(false)}>
            <Button className="bg-white text-black font-outfit text-[22px] py-[25px] w-full hover:bg-law-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
              {settings.headerCtaText}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
