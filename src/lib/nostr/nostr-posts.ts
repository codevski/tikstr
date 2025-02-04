"use client";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import { getNDK } from "./nostr";
import { getHexPubkey } from "../utils";

export async function getUserPosts(pubkey: string, limit: number = 5) {
  const ndk = await getNDK();
  console.log("NDK instance:", ndk);

  // Debug relay connections
  console.log(
    "Connected relays:",
    Array.from(ndk.pool.relays.values()).map(
      (relay) => `${relay.url} (${relay.status})`,
    ),
  );

  // Convert npub to hex if needed
  const hexPubkey = getHexPubkey(pubkey);

  // Create filter for text notes (kind: 1) from the specific user
  const filter: NDKFilter = {
    kinds: [1], // kind 1 represents text notes
    authors: [hexPubkey],
    limit: limit,
    // Sort by newest first
    since: 0,
  };

  try {
    // Fetch events matching our filter
    const events = await ndk.fetchEvents(filter);
    // Convert the Set to an Array and sort by creation time
    const sortedEvents = Array.from(events).sort(
      (a, b) => (b.created_at || 0) - (a.created_at || 0),
    );

    return sortedEvents;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
