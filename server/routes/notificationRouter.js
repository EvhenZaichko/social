import {Router} from "express";
import controller from '../controllers/notificationController.js'
import authMiddleWire from "../middleWire/authMiddleWire.js";

const router = Router()

router.get('/getNotifications', authMiddleWire, controller.getNotifications)
router.get('/getUnreadCount', authMiddleWire, controller.getUnreadCount)
router.patch('/markRead', authMiddleWire, controller.markRead)

export default router