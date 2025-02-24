import VideoCard from "@/components/video-card";
import { getVideoFeed } from "@/lib/nostr/nostr-videos";

export default async function Home() {
  const videofeed = await getVideoFeed();

  const videoComponents = videofeed
    .filter((video) => video?.video?.src)
    .map((video) => <VideoCard key={video.id} note={video} />);

  return (
    <div className="mt-[80px] w-[calc(100%-90px)] max-w-[690px] ml-auto">
      {videoComponents}
    </div>
  );
}
