import process from "process";

export async function handler(event) {
  const backendUrl = process.env.BACKEND_URL || process.env.VITE_API_URL || "https://mern-ecommerce-production-4dac.up.railway.app/api";
  const url = new URL(event.rawUrl);
  const backendHasApiSegment = backendUrl.replace(/\/+$/, "").endsWith("/api");
  const targetPath = backendHasApiSegment ? url.pathname.replace(/^\/api/, "") : url.pathname;
  const target = new URL(targetPath + url.search, backendUrl);

  const origin = event.headers.origin || event.headers.host || "https://stylehub-mern.netlify.app";
  const corsHeaders = {
    "access-control-allow-origin": origin,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "access-control-allow-headers": "Content-Type,Authorization,X-Requested-With",
    "access-control-expose-headers": "Content-Type,Set-Cookie",
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
  const setCookie = response.headers.get("set-cookie");
  const isBinary = contentType.startsWith("image/") || contentType.startsWith("application/octet-stream");
  const responseBuffer = await response.arrayBuffer();
  const body = isBinary
    ? Buffer.from(responseBuffer).toString("base64")
    : Buffer.from(responseBuffer).toString("utf-8");

  return {
    statusCode: response.status,
    headers: {
      ...corsHeaders,
      "content-type": contentType,
      ...(setCookie ? { "set-cookie": setCookie } : {}),
    },
    body,
    isBase64Encoded: isBinary,
  };
}
