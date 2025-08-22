import { useState, useEffect } from 'react';
import { useMusicStore } from '@/stores/useMusicStore';
import PlayButton from '@/pages/home/components/PlayButton'; // Import PlayButton

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { searchResults, searchSongs } = useMusicStore();

  useEffect(() => {
    if (query.trim() !== '') {
      searchSongs(query);
    }
  }, [query, searchSongs]);

  return (
    <div className="p-4">
      <form className="flex items-center">
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search for songs..."
    className="w-full p-2 rounded-md bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-violet-500"
  />
</form>
      {query.trim() !== '' && (
        <div className="mt-4">
          {searchResults.map((song) => (
            <div key={song._id} className="p-2 border-b border-gray-300 flex items-center gap-3">
              <img
                src={song.imageUrl}
                alt='Song img'
                className='w-12 h-12 rounded-md flex-shrink-0 object-cover'
              />
              <div className='flex-1 min-w-0'>
                <p className='font-medium truncate'>{song.title}</p>
                <p className='text-sm text-gray-500 truncate'>{song.artist}</p>
              </div>
              <PlayButton song={song} /> {/* Add PlayButton */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;