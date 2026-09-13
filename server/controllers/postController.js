import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";
import mongoose from "mongoose";

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
                .populate('author', 'username displayName email')
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
        const { cursor } = req.query
        const limit = Math.max(1, Math.min(Number(req.query.limit) || 20, 50))

        if (cursor && !mongoose.isValidObjectId(cursor)) {
            return res.status(400).json({ message: 'Invalid cursor' })
        }

        try {
            let filter = {parent: null}

            if (tab === 'following') {
                const me = await UserModel.findById(userId).select('following').lean()
                if (!me) return res.status(404).json({ message: 'user not found' })

                filter = { ...filter, author: { $in: me.following } }
            }

            if (cursor) filter = { ...filter, _id: { $lt: cursor } }

            const posts = /** @type {import('../models/PostModel.js').IPost[]} */ (
                await PostModel.find(filter)
                    .populate('author', 'username displayName email')
                    .sort({ _id: -1 })
                    .limit(limit + 1)
                    .lean()
            )

            const hasMore = posts.length > limit
            const page = hasMore ? posts.slice(0, limit) : posts

            const result = page.map(({likes, ...post }) => ({
                ...post,
                date: post.createdAt,
                likesCount: likes.length,
                likedByMe: likes.some(id => id.equals(userId))
            }))

            return res.json({
                posts: result,
                nextCursor: hasMore ? page[page.length - 1]._id : null,
            })
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
                    .populate('author', 'username displayName email')
                    .populate({ path: 'replies', populate: { path: 'author', select: 'username displayName email' } })
                    .populate({ path: 'parent', populate: { path: 'author', select: 'username displayName email' } })
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
                parent: post.parent ? shape(post.parent) : null,
                replies: (post.replies ?? []).map(shape),
            }

            return res.json({post:result})
        } catch (e) {
            return res.status(500).json({message: 'GetPostById error'})
        }
    }



    async getProfileFeed(req, res) {
        const myId = req.user.id
        const userId = req.params.id
        const tab = req.query.tab ?? 'posts'
        const { cursor } = req.query
        const limit = Math.max(1, Math.min(Number(req.query.limit) || 20, 50))

        const filters = {
            posts: {author: userId, parent: null},
            likes: {likes: userId },
            replies: {author: userId, parent: {$ne: null}},
        }

        if (!filters[tab]) return res.status(400).json({message: 'unknown tab'})
        if (cursor && !mongoose.isValidObjectId(cursor)) {
            return res.status(400).json({ message: 'Invalid cursor' })
        }

        const filter = cursor
            ? { ...filters[tab], _id: { $lt: cursor } }
            : filters[tab]

        try {
            const posts = /** @type {import('../models/PostModel.js').IPost[]} */ (
                await PostModel.find(filter)
                    .populate('author', 'username displayName email')
                    .sort({_id: -1})
                    .limit(limit + 1)
                    .lean()
            )

            const hasMore = posts.length > limit
            const page = hasMore ? posts.slice(0, limit) : posts

            const result = page.map(({ likes, ...post }) => ({
                ...post,
                date: post.createdAt,
                likesCount: likes.length,
                likedByMe: likes.some(likeId => likeId.equals(myId)),
            }))

            return res.json({
                posts: result,
                nextCursor: hasMore ? page[page.length - 1]._id : null,
            })
        } catch (e) {
            return res.status(500).json({message: 'getProfileFeed Error'})
        }
    }


    async deletePost(req, res) {
        try{
            const post =  /** @type {import('../models/PostModel.js').IPost[]} */ (await PostModel.findById(req.params.id)
            )
            if(!post) return res.status(404).json({message: 'Post not found'})
            if(post.author.toString() !== req.user.id) return res.status(403).json({message:"Forbidden"})

            if(post.parent) {
                await PostModel.findByIdAndUpdate(post.parent, {$pull: {replies: post._id}})
            }

            if (post.replies.length) {
                await PostModel.deleteMany({ _id: { $in: post.replies } })
            }

            await post.deleteOne()

            return res.json({
                message: 'Post deleted',
                postId: post._id,
            })

        } catch (e) {
            console.log('deletePost error', e)
            if (e.name === 'CastError') return res.status(400).json({message: 'Invalid post id'})
            return res.status(500).json({message : 'deletePost Error'})
        }

    }


}

export default new PostController()