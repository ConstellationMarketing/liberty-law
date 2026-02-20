import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import { defaultPracticeAreasContent } from "../../client/lib/cms/practiceAreasPageTypes";

export const handleSeedPracticeAreas: RequestHandler = async (req, res) => {
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

    const { data: existing } = await supabase
      .from("pages")
      .select("id, status, content")
      .eq("url_path", "/practice-areas")
      .single();

    const forceOverwrite = req.query.force === "true";

    if (existing && !forceOverwrite) {
      return res.status(400).json({
        success: false,
        error: "Practice Areas page already exists",
        message:
          "Practice Areas page already exists. Use ?force=true to overwrite (WARNING: This will replace all content)",
        existingId: existing.id,
        existingStatus: existing.status,
      });
    }

    const { data, error } = await supabase
      .from("pages")
      .upsert(
        {
          url_path: "/practice-areas",
          title: "Practice Areas",
          status: "published",
          page_type: "standard",
          content: defaultPracticeAreasContent,
          meta_title: "Practice Areas - Liberty Law, P.C.",
          meta_description:
            "Comprehensive legal representation across criminal defense, real estate, and civil matters.",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "url_path",
        },
      )
      .select();

    if (error) {
      console.error("Error seeding practice areas page:", error);
      return res.status(500).json({
        error: "Failed to seed practice areas page",
        details: error.message,
      });
    }

    res.json({
      success: true,
      message: existing
        ? "Practice Areas page content restored with default data"
        : "Practice Areas page entry created successfully!",
      data: data,
      next_step: "Visit /admin/pages to edit the practice areas page content",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      error: "Unexpected error occurred",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
