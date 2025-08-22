import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
       resource_type: "auto",
      }
    )
    return result.secure_url;
    } catch (error) {
        console.log("error in uploadToCloudinary",error);
        throw new Error("could not upload to cloudinary");
    }
};

export const createSong = async (req,res,next) => {
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({message: "please upload all files"});
        }

   const {title,artist,albumId,duration} = req.body;
   const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;


    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
        title,
        artist,
        albumId,
        duration,
        audioUrl,
        imageUrl,
        albumId: albumId || null,
    });

    await song.save();

    if(albumId) {
       await Album.findByIdAndUpdate(albumId, {
       $push: {songs: song._id},
     } );
        
    }
    res.status(201).json({song})

} catch (error) {
    console.log("error in createSong",error);
    next(error);
}
};
export const deleteSong = async (req,res,next) => {
    try {
        const {id} = req.params;

        const song = await Song.findById(id);
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: {songs: song._id},
            });
        }
        await Song.findByIdAndDelete(id);

        res.status(200).json({message: "song deleted"});
    } catch (error) {
        console.log("error in deleteSong",error);
        next(error);
    }
};

export const createAlbum = async (req,res,next) => {
    try {
        
        const {title,artist,releaseYear} = req.body;
        const {imageFile} = req.files;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            releaseYear,
            imageUrl,
        });

        await album.save();

        res.status(201).json({album});
    } catch (error) {
        console.log("error in createAlbum",error);
        next(error);
    }
};

export const deleteAlbum = async (req,res,next) => {
    try {
        const {id} = req.params;
        
        await Song.deleteMany({albumId: id});
        await Album.findByIdAndDelete(id);

        res.status(200).json({message: "album deleted"});
    } catch (error) {
        console.log("error in deleteAlbum",error);
        next(error);
    }

};

export const checkAdmin = async(req,res,next) => {
    res.status(200).json({ admin: true});
};
export const updateSong = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, artist, albumId, duration } = req.body;

        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        // Optional file uploads
        let audioUrl = song.audioUrl;
        let imageUrl = song.imageUrl;

        if (req.files?.audioFile) {
            audioUrl = await uploadToCloudinary(req.files.audioFile);
        }
        if (req.files?.imageFile) {
            imageUrl = await uploadToCloudinary(req.files.imageFile);
        }

        // If album changed, update the album's song list
        if (song.albumId && song.albumId !== albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id },
            });
        }

        if (albumId && song.albumId !== albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id },
            });
        }

        // Update song details
        song.title = title || song.title;
        song.artist = artist || song.artist;
        song.duration = duration || song.duration;
        song.albumId = albumId || null;
        song.audioUrl = audioUrl;
        song.imageUrl = imageUrl;

        await song.save();

        res.status(200).json({ song });
    } catch (error) {
        console.log("error in updateSong", error);
        next(error);
    }
};
export const updateAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, artist, releaseYear } = req.body;

		const album = await Album.findById(id);
		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		// Optional image upload
		let imageUrl = album.imageUrl;
		if (req.files?.imageFile) {
			imageUrl = await uploadToCloudinary(req.files.imageFile);
		}

		// Update album fields
		album.title = title || album.title;
		album.artist = artist || album.artist;
		album.releaseYear = releaseYear || album.releaseYear;
		album.imageUrl = imageUrl;

		await album.save();
		res.status(200).json({ message: "Album updated successfully", album });
	} catch (error) {
		console.log("error in updateAlbum", error);
		next(error);
	}
};