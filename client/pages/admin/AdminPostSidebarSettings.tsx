import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostSidebarSettingsRow } from "@/lib/database.types";
import {
  defaultPostSidebarSettings,
  postSidebarSettingsToRow,
  rowToPostSidebarSettings,
  type PostSidebarSettings,
} from "@site/lib/cms/postTypes";
import { clearPostsCache } from "@site/hooks/usePostsContent";

export default function AdminPostSidebarSettings() {
  const [settings, setSettings] = useState<PostSidebarSettings>(defaultPostSidebarSettings);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("post_sidebar_settings")
      .select("*")
      .eq("settings_key", "global")
      .single();

    if (error) {
      console.error("Error fetching post sidebar settings:", error);
      setSettings(defaultPostSidebarSettings);
    } else if (data) {
      setSettingsId(data.id);
      setSettings(rowToPostSidebarSettings(data as PostSidebarSettingsRow));
    }
    setLoading(false);
  };

  const updateSettings = (updates: Partial<PostSidebarSettings>) => {
    setSettings((current) => ({ ...current, ...updates }));
  };

  const handleSave = async () => {
    setSaving(true);
    const row = postSidebarSettingsToRow(settings);

    const result = settingsId
      ? await supabase.from("post_sidebar_settings").update(row).eq("id", settingsId)
      : await supabase.from("post_sidebar_settings").insert(row).select().single();

    if (result.error) {
      console.error("Error saving post sidebar settings:", result.error);
      alert("Failed to save post sidebar settings: " + result.error.message);
    } else {
      if (!settingsId && "data" in result && result.data) setSettingsId(result.data.id);
      clearPostsCache();
      alert("Post sidebar settings saved successfully!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post Sidebar Settings</h1>
          <p className="mt-1 text-gray-500">Control the reusable sidebar and posts listing SEO.</p>
        </div>
        <Button onClick={() => void handleSave()} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts Listing SEO</CardTitle>
          <CardDescription>Metadata for the public /posts/ listing page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Meta Title</Label>
            <Input value={settings.postsMetaTitle} onChange={(e) => updateSettings({ postsMetaTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea value={settings.postsMetaDescription} onChange={(e) => updateSettings({ postsMetaDescription: e.target.value })} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sidebar Intro/Card</CardTitle>
          <CardDescription>Shown at the top of the post sidebar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input value={settings.introHeading} onChange={(e) => updateSettings({ introHeading: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={settings.introDescription} onChange={(e) => updateSettings({ introDescription: e.target.value })} rows={3} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Optional Button Text</Label>
              <Input value={settings.introButtonText} onChange={(e) => updateSettings({ introButtonText: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Optional Button Link</Label>
              <Input value={settings.introButtonLink} onChange={(e) => updateSettings({ introButtonLink: e.target.value })} placeholder="/contact/" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Recent published posts shown in the sidebar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label>Show recent posts</Label>
            <Switch checked={settings.showRecentPosts} onCheckedChange={(checked) => updateSettings({ showRecentPosts: checked })} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Heading Text</Label>
              <Input value={settings.recentPostsHeading} onChange={(e) => updateSettings({ recentPostsHeading: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Number of Recent Posts</Label>
              <Input type="number" min={1} value={settings.recentPostsLimit} onChange={(e) => updateSettings({ recentPostsLimit: Number(e.target.value) })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Post category links shown in the sidebar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label>Show categories</Label>
            <Switch checked={settings.showCategories} onCheckedChange={(checked) => updateSettings({ showCategories: checked })} />
          </div>
          <div className="space-y-2">
            <Label>Heading Text</Label>
            <Input value={settings.categoriesHeading} onChange={(e) => updateSettings({ categoriesHeading: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom CTA Box</CardTitle>
          <CardDescription>Optional CTA card shown near the bottom of the sidebar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label>Show CTA box</Label>
            <Switch checked={settings.showCtaBox} onCheckedChange={(checked) => updateSettings({ showCtaBox: checked })} />
          </div>
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input value={settings.ctaHeading} onChange={(e) => updateSettings({ ctaHeading: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={settings.ctaDescription} onChange={(e) => updateSettings({ ctaDescription: e.target.value })} rows={3} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input value={settings.ctaButtonText} onChange={(e) => updateSettings({ ctaButtonText: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input value={settings.ctaButtonLink} onChange={(e) => updateSettings({ ctaButtonLink: e.target.value })} placeholder="/contact/" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
