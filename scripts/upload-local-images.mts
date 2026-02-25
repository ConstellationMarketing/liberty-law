import sharp from "sharp";
import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, serviceKey);
const bucket = "media";

async function uploadAsWebp(localPath: string, name: string): Promise<string> {
  const buf = fs.readFileSync(localPath);
  const webpBuf = await sharp(buf).webp({ quality: 82 }).toBuffer();
  const filename = `library/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${name}.webp`;
  const { error } = await supabase.storage.from(bucket).upload(filename, webpBuf, { contentType: "image/webp", upsert: true });
  if (error) throw error;
  const url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
  await supabase.from("media").insert({ file_name: `${name}.webp`, file_path: filename, public_url: url, file_size: webpBuf.byteLength, mime_type: "image/webp" });
  return url;
}

async function main() {
  const googleUrl = await uploadAsWebp("public/images/logos/google-icon.png", "google-icon");
  console.log(`GOOGLE_ICON=${googleUrl}`);
  const quoteUrl = await uploadAsWebp("public/images/backgrounds/quote-bg.png", "quote-bg");
  console.log(`QUOTE_BG=${quoteUrl}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
