import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({

    author:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true, maxlength: 280 },
    images:  [{ type: String }], // URL прикреплённых картинок

    likes:   [{ type: Schema.Types.ObjectId, ref: 'User' }],
    reposts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parent:  { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
}, {
    timestamps: true,
});

PostSchema.index({ parent: 1, _id: -1 })
PostSchema.index({ author: 1, parent: 1, _id: -1 })
PostSchema.index({ likes: 1, _id: -1 })

/**
 * @typedef {Object} PostDoc
 * @property {import('mongoose').Types.ObjectId} _id
 * @property {import('mongoose').Types.ObjectId} author
 * @property {string} content
 * @property {string[]} images
 * @property {import('mongoose').Types.ObjectId[]} likes
 * @property {import('mongoose').Types.ObjectId[]} reposts
 * @property {import('mongoose').Types.ObjectId} parent
 * @property {import('mongoose').Types.ObjectId[]} replies
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/** @type {import('mongoose').Model<PostDoc>} */
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
