import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";
import {use} from "react";

class PostController  {

    async createPost (req, res) {
        const {content, images, parent} = req.body

        if(typeof content !== 'string' || !content.trim()) return res.status(400).json({ message: 'Content required' })

        const clean = content.trim()
        if(clean.length > 280) return  res.status(400).json({message: 'Content must be 1-280 chars'})

        try {
            if(parent) {
                const parentPost = await PostModel.findById(parent)
                if(!parentPost) {
                    return res.status(404).json({message: 'Parent post not found'})
                }
            }

            const post  = await PostModel.create({
                author: req.user.id,
                content: clean,
                images: Array.isArray(images) ? images : [],
                parent: parent || null,
            })

            if(parent) {
                await PostModel.findByIdAndUpdate(parent, {$push: {replies: post._id}})
            }

            const populated = /** @type {import('../models/PostModel.js').IPost} */ (
                await PostModel.findById(post._id)
                .populate('author', 'username email')
                .lean()
            )

            const result = {
                ...populated,
                date: populated.createdAt,
                likesCount: populated.likes.length,
                likedByMe: false,
            }

            return res.status(201).json({ post: result })
        } catch (e) {

            console.log('create post error', e)
            if (e.name === 'ValidationError') {
                return res.status(400).json({ message: e.message })
            }
            return res.status(500).json({ message: 'create post error' })
        }
    }



    async getPosts(req, res) {
        const userId = req.user.id
        const tab = req.query.tab ?? 'all'

        try {
            let filter = {parent: null}

            if (tab === 'following') {
                const me = await UserModel.findById(userId).select('following').lean()
                if (!me) return res.status(404).json({ message: 'user not found' })

                filter = { ...filter, author: { $in: [...me.following] } }
            }


            const posts = /** @type {import('../models/PostModel.js').IPost[]} */ (
                await PostModel.find(filter)
                .populate('author', 'username email')
                .sort({ createdAt: -1 })
                .lean()
            )

                const result = posts.map(({likes, ...post }) =>({
                    ...post,
                    date: post.createdAt,
                    likesCount: likes.length,
                    likedByMe:  likes.some(id => id.equals(userId))
                }))

            return res.json({ posts: result })
        } catch (e) {
            console.log('get posts error', e)
            return res.status(500).json({ message: 'get posts error' })
        }
    }




    async toggleLike(req, res) {
        const userId = req.user.id
        try {
            const post = /** @type {import('../models/PostModel.js').IPost} */ (
                await PostModel.findById(req.params.id).lean()
            )

            if(!post) return res.status(400).json({message: 'Post not found'})

            const isLiked = post.likes.some(id => id.equals(userId))

            await PostModel.findByIdAndUpdate(req.params.id, isLiked
                ? {$pull : {likes: userId}}
                : {$addToSet: {likes: userId}}
            )

            return res.json({
                date: post.createdAt,
                liked: !isLiked,
                likesCount: post.likes.length + (isLiked ? -1 : 1),
            })

        } catch (e) {
            console.log('toggle like error', e)
            return res.status(500).json({message: 'like error'})
        }
    }



    async getPostById(req, res) {
        const postId = req.params.id
        const userId = req.user.id


        try {
            const post = /** @type {import('../models/PostModel.js').IPost} */ (
                await PostModel.findById(postId)
                .populate('author', 'username email')
                .populate({ path: 'replies', populate: { path: 'author', select: 'username email' } })
                .lean()
            )

            if(!post) return res.status(404).json({message: 'post not found'})

            const shape = ({ likes, ...rest }) => ({
                ...rest,
                date: rest.createdAt ?? rest._id.getTimestamp(),
                likesCount: likes.length,
                likedByMe: likes.some(id => id.equals(userId)),
            })

            const result = {
                ...shape(post),
                replies: (post.replies ?? []).map(shape),
            }

            return res.json({post:result})
        } catch (e) {
            return res.status(500).json({message: 'GetPostById error'})
        }
    }




    async getProfile(req, res) {
        const meId = req.user.id
        const profileId = req.params.id
        try {
            const [profile, postsCount] = await Promise.all([
                /** @type {Promise<import('../models/UserModel.js').IUser>} */ (
                    UserModel.findById(profileId)
                        .select('username email avatar bio followers following')
                        .lean()
                ),
                PostModel.countDocuments({ author: profileId, parent: null }),
            ])

            if (!profile) return res.status(404).json({ message: 'user not found' })


            return res.json({
                profile: {
                    _id: profile._id,
                    username: profile.username,
                    email: profile.email,
                    postsCount,
                    followersCount: profile.followers.length,
                    followingCount: profile.following.length,
                    isFollowedByMe: profile.followers.some(id => id.equals(meId)),
                    isMe: profile._id.equals(meId),
                },
            })
        } catch (e) {
            console.log('getProfile error', e)
            return res.status(500).json({ message: 'getProfile error' })
        }
    }



    async getProfileFeed(req, res) {
        const myId = req.user.id
        const userId = req.params.id
        const tab = req.query.tab ?? 'posts'

        const filters = {
            posts: {author: userId, parent: null},
            likes: {likes: userId }
        }

        const filter = filters[tab]
        if(!filters[tab]) return res.status(400).json({message: 'unknown tab'})

        try {
            const posts =  /** @type {import('../models/PostModel.js').IPost[]} */ (await PostModel.find(filter)
                    .populate('author', 'username email')
                    .sort({createdAt: -1})
                    .lean()
            )

            const result = posts.map(({ likes, ...post }) => ({
                ...post,
                date: post.createdAt,
                likesCount: likes.length,
                likedByMe: likes.some(likeId => likeId.equals(myId)),
            }))

            return res.json({posts: result})

        } catch (e) {
            return res.status(500).json({message: 'getProfileFeed Error'})
        }
    }


}

export default new PostController()