import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

interface HeartButtonProps {
  songId: string;
}

const HeartButton: React.FC<HeartButtonProps> = ({ songId }) => {
  const [liked, setLiked] = useState(false);
  const { user } = useUser();
  const API_URL = 'http://localhost:5000'; // Update to match your backend URL

  useEffect(() => {
    const fetchLikedState = async () => {
      try {
        if (!user?.id) return;

        const response = await fetch(`${API_URL}/api/liked-songs/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch liked state');

        const data = await response.json();
        setLiked(data.songs.some((song: { _id: string }) => song._id === songId));
      } catch (error) {
        console.error('Error fetching liked state:', error);
      }
    };

    fetchLikedState();
  }, [user, songId]);

  const toggleLike = async (e: React.MouseEvent) => {
    try {
      e.stopPropagation(); // Prevent event bubbling
      if (!user?.id) return;

      const response = await fetch(`${API_URL}/api/liked-songs/${user.id}/${songId}`, {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${liked ? 'unlike' : 'like'} song`);
      }

      setLiked(!liked);
      toast.success(liked ? 'Removed from Liked Songs 💔' : 'Added to Liked Songs ❤️',
        {
          style: {
            background: '#000000',
            color: '#ffffff',
          },
        });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <button
      onClick={toggleLike}
      className="p-1 hover:scale-110 transition-transform"
    >
      {liked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="red"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="red"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      )}
    </button>
  );
};

export default HeartButton;
