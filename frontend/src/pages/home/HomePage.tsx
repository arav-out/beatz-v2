import Topbar from "@/components/Topbar";
import { useEffect, useState } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import SearchBar from "@/layout/components/SearchBar";
import DecryptedText from "@/layout/components/decrpyt/decrypt";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore();

  const [greeting, setGreeting] = useState("Good Day");

  // Function to determine greeting based on IST
  const getGreeting = () => {
    const now = new Date();
    const hours = now.getHours(); // Get current hour in local time (IST if server is in IST)
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, featuredSongs, trendingSongs]);

  useEffect(() => {
    setGreeting(getGreeting()); // Set the greeting when the component mounts
  }, []);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">   <DecryptedText
      text={greeting}
      className="text-2xl sm:text-3xl font-bold text-white"
      encryptedClassName="text-2xl sm:text-3xl font-bold text-zinc-500"
      parentClassName="mb-6"
      speed={125}
      sequential
      revealDirection="start"
      animateOn="view"
    />
          {/* <h1 className="text-2xl sm:text-3xl font-bold mb-6">{greeting}</h1> */}
          <SearchBar />
          <FeaturedSection />
          <div className="space-y-8">
            <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading} />
            <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading} />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;