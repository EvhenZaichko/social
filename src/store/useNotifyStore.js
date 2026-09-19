import {create} from 'zustand'
import axios from "axios";
import api from "../api/axios.js";

const API = '/notificationRouter'

export const useNotifyStore = create((set ,get) => ({
    notifications: [],
    unreadCount: 0,

    loadNotifications: async (signal) => {

            const {data} = await api.get(`${API}/getNotifications`, {signal})
            set({notifications: data.notifications})
            return data.notifications
    },

    loadUnreadCount: async () => {
        try {
            const {data} = await api.get(`${API}/getUnreadCount`)
            set({unreadCount: data.count})
        } catch (e) {
            console.log('LoadUnreadCount Error', e)
        }
    },

    markAllRead: async (lastId) => {
        try {
            const {data} = await api.patch(`${API}/markRead`)
            set({unreadCount: data.count})
        } catch (e) {
            console.log('markAllRead error', e)
        }
    },

    resetNotifications:  () => set({notifications: []}),

}))