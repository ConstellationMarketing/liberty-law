import { useEffect, useState } from "react";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { PostCategoryRow } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  defaultPostCategory,
  normalizeSlug,
  postCategoryToRow,
  rowToPostCategory,
  type PostCategory,
} from "@site/lib/cms/postTypes";
import { clearPostsCache } from "@site/hooks/usePostsContent";

export default function AdminPostCategories() {
  const [categories, setCategories] = useState<PostCategoryRow[]>([]);
  const [editing, setEditing] = useState<PostCategory>(defaultPostCategory);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("post_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching post categories:", error);
      alert("Failed to load categories: " + error.message);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const resetEditor = () => setEditing(defaultPostCategory);

  const updateEditing = (updates: Partial<PostCategory>) => {
    setEditing((current) => ({ ...current, ...updates }));
  };

  const handleNameChange = (name: string) => {
    setEditing((current) => ({
      ...current,
      name,
      slug: current.slug ? current.slug : normalizeSlug(name),
    }));
  };

  const handleSave = async () => {
    if (!editing.name.trim()) {
      alert("Category name is required.");
      return;
    }

    setSaving(true);
    const row = postCategoryToRow({ ...editing, slug: normalizeSlug(editing.slug || editing.name) });

    const result = editing.id
      ? await supabase.from("post_categories").update(row).eq("id", editing.id)
      : await supabase.from("post_categories").insert(row);

    if (result.error) {
      console.error("Error saving category:", result.error);
      alert("Failed to save category: " + result.error.message);
    } else {
      clearPostsCache();
      resetEditor();
      await fetchCategories();
    }
    setSaving(false);
  };

  const handleDelete = async (category: PostCategoryRow) => {
    if (!confirm(`Delete category \"${category.name}\"? Posts assigned to it will become uncategorized.`)) return;

    const { error } = await supabase.from("post_categories").delete().eq("id", category.id);
    if (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category: " + error.message);
    } else {
      clearPostsCache();
      await fetchCategories();
      if (editing.id === category.id) resetEditor();
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post Categories</h1>
          <p className="mt-1 text-gray-500">Manage categories for CMS posts</p>
        </div>

        <div className="rounded-lg border bg-white">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between border-b p-4 last:border-0">
              <div>
                <h2 className="font-semibold text-gray-900">{category.name}</h2>
                <p className="font-mono text-sm text-gray-500">/category/{category.slug}/</p>
                {category.description && <p className="mt-1 text-sm text-gray-600">{category.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(rowToPostCategory(category))}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void handleDelete(category)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
          {categories.length === 0 && <div className="p-8 text-center text-gray-500">No categories created yet.</div>}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editing.id ? "Edit Category" : "New Category"}</CardTitle>
          <CardDescription>Category pages render at /category/category-slug/.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={editing.name} onChange={(e) => handleNameChange(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={editing.slug} onChange={(e) => updateEditing({ slug: e.target.value })} onBlur={(e) => updateEditing({ slug: normalizeSlug(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={editing.description} onChange={(e) => updateEditing({ description: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Featured Image</Label>
            <ImageUploader
              value={editing.featuredImage}
              folder="post-categories"
              onChange={(url, metadata) => updateEditing({ featuredImage: url, imageAlt: metadata?.altText || editing.imageAlt })}
            />
          </div>
          <div className="space-y-2">
            <Label>Image Alt Text</Label>
            <Input value={editing.imageAlt} onChange={(e) => updateEditing({ imageAlt: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Meta Title</Label>
            <Input value={editing.metaTitle} onChange={(e) => updateEditing({ metaTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea value={editing.metaDescription} onChange={(e) => updateEditing({ metaDescription: e.target.value })} rows={3} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {editing.id ? "Save Category" : "Create Category"}
            </Button>
            {editing.id && (
              <Button variant="outline" onClick={resetEditor}>Cancel</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
