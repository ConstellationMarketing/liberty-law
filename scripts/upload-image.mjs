const SUPABASE_URL = "https://yruteqltqizjvipueulo.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydXRlcWx0cWl6anZpcHVldWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDU1OTUsImV4cCI6MjA4NjIyMTU5NX0.JUG7UZ1j1v4jQYt0f-rZ0fd52si1DZ0ampkzbMWRAeM";
const IMAGE_URL = "https://cdn.builder.io/api/v1/image/assets%2F50bd0f2438824f8ea1271cf7dd2c508e%2Ffa8b1f4ac9cf4c87bd9df9bf94974018?format=webp&width=800&height=1200";

async function main() {
  // Sign in
  const authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "web@goconstellation.com", password: "R3JubESWAyoG69" }),
  });
  const authData = await authRes.json();
  const token = authData.access_token;
  console.log("Authenticated successfully");

  // Download image
  const imgRes = await fetch(IMAGE_URL);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
  console.log("Downloaded image:", imgBuffer.length, "bytes");

  // Upload to Supabase Storage
  const filename = `library/${Date.now()}-about-meeting.webp`;
  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/media/${filename}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/webp",
      "x-upsert": "true",
    },
    body: imgBuffer,
  });
  const uploadData = await uploadRes.json();
  console.log("Upload result:", JSON.stringify(uploadData));
  console.log("Public URL:", `${SUPABASE_URL}/storage/v1/object/public/media/${filename}`);
}

main().catch(console.error);
