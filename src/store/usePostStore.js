import {create} from 'zustand'
import axios from "axios";
import toast from 'react-hot-toast'

const API = 'http://localhost:5000/postRouter'

const authHeader = () => ({
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const usePostStore = create((set, get) => ({

    posts: [],
    currentPost: null,

    createPost: async (content) => {
        try {
            const result = await axios.post(`${API}/createPost`, {content}, authHeader())
            const post = result.data.post
            set({posts: [ post, ...get().posts ]})
        } catch (e) {
            console.log('create post error', e)
        }

    },

    getAllPosts: async (tab, signal) => {
        try {
            const {data} = await axios.get(`${API}/getPosts`,  {
                ...authHeader(),
                params: {tab: tab.toLocaleLowerCase()},
                signal
            })
            return data.posts
        } catch (e) {
            if (!axios.isCancel(e)) console.log('getAllPosts error', e)
            throw e
        }
    },




    toggleLike: async (postId) => {
        const prev = { posts: get().posts, currentPost: get().currentPost }

        const patchTree = (root, fn) => {
            if (!root) return root
            if(root._id === postId) return fn(root)
            let next = root
            if (next.replies?.some(r => r._id === postId)) {
                next = { ...next, replies: next.replies.map(r => r._id === postId ? fn(r) : r) }
            }
            return next
        }

        const flip = (p) => ({ ...p, likedByMe: !p.likedByMe, likesCount: p.likesCount + (p.likedByMe ? -1 : 1) })


        set({
            posts: get().posts.map(p => p._id === postId ? flip(p) : p),
            currentPost: patchTree(get().currentPost, flip),
        })

        try {
            const { data } = await axios.post(`${API}/toggleLike/${postId}`, null, authHeader())

            const apply = (p) => ({ ...p, likedByMe: data.liked, likesCount: data.likesCount })

            set({
                posts: get().posts.map(p => p._id === postId ? apply(p) : p),
                currentPost: patchTree(get().currentPost, apply),
            })
            
        } catch (e) {
            console.log('toggle like error', e)
            set(prev)
        }
    },



    getPostById: async (postId) => {
        try {
            const {data} = await axios.get(`${API}/getPostById/${postId}`, authHeader())
            return  data.post

        } catch (e) {
            console.log('GetPostById error', e)
        }
    },



    getProfile: async (id, signal) => {
        try {
            const {data} = await axios.get(`${API}/getProfile/${id}`, {...authHeader(), signal})
            return data.profile
        } catch (e) {
            console.log('getProfile error', e)
            throw e
        }
    },



    getProfileFeed: async (userId, tab, signal) => {
        try {
            const {data} = await axios.get(`${API}/getProfileFeed/${userId}`, {
                ...authHeader(),
                params: {tab: tab.toLocaleLowerCase()},
                signal
            })
            return data.posts
        } catch (e) {
            console.log('getProfileFeed error', e)
            throw e
        }
    },

    deletePost: async (postId) => {
        try {
            await axios.delete(`${API}/deletePost/${postId}`, authHeader())
            set({posts: get().posts.filter(post => post._id !== postId)})
            toast.success('Post Deleted!')
            return true
        } catch (e) {
            console.log('deletePost error', e)
            toast.error(e.response?.data?.message ?? 'Failed to delete post')
            return false
        }
    }

}))