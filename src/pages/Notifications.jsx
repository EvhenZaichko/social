import React, {useEffect, useState} from 'react';
import NotificationCard from "../components/NotificationCard.jsx";
import Spinner from "../UI/Spinner.jsx";
import {useNotifyStore} from "../store/useNotifyStore.js";
import axios from 'axios'

const Notifications = () => {
    const notifications = useNotifyStore((s) => s.notifications)
    const loadNotifications = useNotifyStore((s) => s.loadNotifications)
    const markAllRead = useNotifyStore((s) => s.markAllRead)
    const resetNotifications = useNotifyStore((s) => s.resetNotifications)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const load = async () => {
            setLoading(true)
            setError(null)

            try {
                const list = await loadNotifications(controller.signal)
                setLoading(false)

                if (list.some(n => !n.read)) {
                    markAllRead(list[0]._id)
                }
            } catch (e) {
                if (axios.isCancel(e)) return
                setError(e.response?.data?.message ?? 'failed to load notifications')
                setLoading(false)
            }
        }

        load()
        return () => {
            controller.abort()
            resetNotifications()
        }
    }, [loadNotifications, markAllRead, resetNotifications])

    return (
        <div>
            <div className="flex items-center justify-center font-bold w-120 h-10 border-gray-500 border-1">
                <h1>Notifications</h1>
            </div>

            {loading ? (
                <div className="flex justify-center mt-5"><Spinner/></div>
            ) : error ? (
                <div className="flex justify-center mt-5 text-gray-500">{error}</div>
            ) : notifications.length > 0 ? (
                notifications.map((n) => (
                    <NotificationCard
                        key={n._id}
                        sender={n.sender}
                        post={n.post}
                        read={n.read}
                        createdAt={n.createdAt}
                    />
                ))
            ) : (
                <div className="flex justify-center mt-5 text-gray-500">No notifications yet</div>
            )}
        </div>
    );
};

export default Notifications;