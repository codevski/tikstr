import VideoCard from "@/components/video-card";
import { getVideoFeed } from "@/lib/nostr/nostr-videos";

export default async function Home() {
  const videofeed = await getVideoFeed();

  console.log("VideoFeed: ", videofeed);
  return (
    <div className="mt-[80px] w-[calc(100%-90px)] max-w-[690px] ml-auto">
      {videofeed.map(async (video) => {
        if (video?.video.src) {
          return <VideoCard key={video.id} note={video} />;
        }
      })}
    </div>
  );
}
