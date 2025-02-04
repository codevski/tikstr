"use client";

// import { UserPostsDebug } from "@/components/posts/debug";
// import { UserVideos } from "@/components/posts/video";
// import { getAllUserEvents } from "@/lib/nostr/nostr-debug";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import { BsPencil } from "react-icons/bs";
import ProfileVideo from "@/components/profile-video/profile-video";
import EditProfile from "@/components/edit-profile";

const Profile = () => {
  const [edit, setEdit] = React.useState(false);
  const npub = usePathname().split("/")[2];

  // useEffect(() => {
  //   getAllUserEvents(npub).then((events) => {
  //     console.log("All user events:", events);
  //   });
  // }, [npub]);

  console.log("NPUB: ", npub);
  return (
    <>
      {edit && <EditProfile setEdit={setEdit} />}
      <div className="pt-[90px] ml-[90px] 2xl:pl-[185px] lg:pl-[160px] lg:pr-0 w-[calc(100%-90px)] pr-3 max-w-[1800px] 2xl:mx-auto">
        <div className="flex w-[calc(100vw-230px)]">
          {true ? (
            <Image
              alt="profile"
              className="w-[120px] min-w-[120px] rounded-full"
              src="https://placehold.co/120.png"
              width="120"
              height="120"
            />
          ) : (
            <div className="min-w-[120px] h-[120px] bg-gray-200 rounded-full" />
          )}
          <div className="ml-5 w-full">
            {true ? (
              <div>
                <p className="text-[30px] font-bold truncate">John Doe</p>
                <p className="text-[18px] truncate">John Doe</p>
              </div>
            ) : (
              <div className="h-[60px]" />
            )}
            {true ? (
              <button
                onClick={() => setEdit(!edit)}
                className="flex item-center rounded-md py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray-100 hover:text-gray-900"
              >
                <BsPencil className="mt-0.5 mr-1" size="18" />
                <span>Edit profile</span>
              </button>
            ) : (
              <button className="flex item-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold bg-[#F02C56]">
                Follow
              </button>
            )}
          </div>
          {/* <UserPostsDebug pubkey={npub} /> */}
          {/* <h1 className="text-2xl font-bold my-4 block pt-20">Nostr Videos</h1>
        <UserVideos pubkey={npub} limit={12} /> */}
        </div>
        <div className="flex items-center pt-4">
          <div className="mr-4">
            <span className="font-bold">10K</span>
            <span className="text-gray-500 font-light text-[15px] pl-1.5">
              Following
            </span>
          </div>
          <div className="mr-4">
            <span className="font-bold">44K</span>
            <span className="text-gray-500 font-light text-[15px] pl-1.5">
              Followers
            </span>
          </div>
        </div>
        <p className="pt-4 mr-4 text-gray-500 font-light text-[15px] pl-1.5 max-w-[500px]">
          some bio here
        </p>

        <ul className="w-full flex items-center pt-4 border-b">
          <li className="w-60 text-center py-2 text-[17px] font-semibold border-b-2 border-b-black dark:border-b-white">
            Videos
          </li>
          <li className="w-60 text-gray-500 text-center py-2 text-[17px] font-semibold">
            Liked
          </li>
        </ul>
        <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
          {[1, 2, 3].map((note, i) => (
            <ProfileVideo
              key={i}
              id={npub}
              npub={npub}
              video_url="/videos/debug.mp4"
              description="Some description"
            />
          ))}
        </div>
        <div className="pb-20" />
      </div>
    </>
  );
};

export default Profile;
