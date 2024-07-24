import express from "express"
import {  getUserData, loginUser,  registerUser } from "../Controller/userController.js"



const router =express.Router()

router.post("/register",registerUser)
router.post('/login',loginUser)
router.get('/getuserdata',getUserData)





export default router