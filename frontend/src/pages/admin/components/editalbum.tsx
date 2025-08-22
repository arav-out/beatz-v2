import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Pencil, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const EditAlbumDialog = ({ album, onAlbumUpdated }: {
	album: {
		_id: string;
		title: string;
		artist: string;
		releaseYear: number;
		imageUrl: string;
	};
	onAlbumUpdated: (updatedAlbum: any) => void;
}) => {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [editAlbum, setEditAlbum] = useState({
		title: album.title,
		artist: album.artist,
		releaseYear: album.releaseYear,
	});
	const [imageFile, setImageFile] = useState<File | null>(null);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) setImageFile(file);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("title", editAlbum.title);
			formData.append("artist", editAlbum.artist);
			formData.append("releaseYear", editAlbum.releaseYear.toString());
			if (imageFile) {
				formData.append("imageFile", imageFile);
			}

			const res = await axiosInstance.put(`/admin/albums/${album._id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			toast.success("Album updated");
			setEditDialogOpen(false);
			onAlbumUpdated(res.data.album); // Callback for parent to refresh UI
		} catch (error: any) {
			toast.error("Failed to update album: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="text-sm">
					<Pencil className="h-4 w-4 mr-2" />
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-700'>
				<DialogHeader>
					<DialogTitle>Edit Album</DialogTitle>
					<DialogDescription>Edit album details below</DialogDescription>
				</DialogHeader>
				<div className='space-y-4 py-4'>
					<input
						type='file'
						ref={fileInputRef}
						onChange={handleImageSelect}
						accept='image/*'
						className='hidden'
					/>
					<div
						className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
						onClick={() => fileInputRef.current?.click()}
					>
						<div className='text-center'>
							<div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
								<Upload className='h-6 w-6 text-zinc-400' />
							</div>
							<div className='text-sm text-zinc-400 mb-2'>
								{imageFile ? imageFile.name : "Click to update artwork (optional)"}
							</div>
							<Button variant='outline' size='sm' className='text-xs'>
								Choose File
							</Button>
						</div>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Album Title</label>
						<Input
							value={editAlbum.title}
							onChange={(e) => setEditAlbum({ ...editAlbum, title: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Artist</label>
						<Input
							value={editAlbum.artist}
							onChange={(e) => setEditAlbum({ ...editAlbum, artist: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Release Year</label>
						<Input
							type='number'
							value={editAlbum.releaseYear}
							onChange={(e) => setEditAlbum({ ...editAlbum, releaseYear: parseInt(e.target.value) })}
							className='bg-zinc-800 border-zinc-700'
							min={1900}
							max={new Date().getFullYear()}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() => setEditDialogOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className='bg-violet-500 hover:bg-violet-600'
						disabled={isLoading || !editAlbum.title || !editAlbum.artist}
					>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditAlbumDialog;
