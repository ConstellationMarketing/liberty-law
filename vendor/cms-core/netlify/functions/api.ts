import type { Handler } from "@netlify/functions";
import type { RequestHandler } from "express";
import { handleGoogleReviews } from "../../../../server/routes/google-reviews";
import { handleHealthCheck } from "../../../../server/routes/health-check";
import { handleSitemap } from "../../../../server/routes/sitemap";

interface AdapterResult {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

async function runRequestHandler(
  handler: RequestHandler,
  query: Record<string, string> | null,
): Promise<AdapterResult> {
  let statusCode = 200;
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
  };
  let responseBody = "";

  const response = {
    status(code: number) {
      statusCode = code;
      return response;
    },
    set(name: string, value: string) {
      headers[name] = value;
      return response;
    },
    setHeader(name: string, value: string) {
      headers[name] = value;
      return response;
    },
    json(body: unknown) {
      headers["Content-Type"] = "application/json";
      responseBody = JSON.stringify(body);
      return response;
    },
    send(body: unknown) {
      responseBody = String(body ?? "");
      return response;
    },
  };

  await handler(
    { query: query || {} } as never,
    response as never,
    () => undefined,
  );

  return { statusCode, headers, body: responseBody };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const path = event.path.replace(/\/+$/, "");

  if (path.endsWith("/google-reviews")) {
    return runRequestHandler(handleGoogleReviews, event.queryStringParameters);
  }

  if (path.endsWith("/health")) {
    return runRequestHandler(handleHealthCheck, event.queryStringParameters);
  }

  if (path.endsWith("/sitemap.xml")) {
    return runRequestHandler(handleSitemap, event.queryStringParameters);
  }

  if (path.endsWith("/ping")) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: process.env.PING_MESSAGE ?? "ping" }),
    };
  }

  return {
    statusCode: 404,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not found" }),
  };
};
