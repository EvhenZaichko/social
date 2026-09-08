import React, {useEffect, useRef, useState} from 'react';
import PostList from "../components/PostList.jsx";
import PostForm from "../components/PostForm.jsx";
import {usePostStore} from "../store/usePostStore.js";
import Spinner from "../UI/Spinner.jsx";
import FeedToggle from "../components/FeedToggle.jsx";
import axios from "axios";


const Feed = () => {
    const posts = usePostStore((s) => s.posts)
    const nextCursor = usePostStore((s) => s.nextCursor)
    const isLoadingMore = usePostStore((s) => s.isLoadingMore)
    const loadFeed = usePostStore((s) => s.loadFeed)
    const loadMoreFeed = usePostStore((s) => s.loadMoreFeed)
    const resetFeed = usePostStore((s) => s.resetFeed)

    const [activeTab, setActiveTab] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const sentinelRef = useRef(null)

    useEffect(() => {
        const controller = new AbortController()

        const loadPosts = async () => {
            setLoading(true)
            setError(null)
            try {
                await loadFeed(activeTab, controller.signal)
                setLoading(false)
            } catch (e) {
                if (axios.isCancel(e)) return
                setError(e.response?.data?.message ?? 'something went wrong')
                setLoading(false)
            }
        }

        loadPosts()
        return () => {
            controller.abort()
            resetFeed()
        }
    }, [activeTab, loadFeed, resetFeed])


    useEffect(() => {
        const el = sentinelRef.current
        if (!el || !nextCursor) return

        const controller = new AbortController()

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) loadMoreFeed(activeTab, controller.signal) },
            {rootMargin: '400px'}
        )

        observer.observe(el)
        return () => {
            observer.disconnect()
            controller.abort()
        }
    }, [nextCursor, activeTab, loadMoreFeed])



    return (
        <div>
            <FeedToggle setTab={setActiveTab} tab={activeTab}/>
            <PostForm />

            {loading ? (
                <div className="flex justify-center mt-5"><Spinner/></div>
            ) : error ? (
                <div className="flex justify-center mt-5 text-gray-500">{error}</div>
            ) : posts.length > 0 ? (
                <>
                    <PostList/>
                    {isLoadingMore && (
                        <div className="flex justify-center mt-5"><Spinner/></div>
                    )}
                </>
            ) : (
                <div className="flex justify-center mt-5 text-gray-500">Posts not found</div>
            )}

            <div ref={sentinelRef} className="h-10"/>
        </div>
    );
};

export default Feed;