import {Router} from 'express'
import controller from "../controllers/postController.js";
import authMiddleWire from "../middleWire/authMiddleWire.js";

const router =  Router()

router.post('/createPost', authMiddleWire, controller.createPost)
router.get('/getPosts', authMiddleWire, controller.getPosts)
router.get('/getPostById/:id', authMiddleWire, controller.getPostById )
router.post('/toggleLike/:id', authMiddleWire, controller.toggleLike)
router.get('/getProfile/:id', authMiddleWire, controller.getProfile)
router.get('/getProfileFeed/:id', authMiddleWire, controller.getProfileFeed)


export default router