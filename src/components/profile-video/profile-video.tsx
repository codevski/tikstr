import Link from "next/link";
import React, { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {
  id: string;
  npub: string;
  video_url: string;
  description: string;
}

const ProfileVideo = ({ id, npub, video_url, description }: Props) => {
  useEffect(() => {
    const video = document.getElementById(`video${id}`) as HTMLVideoElement;

    setTimeout(() => {
      video.addEventListener("mouseover", () => {
        video.play();
      });
      video.addEventListener("mouseout", () => {
        video.pause();
      });
    }, 50);
  });
  return (
    <div className="relative brightness-90 hover:brightness-[1.1] cursor-pointer">
      {!video_url ? (
        <div className="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black">
          <AiOutlineLoading3Quarters
            className="animate-spin ml-1"
            size="80"
            color="#FFFFFF"
          />
        </div>
      ) : (
        <Link href={`/post/${id}/${npub}`}>
          <video
            id={`video${id}`}
            muted
            loop
            className="aspect-[3/4] object-cover rounded-md"
            src={video_url}
          />
        </Link>
      )}
      <div className="px-1">
        <p className="text-gray-700 text-[15px] pt-1 break-words">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProfileVideo;
