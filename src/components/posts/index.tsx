"use client";
import { useEffect, useState } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getUserPosts } from "@/lib/nostr/nostr-posts";

interface Post {
  id: string;
  content: string;
  created_at: number;
}

export function UserPosts({ pubkey }: { pubkey: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const events = await getUserPosts(pubkey);
        const formattedPosts = events.map((event: NDKEvent) => ({
          id: event.id,
          content: event.content,
          created_at: event.created_at || 0,
        }));
        setPosts(formattedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [pubkey]);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

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
