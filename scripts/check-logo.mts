import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const s = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!);
const { data } = await s.from("site_settings").select("logo_url").limit(1);
console.log("DB logo_url:", data?.[0]?.logo_url);
const { data: pub } = await s.from("site_settings_public").select("logo_url").eq("settings_key", "global").limit(1);
console.log("Public logo_url:", pub?.[0]?.logo_url);
