import express from 'express'

//import controller
import { signup, login, getUser } from '../controllers/user.js'

const router = express.Router()
//routes
router.post('/login',login)
router.post('/signup',signup)
router.post('/get-user',getUser)

export default router;