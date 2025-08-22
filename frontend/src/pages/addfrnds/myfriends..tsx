import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

interface Friend {
  _id: string; // ID of the friend
  fullName: string;
  email: string;
  imageUrl: string;
}

const MyFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch friends from the database
  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users/FriendList/get/"); // Corrected spelling
      console.log("Friends:", response.data);
      setFriends(response.data); // Set the friends in state
      console.log(response.data);
      
    } catch (error: any) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove a friend
  const removeFriend = async (friendId: string) => {
    try {
      const response = await axiosInstance.get(`/users/remove-friend/${friendId}`);
      if (response.status === 200) {
        toast.success("Removed from friends!", {
          style: {
            background: 'black', 
            color: 'white', 
            padding: '16px',
          },
        });
        // Remove the friend from the list
        setFriends((prevFriends) => prevFriends.filter((friend) => friend._id !== friendId));
      }
    } catch (error: any) {
      console.error("Error removing friend:", error);
    }
  };

  useEffect(() => {
    fetchFriends(); // Fetch friends when the component mounts
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-2xl font-semibold mb-4">My Friends</h1>
      {loading ? (
        <p>Loading...</p>
      ) : friends.length > 0 ? (
        <div className="space-y-4">
          {friends.map((friend, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-zinc-800 rounded-md"
            >
              <div className="flex items-center gap-3">
                <img
                  src={friend.imageUrl}
                  alt={friend.fullName}
                  className="w-10 h-10 rounded-full border border-zinc-700"
                />
                <div>
                  <p className="font-semibold">{friend.fullName}</p>
                  <p className="text-sm text-zinc-400">{friend.email}</p>
                </div>
              </div>
              <button
                onClick={() => removeFriend(friend._id)}
                className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No friends found.</p>
      )}
    </div>
  );
};

export default MyFriends;