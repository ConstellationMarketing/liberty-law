import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import { defaultHomeContent } from "../../client/lib/cms/homePageTypes";

export const handleSeedHomepage: RequestHandler = async (_req, res) => {
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

    // Insert or update homepage entry
    const { data, error } = await supabase
      .from("pages")
      .upsert(
        {
          url_path: "/",
          title: "Home",
          status: "published",
          page_type: "standard",
          content: defaultHomeContent,
          meta_title: "Home - Liberty Law, P.C.",
          meta_description:
            "Protecting your rights with integrity, experience, and relentless advocacy.",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "url_path",
        }
      )
      .select();

    if (error) {
      console.error("Error seeding homepage:", error);
      return res.status(500).json({
        error: "Failed to seed homepage",
        details: error.message,
      });
    }

    res.json({
      success: true,
      message: "Homepage entry created/updated successfully!",
      data: data,
      next_step: "Visit /admin/pages to edit the homepage content",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      error: "Unexpected error occurred",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
