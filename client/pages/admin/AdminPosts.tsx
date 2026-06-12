import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, ExternalLink, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { PostRow } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { postUrl } from "@site/lib/cms/postTypes";
import { clearPostsCache } from "@site/hooks/usePostsContent";

export default function AdminPosts() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      alert("Failed to load posts: " + error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (post: PostRow) => {
    if (!confirm(`Delete post \"${post.title}\"?`)) return;
    setDeletingId(post.id);

    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post: " + error.message);
    } else {
      setPosts((current) => current.filter((item) => item.id !== post.id));
      clearPostsCache();
    }

    setDeletingId(null);
  };

  const filteredPosts = posts.filter((post) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return `${post.title} ${post.slug} ${post.excerpt}`.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <p className="mt-1 text-gray-500">Create and manage blog-style posts</p>
        </div>
        <Link to="/admin/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search posts..."
          className="pl-10"
        />
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Publish Date</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title || "Untitled"}</TableCell>
                <TableCell className="font-mono text-sm text-gray-600">{post.slug}</TableCell>
                <TableCell>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell>{post.publish_date}</TableCell>
                <TableCell>{new Date(post.updated_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {post.status === "published" && (
                      <a href={postUrl(post.slug)} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    <Link to={`/admin/posts/${post.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleDelete(post)}
                      disabled={deletingId === post.id}
                    >
                      {deletingId === post.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-600" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredPosts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                  No posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
