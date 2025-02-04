import { NDKFilter, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { getNDK } from "./nostr";
import { getHexPubkey, isValidVideo } from "../utils";

interface VideoPost {
  id: string;
  title: string;
  summary: string;
  video: {
    src: string;
    size: string | undefined;
  };
  thumb: string;
  created_at: number;
  pubkey: string;
  hashtags: string[];
  npub: string;
  tags: string[][];
  profile: NDKUserProfile | null;
}

export async function getVideoFeed(limit: number = 5) {
  const ndk = await getNDK();

  const filter: NDKFilter = {
    kinds: [34235], // NIP-71 video event kind
    limit: limit,
    since: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // Last 7 days
  };

  try {
    const events = await ndk.fetchEvents(filter);
    console.log("Events: ", events);

    const sortedEvents = await Promise.all(
      Array.from(events)
        .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
        .map(async (event) => {
          try {
            const user = ndk.getUser({ pubkey: event.pubkey });
            const userProfile = await user.fetchProfile();

            const videoTag =
              event.tags.find((t) => t[0] === "url")?.[1] ||
              event.tags.find((t) => t[0] === "imeta")?.[1]?.split("url ")?.[1];

            if (!videoTag || !isValidVideo({ url: videoTag })) return null;

            return {
              id: event.id,
              title: event.tags.find((t) => t[0] === "title")?.[1],
              summary: event.tags.find((t) => t[0] === "summary")?.[1] || "",
              video: {
                src: videoTag,
                size: event.tags.find((t) => t[0] === "size")?.[1],
              },
              thumb: event.tags.find((t) => t[0] === "thumb")?.[1],
              created_at: event.created_at || 0,
              hashtags: [event.tags.find((t) => t[0] === "t")?.[1]],
              pubkey: event.pubkey,
              npub: user.npub,
              profile: userProfile,
            };
          } catch (e) {
            console.error("Error parsing video event content:", e);
            return null;
          }
        }),
    );

    const filteredEvents = sortedEvents.filter(
      (post): post is VideoPost => post !== null,
    );
    return filteredEvents;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}

export async function getUserVideos(pubkey: string, limit: number = 5) {
  const ndk = await getNDK();
  const hexPubkey = getHexPubkey(pubkey);

  const filter: NDKFilter = {
    kinds: [34235], // Updated to correct kind
    authors: [hexPubkey],
    limit: limit,
    since: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60,
  };

  try {
    const events = await ndk.fetchEvents(filter);
    const sortedEvents = Array.from(events)
      .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
      .map((event) => {
        let content;
        try {
          // Try to parse as JSON first
          content = JSON.parse(event.content);
        } catch (e) {
          console.log("Error parsing JSON content:", e);
          // If not JSON, look for video URL in the tags
          const videoTag = event.tags.find((tag) => tag[0] === "url");
          const thumbTag = event.tags.find((tag) => tag[0] === "thumb");
          const titleTag = event.tags.find((tag) => tag[0] === "title");

          content = {
            title: titleTag ? titleTag[1] : event.content,
            summary: event.content,
            url: videoTag ? videoTag[1] : null,
            thumb: thumbTag ? thumbTag[1] : null,
          };
        }

        return {
          id: event.id,
          title: content.title,
          summary: content.summary || event.content,
          video: {
            src: content.url || content.video,
          },
          thumb: content.thumb
            ? {
                src: content.thumb,
              }
            : undefined,
          created_at: event.created_at || 0,
          pubkey: event.pubkey,
        };
      })
      .filter((post) => post.video.src); // Only return posts that have a video URL

    return sortedEvents;
  } catch (error) {
    console.error("Error fetching user videos:", error);
    throw error;
  }
}
