import { AiFillHeart } from "react-icons/ai";
import { FaShare, FaCommentDots } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";
import { FiZap } from "react-icons/fi";
import { NDKUserProfile } from "@nostr-dev-kit/ndk";

interface PostWithProfile {
  id: string;
  created_at: number;
  profile: NDKUserProfile | null;
  likes: number;
}
interface PostMainLikesCompTypes {
  post: PostWithProfile;
}

export default function PostMainLikes({ post }: PostMainLikesCompTypes) {
  return (
    <>
      <div id={`PostMainLikes-${post?.id}`} className="relative mr-[75px]">
        <div className="absolute bottom-0 pl-2">
          <div className="text-center">
            <button
              // disabled={hasClickedLike}
              // onClick={() => likeOrUnlike()}
              className="rounded-full bg-gray-200 p-2 cursor-pointer text-gray-900"
            >
              {!false ? (
                <AiFillHeart color={false ? "#ff2626" : ""} size="25" />
              ) : (
                <BiLoaderCircle className="animate-spin" size="25" />
              )}
            </button>
            <span className="text-xs text-gray-800 font-semibold dark:text-gray-100">
              {post.likes}
            </span>
          </div>

          <button
            // onClick={() =>
            //   router.push(`/post/${post?.id}/${post?.profile?.user_id}`)
            // }
            className="text-center"
          >
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer text-gray-900">
              <FaCommentDots size="25" />
            </div>
            <span className="text-xs text-gray-800 font-semibold dark:text-gray-100">
              43
            </span>
          </button>

          <button className="text-center">
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer text-gray-900">
              <FaShare size="25" />
            </div>
            <span className="text-xs text-gray-800 font-semibold dark:text-gray-100">
              55
            </span>
          </button>

          <button className="text-center">
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer text-gray-900">
              <FiZap size="25" />
            </div>
            <span className="text-xs text-gray-800 font-semibold dark:text-gray-100">
              350
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
