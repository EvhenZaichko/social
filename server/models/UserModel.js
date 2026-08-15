import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({

    username:    { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 }, // @handle
    displayName: { type: String, trim: true, maxlength: 50 },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:    { type: String, required: true, select: false },


    bio:      { type: String, maxlength: 160, default: '' },
    avatar:   { type: String, default: '' },
    banner:   { type: String, default: '' },
    location: { type: String, maxlength: 30, default: '' },
    website:  { type: String, default: '' },
    verified: { type: Boolean, default: false },

    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});

/**
 * @typedef {Object} UserDoc
 * @property {import('mongoose').Types.ObjectId} _id
 * @property {string} username
 * @property {string} displayName
 * @property {string} email
 * @property {string} password
 * @property {string} bio
 * @property {string} avatar
 * @property {string} banner
 * @property {string} location
 * @property {string} website
 * @property {boolean} verified
 * @property {import('mongoose').Types.ObjectId[]} followers
 * @property {import('mongoose').Types.ObjectId[]} following
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/** @type {import('mongoose').Model<UserDoc>} */
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
