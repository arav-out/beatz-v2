import PlaylistSkeleton from "@/components/skeletons/PlayListSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";

import { SignedIn } from "@clerk/clerk-react";

import { Heart, HomeIcon, Library, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DecryptedText from "./decrpyt/decrypt";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "w-full justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Liked Songs section */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <Link
          to={"/liked-songs"}
          className="flex items-center text-white px-2 hover:bg-zinc-800 rounded-md p-2"
        >
          <Heart className="size-5 mr-2" />
          <span className="hidden md:inline">Liked Songs</span>
        </Link>
      </div>

      {/* Library section */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Albums</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-md bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2 overflow-y-scroll max-h-[37rem]">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : filteredAlbums.length > 0 ? (
              filteredAlbums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="yuyuyuy p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={album.imageUrl}
                    alt="Playlist img"
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">{album.title}</p>
                    <p className="text-sm text-zinc-400 truncate">Album • {album.artist}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
               <DecryptedText
                     text={"Nothing Found!"}
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
      </div>
    </div>
  );
};

export default LeftSidebar;