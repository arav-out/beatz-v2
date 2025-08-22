import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Button } from "@/components/ui/button";
  import { Upload, Pencil } from "lucide-react";
  import { useRef, useState } from "react";
  import toast from "react-hot-toast";
  import { axiosInstance } from "@/lib/axios";
  import { useMusicStore } from "@/stores/useMusicStore";
  
  interface Song {
    _id: string;
    title: string;
    artist: string;
    album?: string;
    duration: string;
  }
  
  interface EditSongDialogProps {
    song: Song;
  }
  
  const EditSongDialog = ({ song }: EditSongDialogProps) => {
    const { albums } = useMusicStore();
    const [editOpen, setEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    const [songData, setSongData] = useState({
      title: song.title,
      artist: song.artist,
      album: song.album || "none",
      duration: song.duration,
    });
  
    const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
      audio: null,
      image: null,
    });
  
    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
  
    const handleUpdate = async () => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("title", songData.title);
        formData.append("artist", songData.artist);
        formData.append("duration", songData.duration);
        if (songData.album !== "none") {
          formData.append("albumId", songData.album);
        }
  
        if (files.audio) formData.append("audioFile", files.audio);
        if (files.image) formData.append("imageFile", files.image);
  
        await axiosInstance.put(`/admin/songs/${song._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        toast.success("Song updated successfully");
        setEditOpen(false);
      } catch (error: any) {
        toast.error("Failed to update song: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-sm flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle>Edit Song</DialogTitle>
            <DialogDescription>Update song details and media</DialogDescription>
          </DialogHeader>
  
          <div className="space-y-4 py-4">
            <input type="file" ref={audioInputRef} hidden accept="audio/*"
              onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))} />
            <input type="file" ref={imageInputRef} hidden accept="image/*"
              onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))} />
  
            {/* Image Picker */}
            <div
              className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
              onClick={() => imageInputRef.current?.click()}
            >
              <div className="text-center">
                {files.image ? (
                  <>
                    <div className="text-sm text-emerald-500">New image selected</div>
                    <div className="text-xs text-zinc-400">{files.image.name.slice(0, 20)}</div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                      <Upload className="h-6 w-6 text-zinc-400" />
                    </div>
                    <div className="text-sm text-zinc-400 mb-2">Update artwork (optional)</div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>
  
            {/* Audio Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Audio File (optional)</label>
              <Button variant="outline" onClick={() => audioInputRef.current?.click()} className="w-full">
                {files.audio ? files.audio.name.slice(0, 20) : "Choose new audio file"}
              </Button>
            </div>
  
            {/* Input Fields */}
            <Input
              value={songData.title}
              onChange={(e) => setSongData({ ...songData, title: e.target.value })}
              placeholder="Title"
              className="bg-zinc-800 border-zinc-700"
            />
            <Input
              value={songData.artist}
              onChange={(e) => setSongData({ ...songData, artist: e.target.value })}
              placeholder="Artist"
              className="bg-zinc-800 border-zinc-700"
            />
            <Input
              type="number"
              min="0"
              value={songData.duration}
              onChange={(e) => setSongData({ ...songData, duration: e.target.value || "0" })}
              placeholder="Duration (seconds)"
              className="bg-zinc-800 border-zinc-700"
            />
  
            <Select
              value={songData.album}
              onValueChange={(value) => setSongData({ ...songData, album: value })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select album" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="none">No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
  
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default EditSongDialog;
  