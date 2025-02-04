"use client";
import { getUserVideos } from "@/lib/nostr/nostr-videos";
import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react"; // Import icons

interface VideoPost {
  id: string;
  title?: string;
  summary?: string;
  video: {
    src: string;
    type?: string;
  };
  thumb?: {
    src: string;
  };
  created_at: number;
}

interface UserVideosProps {
  pubkey: string;
  limit?: number;
}

export function UserVideos({ pubkey, limit = 10 }: UserVideosProps) {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function loadUserVideos() {
      try {
        const userVideos = await getUserVideos(pubkey, limit);
        setVideos(userVideos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    }
    loadUserVideos();
  }, [pubkey, limit]);

  const handlePlayClick = (videoId: string) => {
    if (activeVideoId === videoId) {
      // Toggle play/pause for current video
      const videoElement = document.getElementById(
        `video-${videoId}`,
      ) as HTMLVideoElement;
      if (videoElement) {
        if (isPlaying) {
          videoElement.pause();
        } else {
          videoElement.play();
        }
        setIsPlaying(!isPlaying);
      }
    } else {
      // Stop previous video if any
      if (activeVideoId) {
        const prevVideo = document.getElementById(
          `video-${activeVideoId}`,
        ) as HTMLVideoElement;
        if (prevVideo) {
          prevVideo.pause();
          prevVideo.currentTime = 0;
        }
      }
      // Play new video
      const videoElement = document.getElementById(
        `video-${videoId}`,
      ) as HTMLVideoElement;
      if (videoElement) {
        videoElement.play();
        setIsPlaying(true);
      }
      setActiveVideoId(videoId);
    }
  };

  if (loading) return <div>Loading videos...</div>;
  if (error) return <div>Error: {error}</div>;
  if (videos.length === 0) return <div>No videos found for this user</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden group"
        >
          <video
            id={`video-${video.id}`}
            src={video.video.src}
            className=" inset-0 w-full h-full object-cover"
            poster={video.thumb?.src}
            playsInline
            onEnded={() => {
              setIsPlaying(false);
              setActiveVideoId(null);
            }}
          />

          {/* Play button overlay */}
          <button
            onClick={() => handlePlayClick(video.id)}
            className=" inset-0 w-full h-full flex items-center justify-center
                     bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {activeVideoId === video.id && isPlaying ? (
              <Pause className="w-16 h-16 text-white" />
            ) : (
              <Play className="w-16 h-16 text-white" />
            )}
          </button>

          {/* Video info overlay */}
          <div className=" bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            {video.title && (
              <h3 className="text-white font-medium truncate">{video.title}</h3>
            )}
            <div className="text-white/70 text-sm">
              {new Date(video.created_at * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
