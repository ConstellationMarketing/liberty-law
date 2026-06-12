import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { PostCategoryRow, PostRow, PostStatus } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@site/components/admin/RichTextEditor";
import {
  defaultPostContent,
  normalizeSlug,
  postToRow,
  rowToPost,
  type PostContent,
} from "@site/lib/cms/postTypes";
import { clearPostsCache } from "@site/hooks/usePostsContent";

export default function AdminPostEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [post, setPost] = useState<PostContent>(defaultPostContent);
  const [categories, setCategories] = useState<PostCategoryRow[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetchCategories();
    if (!isNew && id) void fetchPost(id);
  }, [id, isNew]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("post_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching post categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchPost = async (postId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error || !data) {
      console.error("Error fetching post:", error);
      alert("Failed to load post.");
      navigate("/admin/posts");
    } else {
      setPost(rowToPost(data as PostRow));
    }
    setLoading(false);
  };

  const updatePost = (updates: Partial<PostContent>) => {
    setPost((current) => ({ ...current, ...updates }));
  };

  const handleTitleChange = (title: string) => {
    setPost((current) => ({
      ...current,
      title,
      slug: current.slug ? current.slug : normalizeSlug(title),
    }));
  };

  const handleSave = async () => {
    if (!post.title.trim()) {
      alert("Post title is required.");
      return;
    }

    const resolvedSlug = normalizeSlug(post.slug || post.title);
    if (!resolvedSlug) {
      alert("Post slug is required.");
      return;
    }

    setSaving(true);
    const row = postToRow({ ...post, slug: resolvedSlug });

    let error;
    let savedId = id;
    if (isNew) {
      const result = await supabase
        .from("posts")
        .insert(row)
        .select()
        .single();
      error = result.error;
      savedId = result.data?.id;
    } else {
      const result = await supabase
        .from("posts")
        .update(row)
        .eq("id", id);
      error = result.error;
    }

    if (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post: " + error.message);
    } else {
      clearPostsCache();
      alert("Post saved successfully!");
      if (isNew && savedId) navigate(`/admin/posts/${savedId}`, { replace: true });
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/posts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{isNew ? "New Post" : "Edit Post"}</h1>
            <p className="mt-1 text-gray-500">Manage post content, SEO, category, and publishing</p>
          </div>
        </div>
        <Button onClick={() => void handleSave()} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
          <CardDescription>Title, slug, excerpt, date, and author.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={post.title} onChange={(e) => handleTitleChange(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={post.slug}
              onChange={(e) => updatePost({ slug: e.target.value })}
              onBlur={(e) => updatePost({ slug: normalizeSlug(e.target.value) })}
              placeholder="my-post-slug"
            />
            <p className="text-xs text-gray-500">Public URL: /posts/{normalizeSlug(post.slug || post.title)}/</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="publishDate">Publish Date</Label>
            <Input id="publishDate" type="date" value={post.publishDate} onChange={(e) => updatePost({ publishDate: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorName">Author Name</Label>
            <Input id="authorName" value={post.authorName} onChange={(e) => updatePost({ authorName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={post.categoryId || "none"} onValueChange={(value) => updatePost({ categoryId: value === "none" ? "" : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" value={post.excerpt} onChange={(e) => updatePost({ excerpt: e.target.value })} rows={4} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>These values render exactly as entered on the public post page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" value={post.metaTitle} onChange={(e) => updatePost({ metaTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" value={post.metaDescription} onChange={(e) => updatePost({ metaDescription: e.target.value })} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured Image</CardTitle>
          <CardDescription>Upload a new image or choose an existing media library image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ImageUploader
            value={post.featuredImage}
            folder="posts"
            onChange={(url, metadata) => updatePost({ featuredImage: url, featuredImageAlt: metadata?.altText || post.featuredImageAlt })}
          />
          <div className="space-y-2">
            <Label htmlFor="featuredImageAlt">Featured Image Alt Text</Label>
            <Input id="featuredImageAlt" value={post.featuredImageAlt} onChange={(e) => updatePost({ featuredImageAlt: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Body content uses the existing rich text editor.</CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor value={post.body} onChange={(body) => updatePost({ body })} placeholder="Write the post body..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CTA</CardTitle>
          <CardDescription>Optional call-to-action button shown after the post body.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ctaButtonText">Button Text</Label>
            <Input id="ctaButtonText" value={post.ctaButtonText} onChange={(e) => updatePost({ ctaButtonText: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaButtonLink">Button Link</Label>
            <Input id="ctaButtonLink" value={post.ctaButtonLink} onChange={(e) => updatePost({ ctaButtonLink: e.target.value })} placeholder="/contact/" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
          <CardDescription>Only published posts render publicly.</CardDescription>
        </CardHeader>
        <CardContent className="max-w-sm space-y-2">
          <Label>Status</Label>
          <Select value={post.status} onValueChange={(value) => updatePost({ status: value as PostStatus })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
