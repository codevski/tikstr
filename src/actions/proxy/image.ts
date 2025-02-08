export const proxyNostrImage = async (url: string) => {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type");

    if (!contentType?.startsWith("image/")) {
      throw new Error("Invalid image type");
    }
    const imageBuffer = await response.arrayBuffer();

    return {
      data: imageBuffer,
      contentType,
      success: true,
    };
  } catch (error) {
    console.error("Image processing error", error);
    return {
      success: false,
      error: "Failed to process image",
    };
  }
};
