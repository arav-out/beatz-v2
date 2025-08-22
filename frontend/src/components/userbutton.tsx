import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStores"; // Assuming you have an auth store
import { Button } from "@/components/ui/button";

const UserButton2 = () => {
  const { user, signOut, fetchUserDetails } = useAuthStore(); // Assuming you have these methods in your auth store
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      fetchUserDetails(user.id);
    }
  }, [user, fetchUserDetails]);

  const handleSignOut = () => {
    signOut();
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <img
          src={user.imageUrl || "/default-avatar.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <span>{user.username}</span>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-4">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <Button onClick={handleSignOut} className="mt-2 w-full">
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserButton2;