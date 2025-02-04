import { expect, test } from "vitest";
import { isValidVideo } from "@/lib/utils";

test("is a valid video url", () => {
  expect(isValidVideo({ url: "https://youtube.com/GDF345S" })).toBe(false);
  expect(isValidVideo({ url: "https://nostr.build/video.mp4" })).toBe(true);
  expect(isValidVideo({ url: "" })).toBe(false);
});
