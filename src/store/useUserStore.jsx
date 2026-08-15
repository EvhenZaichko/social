import {create} from "zustand";
import axios from "axios";
import {usePostStore} from "./usePostStore.js";


const API = 'http://localhost:5000/authRouter'

const authHeader = () => ({
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}` }
})


 export const useUserStore = create((set, get) => ({
     user: null,
     token: localStorage.getItem('token'),
     isAuthChecking: true,

     checkAuth: async () => {
         const token = get().token
         if (!token) return set({isAuthChecking: false})
         try {
             const {data} = await axios.get(`${API}/me`, {
                 headers: {Authorization: `Bearer ${token}`}
             })
             set({user: data.user, isAuthChecking: false})

         } catch (error) {
             if (error.response?.status === 401 || error.response?.status === 403) {
                 localStorage.removeItem('token')
                 set({user: null, token: null, isAuthChecking: false})
             } else {
                 console.log('checkAuth error', error)
                 set({isAuthChecking: false})   // токен не трогаем
             }
         }
     },




     registration: async (email, password, username) => {
        try {
           const result =  await axios.post(`${API}/registration`, {email, password, username})
            return true

        } catch (error) {
            console.log('registration error', error)
        }
     },

     login: async (email, password) => {
         try {
            const result = await axios.post(`${API}/login`, {email, password})

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
             await axios.post(`${API}/toggleFollow`, {targetId}, authHeader())
         } catch (e) {
                set({user})
             console.log('toggleFollow error', e)
         }


     }


}))