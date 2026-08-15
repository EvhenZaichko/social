import UserModel from "../models/UserModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authMiddleWire from "../middleWire/authMiddleWire.js";
import mongoose from 'mongoose';




const generateToken = (id, username, email) => {
    const payload = {
        id,
        username,
        email
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '96h'})
}

class AuthController {

    async registration(req, res) {
        const {email, password, username} = req.body

        if (!email || !password || !username ) {
            return res.status(400).json({message: 'All fields required'})
        }

        try {
            const exits = await UserModel.findOne({email})
            if(exits) {
                return  res.status(400).json({message: 'User already exist'})
            }
            const hashPassword = bcrypt.hashSync(password, 10)
            const user = await  UserModel.create({email, password:hashPassword, username})

            return res.status(200).json({message: 'Registration successful'})
        }

        catch (e) {
            console.log(e)
            return  res.status(400).json({message: 'Registration failed'})
        }

    }


    async login(req, res) {
        const {email, password} = req.body
        try {
            const user = /** @type {import('../models/UserModel.js').IUser} */ (
                await UserModel.findOne({email}).select('+password')
            )
            if (!user) {
                return res.status(400).json({message: 'User not exist'})
            }
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                return  res.status(400).json({message: 'wrong password'})
            }

            const token = generateToken(user._id, user.username, email)

            return res.json({
                status: 'success',
                message: 'Successful login',
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    followers: user.followers,
                    following: user.following,
                    token: token
                }
            })

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'login error'})
        }
    }

    async me(req, res)  {
        try {
            const user = /** @type {import('../models/UserModel.js').IUser} */ (
                await UserModel.findById(req.user.id)
            )
            if(!user) {
                return res.status(404).json({message: "User not found"})
            }

            return res.json({
                user: {
                    _id: user._id, email: user.email, username: user.username,
                    followers: user.followers, following: user.following
                }
            })
        } catch (e) {
            console.log('me error', e)
            return res.status(500).json({message: 'me error'})
        }
}

    async toggleFollow(req, res) {
        const myId = req.user.id
        const { targetId } = req.body
        try {
            if (myId === targetId) {
                return res.status(400).json({ message: 'Can not follow yourself' })
            }

            const me =  /** @type {import('../models/UserModel.js').IUser} */ ( await UserModel.findById(myId).select('following').lean() )
            if (!me) return res.status(404).json({ message: 'user not found' })

            const isFollowing = me.following.some(id => id.equals(targetId))

            const op = isFollowing ? '$pull' : '$addToSet'
            await Promise.all([
                UserModel.updateOne({ _id: myId },     { [op]: { following: targetId } }),
                UserModel.updateOne({ _id: targetId }, { [op]: { followers: myId } }),
            ])

            return res.json({ following: !isFollowing })
        } catch (e) {
            console.log('toggleFollow error', e)          // ← не глотать ошибку
            return res.status(500).json({ message: 'toggleFollow error' })
        }
    }


    async getFollowersList(req, res) {
        const userId = req.params.id
        const myId = req.user.id

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(404).json({ message: 'user not found' })
        }

        try {
            const [user, me] = await Promise.all([
                UserModel.findById(userId)
                    .select('followers')
                    .populate({
                        path: 'followers',
                        select: 'username avatar'
                    })
                    .lean(),

                UserModel.findById(myId).select('following').lean(),
            ])

            if (!user) return res.status(404).json({ message: 'user not found' })

            const followers = user.followers.map(f => ({
                _id: f._id,
                username: f.username,
                avatar: f.avatar,
                bio: f.bio,
                isMe: f._id.equals(myId),
                isFollowedByMe: me.following.some(id => id.equals(f._id)),
            }))


            return res.json({
                followers
            })
        } catch (e) {
            return  res.status(500).json({message : "getFollowersList error"})
        }
    }



}

export default new AuthController()