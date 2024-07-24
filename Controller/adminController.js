
import cloudinary from '../cloudinary.js';
import SongModel from '../Models/songsModels.js';

// Add Song
export const addSong = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    try {
        if (!req.file) {
          return res.status(400).send({
            message: "File is required",
            success: false,
          });
        }
    
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "music",
          use_filename: true,
          resource_type: "raw",
        });
    
        const newSong = new SongModel({
          title: req.body.title,
          artist: req.body.artist,
          src: result.url,
          album: req.body.album,
          duration: req.body.duration,
          year: req.body.year,
        });
    
        await newSong.save();
        const allSongs = await SongModel.find();
    
        return res.status(200).send({
          message: "Song added successfully",
          success: true,
          data: allSongs,
        });
      } catch (error) {
        return res.status(500).send({
          message: "Error adding song",
          success: false,
          data: error,
        });
      }
};

// Edit Song
export const editSong = async (req, res) => {
  try {
    let response = null;
    if (req.file) {
      response = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "music",
        use_filename: true,
        resource_type: "raw",
      });
    }

    await SongModel.findByIdAndUpdate(req.body._id, {
      title: req.body.title,
      artist: req.body.artist,
      src: response ? response.url : req.body.src,
      album: req.body.album,
      duration: req.body.duration,
      year: req.body.year,
    });

    const allSongs = await SongModel.find();
    return res.status(200).send({
      message: "Song edited successfully",
      success: true,
      data: allSongs,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error editing song",
      success: false,
      data: error,
    });
  }
};