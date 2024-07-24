import express from 'express'
import validate from '../middlewares/Validate.js'
import { addPlaylist, deletePlaylist, getAllSongs, updatePlaylist } from '../Controller/songController.js';


const router = express.Router();

router.get('/get-all-songs',validate,getAllSongs)
router.post('/add-playlist',validate,addPlaylist)
router.put('/update-playlist',validate,updatePlaylist)
router.delete('/delete-playlist',validate,deletePlaylist)


export default router;