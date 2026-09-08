import {Router} from 'express'
import controller from '../controllers/authController.js'
import authMiddleWire from "../middleWire/authMiddleWire.js";

const router = Router()

router.post('/registration', controller.registration)
router.post('/login', controller.login)
router.post('/updateProfile',authMiddleWire, controller.updateProfile)
router.get('/me', authMiddleWire, controller.me)
router.post('/toggleFollow', authMiddleWire, controller.toggleFollow)
router.get('/getFollowersList/:id', authMiddleWire, controller.getFollowersList)
router.get('/searchUsers', authMiddleWire, controller.searchUsers)
router.post('/updateUsername',authMiddleWire, controller.updateUsername)
router.get('/checkUsername',authMiddleWire, controller.checkUsername)
router.get('/getProfile/:id', authMiddleWire, controller.getProfile)

export default router