import { proxyNostrImage } from "@/actions/proxy/image";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("fetchAndOptimizeImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("successfully fetches and processes a valid image", async () => {
    const mockImageBuffer = new ArrayBuffer(8);
    const mockReponse = new Response(mockImageBuffer, {
      headers: { "Content-Type": "image/png" },
    });

    global.fetch = vi.fn().mockResolvedValue(mockReponse);

    const result = await proxyNostrImage("https://tikstr.com/image.jpg");

    expect(fetch).toHaveBeenCalledWith("https://tikstr.com/image.jpg");

    expect(result).toEqual({
      data: mockImageBuffer,
      contentType: "image/png",
      success: true,
    });
  });

  it("handle non-image content type", async () => {
    const mockResponse = new Response(null, {
      headers: {
        "content-type": "text/plain",
      },
    });

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await proxyNostrImage("https://tikstr.com/not-an-image.txt");

    expect(result).toEqual({
      success: false,
      error: "Failed to process image",
    });
  });

  it("handles network errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await proxyNostrImage("https://tikstr.com/image.jpg");

    expect(result).toEqual({
      success: false,
      error: "Failed to process image",
    });
  });

  it("handles missing content-type header", async () => {
    const mockResponse = new Response(null);

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await proxyNostrImage("https://tikstr.com/missing.jpg");

    expect(result).toEqual({
      success: false,
      error: "Failed to process image",
    });
  });

  it("handles invalid URLs", async () => {
    const result = await proxyNostrImage("invalid-url");

    expect(result).toEqual({
      success: false,
      error: "Failed to process image",
    });
  });

  it("logs errors", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error");

    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    await proxyNostrImage("https://tikstr.com/image.jpg");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Image processing error",
      new Error("Network error"),
    );
  });
});
