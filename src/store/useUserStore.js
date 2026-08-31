import {create} from "zustand";
import axios from "axios";
import api from "../api/axios.js";
import {usePostStore} from "./usePostStore.js";
import toast from "react-hot-toast";


const API = '/authRouter'


 export const useUserStore = create((set, get) => ({
     user: null,
     token: localStorage.getItem('token'),
     isAuthChecking: true,

     checkAuth: async () => {
         const token = get().token
         if (!token) return set({isAuthChecking: false})
         try {
             const {data} = await api.get(`${API}/me`)
             set({user: data.user, isAuthChecking: false})

         } catch (error) {
             if (error.response?.status === 401 || error.response?.status === 403) {
                 localStorage.removeItem('token')
                 set({user: null, token: null, isAuthChecking: false})
             } else {
                 console.log('checkAuth error', error)
                 set({isAuthChecking: false})
             }
         }
     },




     registration: async (email, password, username) => {
        try {
           const result =  await api.post(`${API}/registration`, {email, password, username})
            return true

        } catch (error) {
            console.log('registration error', error)
        }
     },

     login: async (email, password) => {
         try {
            const result = await api.post(`${API}/login`, {email, password})

             set({
                 user: result.data.user,
                 token: result.data.user.token
             })

             localStorage.setItem('token', result.data.user.token)
             return true

         } catch (error) {
             console.log('login error', error)
             return false
         }
     },

     logout: () => {
         set({user: null, token: null})
         localStorage.removeItem('token')
         usePostStore.setState({posts: []})
     },

     toggleFollow: async  (targetId) => {
         const {user} = get()
         if( !user ||user._id === targetId) return

         const isFollowing = user.following.some(id => id === targetId)

         set({
             user: {
                 ...user,
                 following: isFollowing
                 ? user.following.filter(id => id!== targetId)
                 : [...user.following, targetId]

             }
         })

         try {
             await api.post(`${API}/toggleFollow`, {targetId})
         } catch (e) {
                set({user})
             console.log('toggleFollow error', e)
         }
     },

     searchUsers: async (query, signal) => {
         try {
             const {data} = await api.get(`${API}/searchUsers`, {
                 params: {q: query},
                 signal
             })
             return data.users
         } catch (e) {
             if (axios.isCancel(e)) throw e
             console.log('searchUsers error', e)
             return []
         }
     },

     updateUsername: async (username) => {
         try {
             const {data} = await api.post(`${API}/updateUsername`, {username})
             set({user: data.user})
             toast.success('Username Updated!')

         } catch (e) {
            console.log(e)
         }
     },

     checkUsername: async (username) => {
         try {
            const {data} = await api.get(`${API}/checkUsername`, {
                params: {username: username}
            })
             return data.available
         } catch (e) {

         }
     }


}))