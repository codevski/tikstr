// lib/nostr.ts
import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { DEFAULT_RELAYS } from "../constants";

// Singleton instance
let ndkInstance: NDK | null = null;

export const getNDK = async () => {
  if (ndkInstance) return ndkInstance;

  // Initialize NDK with default configuration
  ndkInstance = new NDK({
    explicitRelayUrls: DEFAULT_RELAYS,
  });

  try {
    await ndkInstance.connect();
    console.log("Connected to Nostr network");
  } catch (e) {
    console.error("Failed to connect to Nostr network:", e);
    throw e;
  }

  return ndkInstance;
};

// Optional: Initialize with NIP-07 signer (browser extension)
export const getNDKWithSigner = async () => {
  if (ndkInstance) return ndkInstance;

  const nip07signer = new NDKNip07Signer();

  ndkInstance = new NDK({
    signer: nip07signer,
    explicitRelayUrls: DEFAULT_RELAYS,
  });

  try {
    await ndkInstance.connect();
    console.log("Connected to Nostr network with signer");
  } catch (e) {
    console.error("Failed to connect to Nostr network:", e);
    throw e;
  }

  return ndkInstance;
};

// Example usage in a component:
/*
import { getNDK } from '@/lib/nostr';

export default async function YourComponent() {
  const ndk = await getNDK();
  // Use NDK here
}
*/
