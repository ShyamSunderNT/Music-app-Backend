import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      artist: {
        type: String,
        required: true,
      },
      album: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      src: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  const SongModel = mongoose.model("songs", songSchema);
  
  export default SongModel