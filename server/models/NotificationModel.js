import mongoose from 'mongoose';

const { Schema } = mongoose;

const NotificationSchema = new Schema({

    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type:      { type: String, enum: ['like', 'reply', 'follow'], required: true },
    post:      { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    read:      { type: Boolean, default: false },
}, {
    timestamps: true,
});

NotificationSchema.index({ recipient: 1, _id: -1 })
NotificationSchema.index({ recipient: 1, read: 1 })
NotificationSchema.index({ recipient: 1, sender: 1, type: 1, post: 1 }, { unique: true })

/**
 * @typedef {Object} NotificationDoc
 * @property {import('mongoose').Types.ObjectId} _id
 * @property {import('mongoose').Types.ObjectId} recipient
 * @property {import('mongoose').Types.ObjectId} sender
 * @property {'like'|'reply'|'follow'} type
 * @property {import('mongoose').Types.ObjectId|null} post
 * @property {boolean} read
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/** @type {import('mongoose').Model<NotificationDoc>} */
const NotificationModel = mongoose.model('Notification', NotificationSchema);

export default NotificationModel;