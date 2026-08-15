import {Router} from 'express'
import controller from '../controllers/authController.js'
import authMiddleWire from "../middleWire/authMiddleWire.js";


const router = Router()

router.post('/registration', controller.registration)
router.post('/login', controller.login)
router.get('/me', authMiddleWire, controller.me)
router.post('/toggleFollow', authMiddleWire, controller.toggleFollow)
router.get('/getFollowersList/:id', authMiddleWire, controller.getFollowersList)

export default router