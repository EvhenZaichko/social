import {create} from 'zustand'
import axios from "axios";
import api from "../api/axios.js";
import toast from 'react-hot-toast'

const API = '/postRouter'

export const usePostStore = create((set, get) => ({

    posts: [],
    currentPost: null,
    nextCursor: null,
    isLoadingMore: false,
    profileNextCursor: null,
    isLoadingMoreProfile: false,

    createPost: async (content) => {
        try {
            const result = await api.post(`${API}/createPost`, {content})
            const post = result.data.post
            set({posts: [ post, ...get().posts ]})
            return true
        } catch (e) {
            console.log('create post error', e)
            return false
        }

    },

    createReply: async (content, parentId) => {
        try {
            const { data } = await api.post(`${API}/createPost`, { content, parent: parentId })
            const reply = data.post

            set((s) => ({
                 posts: s.posts.map(post =>
                 post._id === parentId
                     ? {...post, replies: [...(post.replies ?? []), reply._id]}
                     : post
                 ),

                currentPost: s.currentPost && {
                    ...s.currentPost,
                    replies: [...(s.currentPost.replies ?? []), reply],
                },
            }))
            toast.success('Replay created!')
            return true
        } catch (e) {
            console.log('createReply error', e)
            return false
        }
    },


  loadFeed: async (tab, signal) => {
        const {data} = await api.get(`${API}/getPosts`, {
            params: {tab: tab.toLocaleLowerCase(), limit: 10},
            signal
        })
      set({posts: data.posts, nextCursor: data.nextCursor})
  },



    loadMoreFeed: async (tab, signal) => {
        const {nextCursor, isLoadingMore} = get()
        if(!nextCursor || isLoadingMore) return

        set({isLoadingMore: true})
        try {
            const {data} = await api.get(`${API}/getPosts`, {
                params: {tab: tab.toLocaleLowerCase(), limit: 3, cursor: nextCursor},
                signal
            })

            const current = get().posts

            set({posts: [...current, ...data.posts], nextCursor: data.nextCursor})
        } catch (e) {
            if (!axios.isCancel(e)) console.log("loadMoreFeedError", e)
        } finally {
            set({isLoadingMore: false})
        }
    },


    resetFeed: () => set({posts: [], nextCursor: null, isLoadingMore: false}),



    loadProfileFeed: async (userId, tab, signal) => {
        const {data} = await api.get(`${API}/getProfileFeed/${userId}`, {
            params: {tab: tab.toLocaleLowerCase(), limit: 10},
            signal
        })
        set({posts: data.posts, profileNextCursor: data.nextCursor})
    },




    loadMoreProfileFeed: async (userId, tab, signal) => {
        const {profileNextCursor, isLoadingMoreProfile} = get()
        if (!profileNextCursor || isLoadingMoreProfile) return

        set({isLoadingMoreProfile: true})
        try {
            const {data} = await api.get(`${API}/getProfileFeed/${userId}`, {
                params: {tab: tab.toLocaleLowerCase(), limit: 3, cursor: profileNextCursor},
                signal
            })
            set({
                posts: [...get().posts, ...data.posts],
                profileNextCursor: data.nextCursor,
            })
        } catch (e) {
            if (!axios.isCancel(e)) console.log('loadMoreProfileFeed error', e)
        } finally {
            set({isLoadingMoreProfile: false})
        }
    },


    resetProfileFeed: () => set({posts: [], profileNextCursor: null, isLoadingMoreProfile: false}),


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
            const { data } = await api.post(`${API}/toggleLike/${postId}`, null)

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
            const {data} = await api.get(`${API}/getPostById/${postId}`)
            return  data.post

        } catch (e) {
            console.log('GetPostById error', e)
        }
    },




    deletePost: async (postId) => {
        try {
            await api.delete(`${API}/deletePost/${postId}`)
            set((s) => ({
                posts: s.posts.filter(post => post._id !== postId),
                currentPost: s.currentPost && {
                    ...s.currentPost,
                    replies: (s.currentPost.replies ?? []).filter(reply => reply._id !== postId),
                },
            }))
            toast.success('Post Deleted!')
            return true
        } catch (e) {
            console.log('deletePost error', e)
            toast.error(e.response?.data?.message ?? 'Failed to delete post')
            return false
        }
    }

}))