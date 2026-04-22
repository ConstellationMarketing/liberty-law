import { useState, useRef, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import type { Media } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import { optimizeImage } from "../../lib/imageOptimizer";
import { getImageAlt } from "@site/lib/utils/imageAlt";

const isPdfUrl = (url?: string) => !!url && url.toLowerCase().includes(".pdf");
const isPdfMedia = (media: Media) => media.mime_type === "application/pdf";
const getDefaultAltText = (fileName: string, existingAltText?: string | null) =>
  existingAltText?.trim() || getImageAlt(fileName);

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string, metadata?: { altText?: string }) => void;
  onRemove?: () => void;
  bucket?: string;
  folder?: string;
  className?: string;
  placeholder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  onRemove,
  bucket = "media",
  folder = "uploads",
  className,
  placeholder = "Drop an image here or click to upload",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryItems, setLibraryItems] = useState<Media[]>([]);
  const [librarySearch, setLibrarySearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadLibraryItems = useCallback(async () => {
    setLibraryLoading(true);
    setError(null);

    try {
      const { data, error: mediaError } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });

      if (mediaError) {
        throw mediaError;
      }

      setLibraryItems(data || []);
    } catch (err) {
      console.error("[ImageUploader] Failed to load media library:", err);
      setError(err instanceof Error ? err.message : "Failed to load media library");
    } finally {
      setLibraryLoading(false);
    }
  }, []);

  const openLibrary = useCallback(async () => {
    setLibraryOpen(true);
    await loadLibraryItems();
  }, [loadLibraryItems]);

  const handleUpload = useCallback(
    async (file: File) => {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (!isImage && !isPdf) {
        setError("Please upload an image or PDF file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setError(null);
      setUploading(true);

      try {
        const optimized = isImage ? await optimizeImage(file) : file;
        const ext = optimized.name.split(".").pop();
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileName = `${folder}/${timestamp}-${randomStr}.${ext}`;
        const defaultAltText = getDefaultAltText(optimized.name);

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, optimized, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        const publicUrl = urlData.publicUrl;

        onChange(publicUrl, { altText: defaultAltText });

        try {
          const { data: userData, error: userErr } = await supabase.auth.getUser();
          if (userErr) throw userErr;

          const uploadedBy = userData?.user?.id ?? null;

          const { error: mediaErr } = await supabase.from("media").insert({
            file_name: optimized.name,
            file_path: fileName,
            public_url: publicUrl,
            file_size: optimized.size ?? null,
            mime_type: optimized.type ?? null,
            alt_text: defaultAltText,
            uploaded_by: uploadedBy,
          });

          if (mediaErr) {
            console.warn("[ImageUploader] Failed to insert media row:", mediaErr);
          }
        } catch (e) {
          console.warn("[ImageUploader] Failed to register media row:", e);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [bucket, folder, onChange]
  );

  const handleLibrarySelect = useCallback(
    (media: Media) => {
      const altText = getDefaultAltText(media.file_name, media.alt_text);
      onChange(media.public_url, { altText });
      setLibraryOpen(false);
      setLibrarySearch("");
    },
    [onChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUpload(e.dataTransfer.files[0]);
      }
    },
    [handleUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleUpload(e.target.files[0]);
      }
    },
    [handleUpload]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    onRemove?.();
  };

  const filteredLibraryItems = useMemo(() => {
    const query = librarySearch.trim().toLowerCase();

    if (!query) {
      return libraryItems;
    }

    return libraryItems.filter((item) => {
      const haystack = `${item.file_name} ${item.alt_text || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [libraryItems, librarySearch]);

  return (
    <>
      <div className={cn("space-y-2", className)}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleChange}
          className="hidden"
        />

        {value ? (
          <div className="relative group">
            <div className="relative rounded-lg overflow-hidden border bg-gray-50">
              {isPdfUrl(value) ? (
                <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-50">
                  <p className="text-sm text-gray-600 font-medium">PDF Uploaded</p>
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline mt-1"
                  >
                    Open PDF
                  </a>
                </div>
              ) : (
                <img src={value} alt="Uploaded" className="w-full h-48 object-cover" />
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    void openLibrary();
                  }}
                >
                  Choose Existing
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 truncate">{value}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              onClick={handleClick}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                uploading && "pointer-events-none opacity-50"
              )}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <p className="text-sm text-gray-500">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">{placeholder}</p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF, WebP, PDF up to 10MB
                  </p>
                </div>
              )}
            </div>

            <Button type="button" variant="outline" onClick={() => void openLibrary()}>
              Choose from media library
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">or paste URL:</span>
          <Input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="text-xs h-8"
          />
        </div>
      </div>

      <Dialog
        open={libraryOpen}
        onOpenChange={(open) => {
          setLibraryOpen(open);
          if (!open) {
            setLibrarySearch("");
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select from media library</DialogTitle>
            <DialogDescription>
              Choose an existing image or file already uploaded to the media library.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search by filename or alt text..."
                className="pl-10"
              />
            </div>

            {libraryLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading media library...
              </div>
            ) : filteredLibraryItems.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                No media found.
              </div>
            ) : (
              <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto pr-1 md:grid-cols-3 lg:grid-cols-4">
                {filteredLibraryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleLibrarySelect(item)}
                    className="overflow-hidden rounded-lg border bg-white text-left transition-colors hover:border-blue-500"
                  >
                    <div className="aspect-square bg-gray-100">
                      {isPdfMedia(item) ? (
                        <div className="flex h-full items-center justify-center px-3 text-center text-xs font-medium text-gray-500">
                          {item.file_name}
                        </div>
                      ) : (
                        <img
                          src={item.public_url}
                          alt={item.alt_text || item.file_name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="space-y-1 p-3">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {item.file_name}
                      </p>
                      <p className="line-clamp-2 text-xs text-gray-500">
                        {item.alt_text || getDefaultAltText(item.file_name)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
