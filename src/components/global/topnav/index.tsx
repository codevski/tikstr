"use client";

import Link from "next/link";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSearch, BiUser } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { ModeToggle } from "../../theme-toggle";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TopNav = () => {
  // WIP - Implement user context from nostr
  const [showMenu, setShowMenu] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const router = useRouter();
  return (
    <>
      <div
        id="TopNav"
        className="fixed dark:bg-white z-30 flex items-center w-full border-b h-[60px]"
      >
        <div className="flex items-center justify-between gap-6 w-full px-4 mx-auto max-w-[1150px]">
          <Link href="/">
            <Image
              className="min-w-[115px] w-[115px]"
              src="/images/tikstr.png"
              alt="logo"
              width="115"
              height="30"
            />
          </Link>
          <div className="relative hidden md:flex items-center justify-end bg-[#F1F1F2] p-1 rounded-full max-w-[430px] w-full text-gray-900">
            <input
              type="text"
              // onChange={handleSearchName}
              className="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
              placeholder="Search accounts"
            />
            {false && (
              <div className="absolute bg-white max-w-[910px] h-auto w-full z-20 left-0 top-12 border p-1">
                <div className="p-1">
                  <Link
                    href="/profile/1"
                    className="flex items-center justify-between w-full cursor-pointer hover:bg-[#F12B56] p-1 px-2 hover:text-white"
                  >
                    <div className="flex items-center">
                      <Image
                        className="rounded-md"
                        width="40"
                        alt="profile"
                        src="https://placehold.co/40.png"
                      />
                      <div className="truncate ml-2">John Doe</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            <div className="px-3 py-1 flex items-center border-l border-l-gray-300">
              <BiSearch color="#A1A2A7" size="22" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/upload">
              <button className="flex items-center border rounded-sm py-[6px] hover:bg-gray-100 pl-1.5 text-gray-900 ">
                <AiOutlinePlus color="#000000" size="22" />
                <span className="px-2 font-medium text-[15px]">Upload</span>
              </button>
            </Link>

            {!isLoginOpen ? (
              <div className="flex items-center">
                <button
                  className="flex items-center bg-[#F02C56] text-white border rounded-md px-3 py-[6px]"
                  onClick={() => setIsLoginOpen(!isLoginOpen)}
                >
                  <span className="whitespace-nowrap mx-4 font-medium text-[15px]">
                    Log in
                  </span>
                </button>
                <BsThreeDotsVertical color="#161724" size="25" />
              </div>
            ) : (
              <div className="flex items-center text-gray-900">
                <div className="relative">
                  <button
                    className="mt-1 border border-gray-200 rounded-full"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <Image
                      className="rounded-full w-[35px] h-[35px]"
                      alt="profile"
                      src="https://placehold.co/40.png"
                      width="35"
                      height="35"
                    />
                  </button>

                  {showMenu ? (
                    <div className="absolute bg-white rounded-lg py-1.5 w-[200px] shadow-xl border top-[40px] right-0">
                      <button
                        onClick={() => {
                          router.push("/p/npub123");
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full justify-start py-3 px-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <BiUser size="20" />
                        <span className="pl-2 font-semibold text-sm">
                          Profile
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setIsLoginOpen(false);
                          setShowMenu(false);
                        }}
                        className="flex items-center justify-start w-full py-3 px-1.5 hover:bg-gray-100 border-t cursor-pointer"
                      >
                        <FiLogOut size={20} />
                        <span className="pl-2 font-semibold text-sm">
                          Log out
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNav;
