import axios from 'axios'
import {useUserStore} from "../store/useUserStore.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        if (status === 401 || status === 403) {
            useUserStore.getState().logout()
        }
        return Promise.reject(error)
    }
)

export default api
