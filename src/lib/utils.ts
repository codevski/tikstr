import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nip19 } from "nostr-tools";
import { VALID_VIDEO_EXTENSIONS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to always get hex
export const getHexPubkey = (pubkey: string) => {
  if (pubkey.startsWith("npub")) {
    const { data } = nip19.decode(pubkey);
    return data as string;
  }
  return pubkey;
};

interface isValidVideoProps {
  url: string;
}

export const isValidVideo = ({ url }: isValidVideoProps) => {
  if (!url) return false;
  return VALID_VIDEO_EXTENSIONS.some((ext) => url.endsWith(ext));
};
