import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Phone, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PhoneSettingsFieldProps {
  label?: string;
  className?: string;
}

/**
 * Read-only phone display that pulls from Site Settings > Contact Info.
 * Replaces editable phone inputs in page editors — the phone is set globally.
 */
export default function PhoneSettingsField({
  label = "Phone Number",
  className,
}: PhoneSettingsFieldProps) {
  const [phone, setPhone] = useState<string>("");
  const [display, setDisplay] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("phone_number, phone_display")
          .eq("settings_key", "global")
          .single();

        if (data) {
          setPhone(data.phone_number ?? "");
          setDisplay(data.phone_display ?? data.phone_number ?? "");
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className={cn("space-y-1", className)}>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-md border bg-gray-50 px-3 py-2 text-sm">
        <Phone className="h-4 w-4 text-gray-400 shrink-0" />
        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : phone ? (
          <span className="font-medium text-gray-700">{display || phone}</span>
        ) : (
          <span className="text-gray-400 italic">Not configured</span>
        )}
        <a
          href="#/admin/settings"
          className="ml-auto inline-flex items-center gap-1 text-xs text-blue-600 hover:underline shrink-0"
        >
          <ExternalLink className="h-3 w-3" />
          Site Settings
        </a>
      </div>
      <p className="text-xs text-gray-400">
        Managed globally in Site Settings &gt; Contact Info
      </p>
    </div>
  );
}
