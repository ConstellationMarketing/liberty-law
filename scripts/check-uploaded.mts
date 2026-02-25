import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const s = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!);
const { data } = await s.from("media").select("file_name, public_url").or("file_name.like.%google-icon%,file_name.like.%quote-bg%").order("created_at", { ascending: false }).limit(4);
for (const r of data || []) console.log(r.file_name + " => " + r.public_url);
