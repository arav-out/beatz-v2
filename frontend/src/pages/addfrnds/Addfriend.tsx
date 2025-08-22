import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { AnimatedSubscribeButton } from "@/components/magicui/animated-subscribe-button";
import toast from "react-hot-toast";

const AddFriend = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { users, fetchUsers } = useChatStore();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const deBounce = setTimeout(() => {
      searchFriends();
    }, 500);
    return () => {
      clearTimeout(deBounce);
    };
  }, [searchQuery]);

  const searchFriends = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users/search/${searchQuery}`);
      if (response.data.users.length > 0) {
        setSearchResults(response.data.users);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.log("Error searching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    if (!userId) return;
    try {
      const response = await axiosInstance.get(`/users/add-friend/${userId}`);
      if (response.status === 200 || response.status === 400) {
        toast.success(response.data.message, {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
      }
    } catch (error: any) {
      console.log("Error sending friend request:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message, {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
      }
    }
  };

  return (
    <div className="text-white">
      <h1 onClick={()=> {
        console.log(axiosInstance.defaults);
        
      }} className="text-2xl font-semibold mb-4">Add Friend</h1>

      {/* Search Users Section */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search users by full name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 text-white flex-1 outline-none focus:ring-2 focus:ring-violet-500"
        />
      </form>

      {loading && <p>Loading...</p>}

      {/* Search Results */}
      <div className="space-y-4 mb-8">
        {searchResults &&
          searchResults.map((result: any) => (
            <div
              key={result._id}
              className="flex items-center justify-between p-4 bg-zinc-800 rounded-md"
            >
              <div>
                <img
                  src={result.imageUrl}
                  alt=""
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                />
                <p className="font-semibold">{result.fullName}</p>
              </div>

              <AnimatedSubscribeButton>
                <span onClick={() => sendFriendRequest(result._id)}>
                  Send Request
                </span>
                <span>Request Sent</span>
              </AnimatedSubscribeButton>
            </div>
          ))}
      </div>

      {/* All Users Section */}
      {searchResults.length === 0 && (
        <>
          <div className="space-y-4 bg-zinc-900 p-4 rounded-lg">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 bg-zinc-800 rounded-md"
              >
                <Avatar className="size-10 border border-zinc-800">
                  <AvatarImage src={user.imageUrl} alt={user.fullName} />
                  <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">{user.fullName}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AddFriend;
