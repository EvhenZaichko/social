import NotificationModel from '../models/NotificationModel.js'


export const notifyLike = async ({recipient, sender, post}) => {
    if(String(recipient) === String(sender)) return

    try {
        await NotificationModel.updateOne(
            {recipient, sender, type: 'like', post},
            {$setOnInsert: {read: false}},
            {upsert: true}

        )
    } catch (e) {
        if (e.code !== 11000) console.log('notifyLike error', e)
    }
}

export const unNotifyLike = async ({recipient, sender, post}) => {
    try {
        await NotificationModel.deleteOne({recipient, sender, type: 'like', post})
    } catch (e) {
        console.log('unNotifyLike error', e)
    }
}