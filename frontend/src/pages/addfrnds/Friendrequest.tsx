import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


interface FriendRequest {
  _id: string; // ID of the user who sent the friend request
  fullName: string;
  email: string;
}

const FriendRequests = () => {
  const { isSignedIn } = useAuth();
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  // Fetch friend requests from the database
  const getRequests = async () => {
    try {
      const response = await axiosInstance.get("/users/friend/requests");
      console.log("Friend requests:", response.data);
      setRequests(response.data); // Set the friend requests in state
    } catch (error: any) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const testFucntion = ()=>{
    console.log('Axios Instance Config:', {
      baseURL: axiosInstance.defaults.baseURL,
      timeout: axiosInstance.defaults.timeout,
      headers: axiosInstance.defaults.headers,
      withCredentials: axiosInstance.defaults.withCredentials,
    }, "test function called", isSignedIn);
  }
  // Accept a friend request
  const acceptRequest = async (requestId: string) => {
    try {
      const response = await axiosInstance.post(`/users/friend/accept/${requestId}`);
      if (response.status === 200) {
        toast.success("Friend request accepted!", {
          style: {
            background: 'black', 
            color: 'white', 
            padding: '16px',
          },
        });
        // Remove the accepted request from the list
        setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
      }
    } catch (error: any) {
      console.error("Error accepting friend request:", error);
    }
  };

  // Reject a friend request
  const rejectRequest = async (requestId: string) => {
    try {
      const response = await axiosInstance.delete(`/users//friend/reject/${requestId}`);
      if (response.status === 200){
        toast.success("Friend request rejected!", {
          style: {
            background: 'black', 
            color: 'white', 
            padding: '16px',
          },
        });
        // Remove the rejected request from the list
        setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
      }
    } catch (error: any) {
      console.error("Error rejecting friend request:", error);
    }
  };

  useEffect(() => {
    getRequests(); // Fetch friend requests when the component mounts
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-2xl font-semibold mb-4">Friend Requests</h1>
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req:any) => (
            <div
              key={req._id}
              className="flex items-center justify-between p-4 bg-zinc-800 rounded-md"
            >
              <div>
                <img src={req.imageUrl} alt=""  style={{width:"50px",height:"50px"}}/>
                <p className="font-semibold">{req.fullName}</p>
                <p className="text-sm text-zinc-400">{req.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptRequest(req._id)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(req._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p onClick={testFucntion}>No friend requests found.</p>
      )}
    </div>
  );
};

export default FriendRequests;