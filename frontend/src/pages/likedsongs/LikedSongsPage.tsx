import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/clerk-react";
import PlaylistSkeleton from "@/components/skeletons/PlayListSkeleton";

import PlayButnew from "../home/components/PlayButnew";
import Heartbtnnew from "../home/components/heartbtnnew";
import DecryptedText from "@/layout/components/decrpyt/decrypt";

const LikedSongsPage = () => {
  const { likedSongs, fetchLikedSongs, isLoading } = useMusicStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchLikedSongs(user.id); // Use user.id (clerkId) to fetch liked songs
    }
  }, [fetchLikedSongs, user]);

  return (
    <main
      className="rounded-md overflow-hidden h-full bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
            to-zinc-900 "
    >
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Liked Songs</h1>
          {isLoading ? (
            <PlaylistSkeleton />
          ) : likedSongs.length > 0 ? (
            <div className="space-y-2">
              {likedSongs.map((song) => (
                <div
                  key={song._id}
                  className="relative p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={song.imageUrl}
                    alt="Song img"
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                  </div>

                  <Heartbtnnew songId={song._id} /> {/* Add HeartButton */}
                  <PlayButnew song={song} /> {/* Add PlayButton */}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <DecryptedText
                text="Add songs to Liked Songs"
                className="text-2xl sm:text-3xl font-bold text-zinc-500"
                encryptedClassName="text-2xl sm:text-3xl font-bold text-zinc-500"
                parentClassName="mb-6"
                speed={75}
                sequential
                revealDirection="start"
                animateOn="view"
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

export default LikedSongsPage;