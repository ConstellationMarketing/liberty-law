import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import { defaultHomeContent } from "../../client/lib/cms/homePageTypes";

/**
 * Emergency restore endpoint to fix homepage content that was overwritten with incomplete data
 * This endpoint will restore all 10 practice areas and complete homepage content
 */
export const handleRestoreHomepage: RequestHandler = async (_req, res) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: "Missing Supabase environment variables",
        details:
          "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be configured",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check current homepage content
    const { data: existing } = await supabase
      .from("pages")
      .select("id, content")
      .eq("url_path", "/")
      .single();

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Homepage not found in database",
        message:
          "No homepage entry exists. Use /api/seed-homepage to create one.",
      });
    }

    // Restore complete homepage content
    const { data, error } = await supabase
      .from("pages")
      .update({
        content: defaultHomeContent,
        updated_at: new Date().toISOString(),
      })
      .eq("url_path", "/")
      .select();

    if (error) {
      console.error("Error restoring homepage:", error);
      return res.status(500).json({
        error: "Failed to restore homepage",
        details: error.message,
      });
    }

    // Count practice areas before and after
    const beforeCount = existing.content?.practiceAreas?.length || 0;
    const afterCount = defaultHomeContent.practiceAreas.length;

    res.json({
      success: true,
      message: "Homepage content restored successfully!",
      details: {
        practiceAreasBefore: beforeCount,
        practiceAreasAfter: afterCount,
        restored: afterCount - beforeCount,
        allPracticeAreas: defaultHomeContent.practiceAreas.map(
          (pa) => pa.title,
        ),
      },
      data: data,
      next_step:
        "Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R) to clear cache and see all 10 practice areas",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      error: "Unexpected error occurred",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
