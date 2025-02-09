import { proxyNostrImage } from "@/actions/proxy/image";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const nostrUrl = request.nextUrl.searchParams.get("url");

  if (!nostrUrl) {
    return new Response("Missing URL", { status: 400 });
  }

  const result = await proxyNostrImage(nostrUrl);

  if (!result.success) {
    return new NextResponse("Failed to fetch image", { status: 500 });
  }

  // Only include Content-Type if it exists
  const headers: HeadersInit = {
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  if (result.contentType) {
    headers["Content-Type"] = result.contentType;
  }

  return new NextResponse(result.data, { headers });
}
