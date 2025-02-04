"use client";
import { useEffect, useState } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getUserPosts } from "@/lib/nostr/nostr-posts";

interface Post {
  id: string;
  content: string;
  created_at: number;
}

export function UserPostsDebug({ pubkey }: { pubkey: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchPosts() {
      try {
        console.log("Starting to fetch posts");
        const events = await getUserPosts(pubkey);
        console.log("Received events:", events);

        if (!mounted) return;

        if (events.length === 0) {
          setLoading(false);
          return;
        }

        const formattedPosts = events.map((event: NDKEvent) => ({
          id: event.id,
          content: event.content,
          created_at: event.created_at || 0,
        }));
        setPosts(formattedPosts);
      } catch (err) {
        console.error("Error in fetchPosts:", err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, [pubkey]);

  if (loading) return <div>Loading posts... (This may take a few seconds)</div>;
  if (error) return <div>Error: {error}</div>;
  if (posts.length === 0) return <div>No posts found</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded-lg">
          <p className="text-gray-700">{post.content}</p>
          <time className="text-sm text-gray-500">
            {new Date(post.created_at * 1000).toLocaleString()}
          </time>
        </div>
      ))}
    </div>
  );
}
