// lib/nostr-debug.ts
import { NDKFilter } from "@nostr-dev-kit/ndk";
import { getNDK } from "./nostr";
import { getHexPubkey } from "../utils";

export async function getAllUserEvents(pubkey: string) {
  const ndk = await getNDK();
  const hexPubkey = getHexPubkey(pubkey);

  // Don't specify kinds to get all events
  const filter: NDKFilter = {
    authors: [hexPubkey],
    limit: 10, // Increase this if needed
  };

  try {
    const events = await ndk.fetchEvents(filter);
    const sortedEvents = Array.from(events).sort(
      (a, b) => (b.created_at || 0) - (a.created_at || 0),
    );

    // Group events by kind
    const eventsByKind = sortedEvents.reduce(
      (acc, event) => {
        const kind = event.kind;
        if (!acc[kind]) {
          acc[kind] = [];
        }
        acc[kind].push(event);
        return acc;
      },
      {} as Record<number, any[]>,
    );

    // Print summary
    Object.entries(eventsByKind).forEach(([kind, events]) => {
      console.log(`Kind ${kind}: ${events.length} events`);
      // Show example of first event
      if (events.length > 0) {
        console.log("Example event:", {
          id: events[0].id,
          kind: events[0].kind,
          content: events[0].content.slice(0, 100) + "...",
          created_at: new Date(events[0].created_at! * 1000).toLocaleString(),
        });
      }
    });

    return eventsByKind;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
