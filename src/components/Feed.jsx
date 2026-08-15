import React, {useEffect, useState} from 'react';
import Post from "./Post.jsx";
import PostList from "./PostList.jsx";
import PostForm from "./PostForm.jsx";
import {usePostStore} from "../store/usePostStore.js";
import Spinner from "../UI/Spinner.jsx";
import FeedToggle from "./feedToggle.jsx";
import axios from "axios";


const Feed = () => {
    const posts = usePostStore((s) => s.posts)
    const getAllPosts = usePostStore((s) => s.getAllPosts)

    const [activeTab, setActiveTab] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const loadPosts = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await getAllPosts(activeTab, controller.signal)
                usePostStore.setState({posts: data ?? []})
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
            usePostStore.setState({posts: []})
        }
    }, [activeTab])

    return (
        <div>
            <FeedToggle setTab={setActiveTab} tab={activeTab}/>
            <PostForm />

            {loading ? (
                <div className="flex justify-center mt-5"><Spinner/></div>
            ) : error ? (
                <div className="flex justify-center mt-5 text-gray-500">{error}</div>
            ) : posts.length > 0 ? (
                <PostList/>
            ) : (
                <div className="flex justify-center mt-5 text-gray-500">Posts not found</div>
            )}
        </div>
    );
};

export default Feed;