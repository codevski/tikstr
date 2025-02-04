import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { RiGroupLine } from "react-icons/ri";
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineExplore } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { LuSquareActivity } from "react-icons/lu";

interface Props {
  icon: string;
  size: string;
}

const MenuItem = ({ icon, size }: Props) => {
  const getIcon = () => {
    switch (icon) {
      case "For You":
        return <AiOutlineHome size={size} />;

      case "Explore":
        return <MdOutlineExplore size={size} />;

      case "Following":
        return <RiGroupLine size={size} />;

      case "Friends":
        return <FaUserFriends size={size} />;

      case "Activity":
        return <LuSquareActivity size={size} />;

      case "Messages":
        return <FiMessageSquare size={size} />;
    }
  };

  return (
    <>
      <div className="w-full flex items-center hover:bg-gray-100 dark:hover:bg-neutral-800 p-2.5 rounded-md">
        <div className="flex items-center lg:mx-0 mx-auto">
          {getIcon()}

          <p
            className={`lg:block hidden pl-[9px] mt-0.5 font-semibold text-[17px]`}
          >
            {icon}
          </p>
        </div>
      </div>
    </>
  );
};

export default MenuItem;
