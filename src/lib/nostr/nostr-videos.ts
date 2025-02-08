import NDK, {
  NDKEvent,
  NDKFilter,
  NDKUserProfile,
  NDKKind,
} from "@nostr-dev-kit/ndk";
import { getNDK } from "./nostr";
import { getHexPubkey, isValidVideo } from "../utils";
import { fetchUser, fetchUserProfile } from "./nostr-user";
import { Relay } from "nostr-tools/relay";

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
  likes: number;
}

// const getVideoComments = async (videoEventId: string) => {
//   const ndk = await getNDK();
//   const filter: NDKFilter = {
//     kinds: [22], // NIP-71 video event kind
//     // limit: 2,
//     "#e": [videoEventId],
//   };
//   const comments = await ndk.fetchEvents(filter);

//   return comments.size;
// };

const getVideoLikes = async (videoEventId: string, pubkey: string) => {
  const ndk = await getNDK();
  // const relay = await Relay.connect("wss://relay.j35tr.com");
  // console.log(`connected to ${relay.url}`);

  // relay.subscribe(
  //   [
  //     {
  //       kinds: [NDKKind.Reaction],
  //       "#e": [videoEventId],
  //     },
  //   ],
  //   {
  //     onevent(event) {
  //       console.log(`got event id: ${videoEventId} :`, event);
  //     },
  //   },
  // );

  // let eventss = await pool.querySync(relays, { kinds: [0, 1] });

  console.log("VIDEO EVENT ID: ", videoEventId);
  // console.log("VIDEO PUB ID: ", pubkey);
  const filter: NDKFilter = {
    kinds: [NDKKind.Reaction, NDKKind.Report], // NIP-71 video event kind
    // limit: 1,
    "#e": [videoEventId],
    // "#p": [pubkey],
    // "#k": [NDKKind.VerticalVideo.toString()],
    // since: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // Last 7 days
  };
  console.log("GETTING likes");
  const likes = await ndk.fetchEvents(filter);

  console.log("LIKES: ", likes);

  const totalLikes = likes.size;

  return totalLikes;
};

const parseEvent = async (ndk: NDK, event: NDKEvent) => {
  try {
    const userProfile = await fetchUserProfile(event.pubkey);
    const user = await fetchUser(event.pubkey);

    const videoTag =
      event.tags.find((t) => t[0] === "url")?.[1] ||
      event.tags.find((t) => t[0] === "imeta")?.[1]?.split("url ")?.[1];

    if (!videoTag || !isValidVideo({ url: videoTag })) return null;
    const likes = await getVideoLikes(event.id, event.pubkey);
    // const comments = await getVideoComments(event.id);

    // console.log("COMMENTS: ", comments);

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
      npub: userProfile?.nip05 || user?.npub,
      profile: userProfile,
      likes: likes,
    };
  } catch (e) {
    console.error(`Error parsing video event content for ID ${event.id}: `, e);
    return null;
  }
};

export const getVideoFeed = async (limit: number = 5) => {
  const ndk = await getNDK();

  const filter: NDKFilter = {
    kinds: [34235], // NIP-71 video event kind
    limit: limit,
    since: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // Last 7 days
  };

  try {
    const events = await ndk.fetchEvents(filter);
    console.log("Events: ", events);

    const parsedEvents = await Promise.all(
      Array.from(events)
        .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
        .map(async (event) => parseEvent(ndk, event)),
    );

    return parsedEvents.filter((post): post is VideoPost => post !== null);
  } catch (error) {
    console.error("Error fetching video feed:", error);
    throw new Error("Error fetching video feed");
  }
};

export async function getUserVideos(pubkey: string, limit: number = 5) {
  const ndk = await getNDK();
  const hexPubkey = getHexPubkey(pubkey);
  // const user = await fetchUser(pubkey);

  // if (!user) {
  //   throw new Error("User not found");
  // }

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
