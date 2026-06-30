import process from "process";

export async function handler(event) {
  const backendUrl = process.env.BACKEND_URL || process.env.VITE_API_URL || "https://mern-ecommerce-production-4dac.up.railway.app/api";
  const url = new URL(event.rawUrl);
  const target = new URL(url.pathname + url.search, backendUrl);

  const origin = event.headers.origin || event.headers.host || "https://stylehub-mern.netlify.app";
  const corsHeaders = {
    "access-control-allow-origin": origin,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "access-control-allow-headers": "Content-Type,Authorization,X-Requested-With",
    vary: "Origin",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...corsHeaders,
        "content-length": "0",
      },
      body: "",
    };
  }

  const headers = { ...event.headers };
  delete headers.host;

  const response = await fetch(target, {
    method: event.httpMethod,
    headers,
    body: event.httpMethod === "GET" || event.httpMethod === "HEAD" ? undefined : event.body,
  });

  const contentType = response.headers.get("content-type") || "application/json";
  const body = await response.text();

  return {
    statusCode: response.status,
    headers: {
      ...corsHeaders,
      "content-type": contentType,
    },
    body,
  };
}
