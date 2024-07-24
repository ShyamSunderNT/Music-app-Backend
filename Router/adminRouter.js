import express from 'express';
import multer from 'multer';
import validate from '../middlewares/Validate.js';
import { addSong, editSong } from '../Controller/adminController.js';


const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post('/add-songs',validate,upload.single('file'),addSong)

router.post('/edit-song',validate,upload.single("file"),editSong)



export default router;