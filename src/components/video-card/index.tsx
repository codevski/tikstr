"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import PostMainLikes from "./submenu";
import Image from "next/image";
import { NDKUserProfile } from "@nostr-dev-kit/ndk";

interface Notes {
  note: Note;
}

interface Note {
  id: string;
  pubkey: string;
  title: string;
  created_at: number;
  tags: string[][]; // [key, value]
  video: {
    src: string;
    size: string | undefined;
  };
  hashtags: string[];
  npub: string;
  profile: NDKUserProfile | null;
  likes: number;
}

const VideoCard = ({ note }: Notes) => {
  // Auto play video when in view
  useEffect(() => {
    const video = document.getElementById(
      `video-${note?.id}`,
    ) as HTMLVideoElement;
    const noteMainElement = document.getElementById(`NoteMain-${note?.id}`);

    if (noteMainElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        },
        { threshold: [0.6] },
      );
      observer.observe(noteMainElement);
    }
  });

  return (
    <div id={`NoteMain-${note?.id}`} className="flex border-b py-6">
      <div className="cursor-pointer">
        <Image
          alt="profile"
          className="rounded-full max-h-[60px]"
          width="60"
          height="60"
          src={"https://placehold.co/60.png"}
        />
      </div>

      <div className="pl-3 w-full px-4">
        <div className="flex items-center justify-between pb-0.5">
          <Link href={`/p/${note.npub}`}>
            <span className="font-bold hover:underline cursor-pointer">
              {note.profile?.displayName}
            </span>
          </Link>
          <button className="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
            follow
          </button>
        </div>
        <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
          {note.title}
        </p>
        <p className="text-[14px] text-gray-500 pb-0.5">
          {note?.hashtags.map((tag) => {
            return `#${tag} `;
          })}
        </p>
        {/* <p className="text-[14px] pb-0.5 flex items-center font-semibold">
          <FaMusic size={17} />
          <span className="px-1">original sound - example</span>
          <AiFillHeart size={20} />
        </p> */}
        <div className="mt-2.5 flex">
          <div className="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer">
            <video
              id={`video-${note.id}`}
              loop
              controls
              muted
              className="rounded-xl object-cover mx-auto h-full"
              src={note?.video?.src}
            />
            <Image
              alt="overlay"
              className="absolute right-2 bottom-10"
              width="90"
              height="90"
              src="/images/tikstr-overlay.png"
            />
          </div>

          <PostMainLikes post={note} />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
