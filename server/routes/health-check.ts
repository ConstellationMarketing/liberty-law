import { RequestHandler } from "express";

interface HealthCheckResponse {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  checks: {
    environment: {
      status: "ok" | "error";
      details: {
        supabaseUrl: boolean;
        supabaseAnonKey: boolean;
        supabaseServiceRoleKey: boolean;
      };
      missing?: string[];
    };
    supabase?: {
      status: "ok" | "error";
      message: string;
      details?: any;
    };
  };
}

export const handleHealthCheck: RequestHandler = async (req, res) => {
  const response: HealthCheckResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    checks: {
      environment: {
        status: "ok",
        details: {
          supabaseUrl: !!process.env.VITE_SUPABASE_URL,
          supabaseAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
          supabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
      },
    },
  };

  // Check environment variables
  const missingVars: string[] = [];
  if (!process.env.VITE_SUPABASE_URL) missingVars.push("VITE_SUPABASE_URL");
  if (!process.env.VITE_SUPABASE_ANON_KEY)
    missingVars.push("VITE_SUPABASE_ANON_KEY");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    missingVars.push("SUPABASE_SERVICE_ROLE_KEY");

  if (missingVars.length > 0) {
    response.checks.environment.status = "error";
    response.checks.environment.missing = missingVars;
    response.status = "error";
  }

  // Test Supabase connection if environment is valid
  if (response.checks.environment.status === "ok") {
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

      const testResponse = await fetch(
        `${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`,
        {
          headers: {
            apikey: supabaseAnonKey!,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        },
      );

      if (testResponse.ok) {
        response.checks.supabase = {
          status: "ok",
          message: "Successfully connected to Supabase",
        };
      } else {
        response.checks.supabase = {
          status: "error",
          message: `Supabase connection failed with HTTP ${testResponse.status}`,
          details: await testResponse.text().catch(() => "Unable to read error"),
        };
        response.status = "degraded";
      }
    } catch (err) {
      response.checks.supabase = {
        status: "error",
        message: "Failed to connect to Supabase",
        details: err instanceof Error ? err.message : String(err),
      };
      response.status = "degraded";
    }
  }

  // Set HTTP status code based on health
  const httpStatus = response.status === "ok" ? 200 : response.status === "degraded" ? 200 : 503;

  res.status(httpStatus).json(response);
};
