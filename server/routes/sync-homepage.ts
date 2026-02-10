import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import { defaultHomeContent, HomePageContent } from "../../client/lib/cms/homePageTypes";

/**
 * Sync homepage content endpoint - Updates database to match current frontend structure
 * This safely migrates from old schema to new schema while preserving customizations
 */
export const handleSyncHomepage: RequestHandler = async (_req, res) => {
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

    // Fetch current homepage content
    const { data: existing, error: fetchError } = await supabase
      .from("pages")
      .select("id, content, status")
      .eq("url_path", "/")
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching homepage:", fetchError);
      return res.status(500).json({
        success: false,
        error: "Database error",
        details: fetchError.message,
      });
    }

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Homepage not found in database",
        message: "No homepage entry exists. Use /api/seed-homepage to create one.",
      });
    }

    const currentContent = existing.content as any;

    // Build synced content - use current content where available, defaults otherwise
    const syncedContent: HomePageContent = {
      // Hero - use current customizations if available
      hero: currentContent?.hero || defaultHomeContent.hero,
      
      // About - preserve existing
      about: currentContent?.about || defaultHomeContent.about,
      
      // Practice Areas Intro - update description to match current frontend
      practiceAreasIntro: defaultHomeContent.practiceAreasIntro,
      
      // Practice Areas - use defaults (all 10 with correct content)
      practiceAreas: defaultHomeContent.practiceAreas,
      
      // CTA - new section replacing awards
      cta: defaultHomeContent.cta,
      
      // Testimonials - preserve existing
      testimonials: currentContent?.testimonials || defaultHomeContent.testimonials,
      
      // Team - new section replacing process/googleReviews
      team: defaultHomeContent.team,
      
      // FAQ - preserve existing
      faq: currentContent?.faq || defaultHomeContent.faq,
      
      // Contact - use defaults (updated address and removed description)
      contact: defaultHomeContent.contact,
    };

    // Update database with synced content
    const { data: updated, error: updateError } = await supabase
      .from("pages")
      .update({
        content: syncedContent,
        updated_at: new Date().toISOString(),
      })
      .eq("url_path", "/")
      .select();

    if (updateError) {
      console.error("Error syncing homepage:", updateError);
      return res.status(500).json({
        error: "Failed to sync homepage",
        details: updateError.message,
      });
    }

    res.json({
      success: true,
      message: "Homepage content synced successfully!",
      changes: {
        updated: [
          "hero (updated to current content)",
          "practiceAreasIntro (updated description)",
          "practiceAreas (all 10 practice areas with correct content)",
          "cta (new CTA section replacing awards)",
          "team (new team section)",
          "contact (updated address, removed lorem ipsum)",
        ],
        removed: [
          "partnerLogos (not used in current frontend)",
          "awards (replaced by CTA section)",
          "process (replaced by Team section)",
          "googleReviews (removed from frontend)",
        ],
        preserved: [
          "about",
          "testimonials",
          "faq",
        ],
      },
      practiceAreas: syncedContent.practiceAreas.map(pa => pa.title),
      data: updated,
      next_step: "Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R) and refresh the CMS admin page to see updated content",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      error: "Unexpected error occurred",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
