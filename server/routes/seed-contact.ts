import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import { defaultContactContent } from "../../client/lib/cms/contactPageTypes";

export const handleSeedContact: RequestHandler = async (req, res) => {
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
      .eq("url_path", "/contact")
      .single();

    const forceOverwrite = req.query.force === "true";

    if (existing && !forceOverwrite) {
      return res.status(400).json({
        success: false,
        error: "Contact page already exists",
        message:
          "Contact page already exists. Use ?force=true to overwrite (WARNING: This will replace all content)",
        existingId: existing.id,
        existingStatus: existing.status,
      });
    }

    const { data, error } = await supabase
      .from("pages")
      .upsert(
        {
          url_path: "/contact",
          title: "Contact",
          status: "published",
          page_type: "standard",
          content: defaultContactContent,
          meta_title: "Contact Us - Liberty Law, P.C.",
          meta_description:
            "Contact us for a free consultation. Available 24/7.",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "url_path",
        },
      )
      .select();

    if (error) {
      console.error("Error seeding contact page:", error);
      return res.status(500).json({
        error: "Failed to seed contact page",
        details: error.message,
      });
    }

    res.json({
      success: true,
      message: existing
        ? "Contact page content restored with default data"
        : "Contact page entry created successfully!",
      data: data,
      next_step: "Visit /admin/pages to edit the contact page content",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      error: "Unexpected error occurred",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
