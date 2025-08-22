import { useState } from "react";
import Topbar from "@/components/Topbar";

import MyFriends from "./myfriends.";
import FriendRequests from "./Friendrequest";
import AddFriend from "./Addfriend";
import GooeyNav from "@/layout/components/GooeyNav/GooeyNav";

// Import the GooeyNav component


const AddFriendPage = () => {
  const [selectedSection, setSelectedSection] = useState("add-friend");

  // Define GooeyNav items
  const items = [
    {
      label: "ADD FRIEND",
      href: "#",
      onClick: () => setSelectedSection("add-friend"),
    },
    {
      label: "MY FRIENDS",
      href: "#",
      onClick: () => setSelectedSection("my-friends"),
    },
    {
      label: "FRIEND REQUESTS",
      href: "#",
      onClick: () => setSelectedSection("friend-requests"),
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex flex-col items-center justify-center p-4 bg-zinc-900">
        {/* GooeyNav in place of old buttons */}
        <div style={{ height: '200px', position: 'relative' }}>
          <GooeyNav
            items={items}
            animationTime={700}
            pCount={100}
            minDistance={20}
            maxDistance={42}
            maxRotate={75}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            timeVariance={2000}
          />
        </div>

        <div className="w-full mt-8">
          {selectedSection === "add-friend" && <AddFriend />}
          {selectedSection === "my-friends" && <MyFriends />}
          {selectedSection === "friend-requests" && <FriendRequests />}
        </div>
      </div>
    </div>
  );
};

export default AddFriendPage;
