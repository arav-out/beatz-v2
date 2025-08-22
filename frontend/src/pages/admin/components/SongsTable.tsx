import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Trash2 } from "lucide-react";
import EditSongDialog from "./editsong";

const SongsTable = () => {
  const { songs, albums, isLoading, error, deleteSong } = useMusicStore();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-zinc-400'>Loading songs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-red-400'>{error}</div>
      </div>
    );
  }

  // Helper function to get album name by ID
  const getAlbumName = (albumId: string) => {
    const album = albums.find((album) => album._id === albumId);
    return album ? album.title : "N/A";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-zinc-800/50'>
          <TableHead className='w-[50px]'></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Album</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {songs.map((song) => (
          <TableRow key={song._id} className='hover:bg-zinc-800/50'>
            <TableCell>
              <img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />
            </TableCell>
            <TableCell className='font-medium'>{song.title}</TableCell>
            <TableCell>{song.artist}</TableCell>
            <TableCell>{song.albumId ? getAlbumName(song.albumId) : "N/A"}</TableCell> {/* Convert albumId to album name */}
            <TableCell className='text-right'>
              <div className='flex gap-2 justify-end'>
                <EditSongDialog song={{ ...song, duration: song.duration.toString() }} />

                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                  onClick={() => deleteSong(song._id)}
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SongsTable;
