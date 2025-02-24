import BottomBar from "@/components/bottom-bar";
import SideNav from "@/components/global/sidenav";
import TopNav from "@/components/global/topnav";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div>
      <TopNav />
      <div className="flex justify-between mx-auto w-full lg:px-2.5 px-0 max-w-[1140px]">
        <SideNav />
        {children}
      </div>
      <BottomBar />
    </div>
  );
};

export default layout;
