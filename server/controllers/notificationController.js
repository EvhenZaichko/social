import NotificationModel from "../models/NotificationModel.js";
import mongoose from 'mongoose';

class NotificationController {

    async getNotifications(req, res) {
        try {
            const notifications = await NotificationModel.find({recipient: req.user.id})
                .sort({_id: -1})
                .limit(50)
                .populate('sender', 'username displayName avatar')
                .populate('post', 'content')
                .lean()

            return res.json({notifications})
        } catch (e) {
            console.log('getNotifications error', e)
            return res.status(500).json({ message: 'getNotifications error' })
        }
    }

    async getUnreadCount(req, res) {
        try {
            const count = await NotificationModel.countDocuments({
                recipient: req.user.id,
                read: false
            })

            return res.json({count})
        } catch (e) {
            console.log('getUnreadCount error', e)
            return res.status(500).json({ message: 'getUnreadCount error' })
        }
    }

    async markRead(req, res) {
        const myId = req.user.id
        const {lastId} = req.body ?? {}

        if (lastId && !mongoose.isValidObjectId(lastId)) {
            return res.status(400).json({ message: 'Invalid lastId' })
        }

        const filter = lastId
            ? { recipient: myId, read: false, _id: { $lte: lastId } }
            : { recipient: myId, read: false }

        try {
            await NotificationModel.updateMany(filter, {read: true})
            const count = await NotificationModel.countDocuments({recipient: myId, read: false})

            return res.json({count})
        } catch (e) {
            console.log('markRead error', e)
            return res.status(500).json({ message: 'markRead error' })
        }
    }

}

export default new NotificationController()