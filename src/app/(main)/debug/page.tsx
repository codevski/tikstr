"use client";
import { SimplePool, Filter, Event } from "nostr-tools";
import { useEffect } from "react";

export default function DebugPage() {
  useEffect(() => {
    async function debugVideoReactions() {
      const pool = new SimplePool();
      const relays = [
        "wss://relay.damus.io",
        "wss://nos.lol",
        "wss://relay.nostr.band",
        "wss://relay.j35tr.com",
      ];

      // const testEventId =
      //   "ce2658e54c226968c4fb4949eb492b4a136b2273615d1e4e2828377ff064084e";
      const testEventId =
        "0fa082834b2996b1dd9ce6ed3c0be73b3205a3eab2d097e8886c37de75418cd5";

      try {
        const filter: Filter = {
          kinds: [1111],
          "#e": [testEventId],
          "#E": [testEventId],
        };

        console.log("Starting reaction fetch for:", testEventId);
        const events = await pool.querySync(relays, filter);

        console.log("Total reactions:", events.length);
        console.log("All reaction events:", events);

        const reactionTypes = events.reduce(
          (acc, event: Event) => {
            const content = event.content;
            acc[content] = (acc[content] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        console.log("Reaction breakdown:", reactionTypes);
      } catch (error) {
        console.error("Debug failed:", error);
      } finally {
        pool.close(relays);
      }
    }

    debugVideoReactions();
  }, []);

  return (
    <div className="p-4">
      <h1>Debug Page</h1>
      <p>Check the console for reaction data</p>
    </div>
  );
}
