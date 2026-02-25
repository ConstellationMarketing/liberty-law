import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type {
  SiteSettings,
  NavigationItem,
  FooterLink,
  SocialLink,
  SiteSettingsRow,
} from "../../lib/siteSettingsTypes";
import {
  DEFAULT_SITE_SETTINGS,
  rowToSiteSettings,
  siteSettingsToRow,
} from "../../lib/siteSettingsTypes";
import { clearSiteSettingsCache } from "../../hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Search,
  BarChart3,
  Code,
  AlertTriangle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useUserRole } from "../../hooks/useUserRole";

export default function AdminSiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("settings_key", "global")
      .single();

    if (error) {
      console.error("Error fetching settings:", error);
      // Use defaults if not found
      setLoading(false);
      return;
    }

    if (data) {
      setSettingsId(data.id);
      setSettings(rowToSiteSettings(data as SiteSettingsRow));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    const rowData = siteSettingsToRow(settings);

    let error;
    if (settingsId) {
      // Update existing
      const result = await supabase
        .from("site_settings")
        .update(rowData)
        .eq("id", settingsId);
      error = result.error;
    } else {
      // Insert new
      const result = await supabase
        .from("site_settings")
        .insert({ ...rowData, settings_key: "global" });
      error = result.error;
    }

    if (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings: " + error.message);
    } else {
      // Clear the cache so components refetch
      clearSiteSettingsCache();
      alert("Settings saved successfully!");
    }
    setSaving(false);
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings({ ...settings, ...updates });
  };

  // Navigation items handlers
  const addNavItem = () => {
    const newOrder = settings.navigationItems.length + 1;
    updateSettings({
      navigationItems: [
        ...settings.navigationItems,
        { label: "", href: "/", order: newOrder },
      ],
    });
  };

  const updateNavItem = (index: number, updates: Partial<NavigationItem>) => {
    const items = [...settings.navigationItems];
    items[index] = { ...items[index], ...updates };
    updateSettings({ navigationItems: items });
  };

  const removeNavItem = (index: number) => {
    const items = settings.navigationItems.filter((_, i) => i !== index);
    updateSettings({ navigationItems: items });
  };

  // Footer About links handlers
  const addAboutLink = () => {
    updateSettings({
      footerAboutLinks: [...settings.footerAboutLinks, { label: "" }],
    });
  };

  const updateAboutLink = (index: number, updates: Partial<FooterLink>) => {
    const items = [...settings.footerAboutLinks];
    items[index] = { ...items[index], ...updates };
    updateSettings({ footerAboutLinks: items });
  };

  const removeAboutLink = (index: number) => {
    const items = settings.footerAboutLinks.filter((_, i) => i !== index);
    updateSettings({ footerAboutLinks: items });
  };

  // Footer Practice links handlers
  const addPracticeLink = () => {
    updateSettings({
      footerPracticeLinks: [...settings.footerPracticeLinks, { label: "" }],
    });
  };

  const updatePracticeLink = (index: number, updates: Partial<FooterLink>) => {
    const items = [...settings.footerPracticeLinks];
    items[index] = { ...items[index], ...updates };
    updateSettings({ footerPracticeLinks: items });
  };

  const removePracticeLink = (index: number) => {
    const items = settings.footerPracticeLinks.filter((_, i) => i !== index);
    updateSettings({ footerPracticeLinks: items });
  };

  // Social links handlers
  const addSocialLink = () => {
    updateSettings({
      socialLinks: [
        ...settings.socialLinks,
        { platform: "facebook", url: "", enabled: true },
      ],
    });
  };

  const updateSocialLink = (index: number, updates: Partial<SocialLink>) => {
    const items = [...settings.socialLinks];
    items[index] = { ...items[index], ...updates };
    updateSettings({ socialLinks: items });
  };

  const removeSocialLink = (index: number) => {
    const items = settings.socialLinks.filter((_, i) => i !== index);
    updateSettings({ socialLinks: items });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
            <p className="text-gray-500 text-sm">
              Global Header & Footer configuration
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="branding">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Scripts</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Name</CardTitle>
              <CardDescription>
                The name of your site, displayed in the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => updateSettings({ siteName: e.target.value })}
                  placeholder="Your Site Name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>
                Your site logo appears in the header and footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={settings.logoUrl}
                  onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              {settings.logoUrl && (
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <img
                    src={settings.logoUrl}
                    alt={settings.logoAlt}
                    className="h-16 w-auto object-contain"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="logoAlt">Logo Alt Text</Label>
                <Input
                  id="logoAlt"
                  value={settings.logoAlt}
                  onChange={(e) => updateSettings({ logoAlt: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Header CTA Button</CardTitle>
              <CardDescription>
                The call-to-action button in the header
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headerCtaText">Button Text</Label>
                <Input
                  id="headerCtaText"
                  value={settings.headerCtaText}
                  onChange={(e) =>
                    updateSettings({ headerCtaText: e.target.value })
                  }
                  placeholder="GET HELP NOW"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headerCtaUrl">Button URL</Label>
                <Input
                  id="headerCtaUrl"
                  value={settings.headerCtaUrl}
                  onChange={(e) =>
                    updateSettings({ headerCtaUrl: e.target.value })
                  }
                  placeholder="#book"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Copyright Text</CardTitle>
              <CardDescription>Displayed in the footer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="copyrightText">Copyright Text</Label>
                <Input
                  id="copyrightText"
                  value={settings.copyrightText}
                  onChange={(e) =>
                    updateSettings({ copyrightText: e.target.value })
                  }
                  placeholder="Copyright © 2026 | Company Name | All Rights Reserved"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>
                Links displayed in the header navigation bar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.navigationItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <Input
                      value={item.label}
                      onChange={(e) =>
                        updateNavItem(index, { label: e.target.value })
                      }
                      placeholder="Label"
                    />
                    <Input
                      value={item.href}
                      onChange={(e) =>
                        updateNavItem(index, { href: e.target.value })
                      }
                      placeholder="/page-url"
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.openInNewTab || false}
                        onCheckedChange={(checked) =>
                          updateNavItem(index, { openInNewTab: checked })
                        }
                      />
                      <span className="text-sm text-gray-500">New tab</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNavItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addNavItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Navigation Item
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Tab */}
        <TabsContent value="footer" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Column Links</CardTitle>
              <CardDescription>
                Links in the "About" section of the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.footerAboutLinks.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={item.label}
                    onChange={(e) =>
                      updateAboutLink(index, { label: e.target.value })
                    }
                    placeholder="Link text"
                    className="flex-1"
                  />
                  <Input
                    value={item.href || ""}
                    onChange={(e) =>
                      updateAboutLink(index, {
                        href: e.target.value || undefined,
                      })
                    }
                    placeholder="/page-url (optional)"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAboutLink(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addAboutLink}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Areas Column Links</CardTitle>
              <CardDescription>
                Links in the "Practice Areas" section of the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.footerPracticeLinks.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={item.label}
                    onChange={(e) =>
                      updatePracticeLink(index, { label: e.target.value })
                    }
                    placeholder="Link text"
                    className="flex-1"
                  />
                  <Input
                    value={item.href || ""}
                    onChange={(e) =>
                      updatePracticeLink(index, {
                        href: e.target.value || undefined,
                      })
                    }
                    placeholder="/page-url (optional)"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePracticeLink(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addPracticeLink}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Map Embed</CardTitle>
              <CardDescription>
                Google Maps embed URL for the footer map
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="mapEmbedUrl">Map Embed URL</Label>
                <Input
                  id="mapEmbedUrl"
                  value={settings.mapEmbedUrl}
                  onChange={(e) =>
                    updateSettings({ mapEmbedUrl: e.target.value })
                  }
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>
              {settings.mapEmbedUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <iframe
                    src={settings.mapEmbedUrl}
                    width="100%"
                    height="200"
                    className="rounded-lg border"
                    loading="lazy"
                    title="Map Preview"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="contact" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Phone Number</CardTitle>
              <CardDescription>Displayed in header and footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (digits only)</Label>
                <Input
                  id="phoneNumber"
                  value={settings.phoneNumber}
                  onChange={(e) =>
                    updateSettings({ phoneNumber: e.target.value })
                  }
                  placeholder="4049057742"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneDisplay">Display Format</Label>
                <Input
                  id="phoneDisplay"
                  value={settings.phoneDisplay}
                  onChange={(e) =>
                    updateSettings({ phoneDisplay: e.target.value })
                  }
                  placeholder="404-905-7742"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneAvailability">Availability Text</Label>
                <Input
                  id="phoneAvailability"
                  value={settings.phoneAvailability}
                  onChange={(e) =>
                    updateSettings({ phoneAvailability: e.target.value })
                  }
                  placeholder="Available 24/7"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Switch
                  checked={settings.applyPhoneGlobally}
                  onCheckedChange={(checked) =>
                    updateSettings({ applyPhoneGlobally: checked })
                  }
                />
                <Label>Apply this phone number globally across all pages</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>
                Physical address displayed in the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={settings.addressLine1}
                  onChange={(e) =>
                    updateSettings({ addressLine1: e.target.value })
                  }
                  placeholder="123 Main Street, Suite 100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={settings.addressLine2}
                  onChange={(e) =>
                    updateSettings({ addressLine2: e.target.value })
                  }
                  placeholder="City, State 12345"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Social media icons displayed in the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.socialLinks.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Select
                    value={item.platform}
                    onValueChange={(v) =>
                      updateSocialLink(index, {
                        platform: v as SocialLink["platform"],
                      })
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={item.url}
                    onChange={(e) =>
                      updateSocialLink(index, { url: e.target.value })
                    }
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={(checked) =>
                        updateSocialLink(index, { enabled: checked })
                      }
                    />
                    <span className="text-sm text-gray-500">Show</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocialLink(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addSocialLink}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Engine Settings
              </CardTitle>
              <CardDescription>
                Control how search engines index your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> Enabling site-wide noindex will prevent search engines from indexing any page on your site. This is useful during development or for private sites.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Site-wide No Index</Label>
                  <p className="text-sm text-gray-500">
                    When enabled, all pages will have a noindex meta tag, hiding the entire site from search engines.
                  </p>
                </div>
                <Switch
                  checked={settings.siteNoindex}
                  onCheckedChange={(checked) =>
                    updateSettings({ siteNoindex: checked })
                  }
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Per-Page Indexing</h4>
                <p className="text-sm text-gray-600">
                  Individual pages can also be hidden from search engines using the "No Index" toggle in each page's SEO settings. This allows you to hide specific pages while keeping the rest of your site indexed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics & Scripts Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Google Analytics
              </CardTitle>
              <CardDescription>
                Track website traffic and user behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ga4MeasurementId">GA4 Measurement ID</Label>
                <Input
                  id="ga4MeasurementId"
                  value={settings.ga4MeasurementId}
                  onChange={(e) =>
                    updateSettings({ ga4MeasurementId: e.target.value })
                  }
                  placeholder="G-XXXXXXXXXX"
                  disabled={!isAdmin && !roleLoading}
                />
                <p className="text-sm text-gray-500">
                  Find this in your Google Analytics 4 property settings
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Google Ads Conversion Tracking
              </CardTitle>
              <CardDescription>
                Track conversions from Google Ads campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAdsId">Google Ads ID</Label>
                <Input
                  id="googleAdsId"
                  value={settings.googleAdsId}
                  onChange={(e) =>
                    updateSettings({ googleAdsId: e.target.value })
                  }
                  placeholder="AW-XXXXXXXXX"
                  disabled={!isAdmin && !roleLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="googleAdsConversionLabel">Conversion Label (optional)</Label>
                <Input
                  id="googleAdsConversionLabel"
                  value={settings.googleAdsConversionLabel}
                  onChange={(e) =>
                    updateSettings({ googleAdsConversionLabel: e.target.value })
                  }
                  placeholder="XXXXXXXXXX"
                  disabled={!isAdmin && !roleLoading}
                />
                <p className="text-sm text-gray-500">
                  Optional: Used for specific conversion actions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Custom Scripts
              </CardTitle>
              <CardDescription>
                Add custom JavaScript or tracking pixels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAdmin && !roleLoading && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Admin Only</p>
                    <p className="text-sm text-amber-700">
                      Only administrators can edit custom scripts. Contact an admin if you need to add tracking codes.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="headScripts">Head Scripts</Label>
                <Textarea
                  id="headScripts"
                  value={settings.headScripts}
                  onChange={(e) =>
                    updateSettings({ headScripts: e.target.value })
                  }
                  placeholder="<!-- Scripts to inject before </head> -->"
                  rows={6}
                  className="font-mono text-sm"
                  disabled={!isAdmin && !roleLoading}
                />
                <p className="text-sm text-gray-500">
                  Scripts inserted just before the closing &lt;/head&gt; tag
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerScripts">Footer Scripts</Label>
                <Textarea
                  id="footerScripts"
                  value={settings.footerScripts}
                  onChange={(e) =>
                    updateSettings({ footerScripts: e.target.value })
                  }
                  placeholder="<!-- Scripts to inject before </body> -->"
                  rows={6}
                  className="font-mono text-sm"
                  disabled={!isAdmin && !roleLoading}
                />
                <p className="text-sm text-gray-500">
                  Scripts inserted just before the closing &lt;/body&gt; tag
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
