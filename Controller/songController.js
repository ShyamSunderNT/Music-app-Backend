
import SongModel from '../Models/songsModels.js';
import UserModel from '../Models/userModels.js';



// Fetch all songs
export const getAllSongs = async (req, res) => {
  try {
    const songs = await SongModel.find();
    res.status(200).send({
      message: "Songs fetched successfully",
      success: true,
      data: songs,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching songs",
      success: false,
      data: error,
    });
  }
};



export const addPlaylist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    const existingPlaylists = user.playlists || [];
    existingPlaylists.push({
      name: req.body.name,
      songs: req.body.songs,
    });

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { playlists: existingPlaylists },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        message: "User not found when updating playlists",
        success: false,
      });
    }

    res.status(200).send({
      message: "Playlist created successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).send({
      message: "Error creating playlist",
      success: false,
      data: error.message, // Return error message for debugging
    });
  }
};
// Update a playlist
export const updatePlaylist = async (req, res) => {
  try {
    const { userId, name, songs } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).send({
        message: "User ID is required",
        success: false,
      });
    }
    if (!name) {
      return res.status(400).send({
        message: "Playlist name is required",
        success: false,
      });
    }
    if (!songs || songs.length === 0) {
      return res.status(400).send({
        message: "At least one song is required for the playlist",
        success: false,
      });
    }

    // Find user and update playlists
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { "playlists.$[playlist].songs": songs } },
      { new: true, arrayFilters: [{ "playlist.name": name }] }
    );

    if (!updatedUser) {
      return res.status(404).send({
        message: "User not found or could not update",
        success: false,
      });
    }

    res.status(200).send({
      message: "Playlist updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).send({
      message: "Error updating playlist",
      success: false,
      data: error.message,
    });
  }
};
// Delete a playlist
// export const deletePlaylist = async (req, res) => {
//   try {
//     const { userId, name } = req.body;

//     // Validate input
//     if (!userId) {
//       return res.status(400).send({
//         message: "User ID is required",
//         success: false,
//       });
//     }
//     if (!name) {
//       return res.status(400).send({
//         message: "Playlist name is required",
//         success: false,
//       });
//     }

//     // Find user and update playlists
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $pull: { playlists: { name } } },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).send({
//         message: "User not found or could not update",
//         success: false,
//       });
//     }

//     res.status(200).send({
//       message: "Playlist deleted successfully",
//       success: true,
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.error("Error deleting playlist:", error);
//     res.status(500).send({
//       message: "Error deleting playlist",
//       success: false,
//       data: error.message,
//     });
//   }
// };

export const deletePlaylist = async (req, res) => {
  try {
    const { userId, playlistId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).send({
        message: "User ID is required",
        success: false,
      });
    }
    if (!playlistId) {
      return res.status(400).send({
        message: "Playlist ID is required",
        success: false,
      });
    }

    // Find user and update playlists
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { playlists: { _id: playlistId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        message: "User not found or playlist not deleted",
        success: false,
      });
    }

    res.status(200).send({
      message: "Playlist deleted successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).send({
      message: "Error deleting playlist",
      success: false,
      data: error.message,
    });
  }
};