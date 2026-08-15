import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { usePostStore } from "../store/usePostStore.js";
import Spinner from "../UI/Spinner.jsx";
import {ChartNoAxesCombined, Heart, MessageCircle, Repeat2} from "lucide-react";

const PostPage = () => {
    const { id } = useParams()
    const getPost = usePostStore((s) => s.getPostById)
    const toggleLike = usePostStore((s) => s.toggleLike)
    const post = usePostStore((s) => s.currentPost)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true

        const loadPost = async () => {
            setLoading(true)
            try {
                const data = await getPost(id)
                console.log(data)
                if (active) usePostStore.setState({currentPost: data})
            } catch (e) {
                if (active) usePostStore.setState({currentPost: null})
            } finally {
                if (active) setLoading(false)
            }
        }

        loadPost()
        return () => {
            active = false
            usePostStore.setState({ currentPost: null })
        }
    }, [id])

    if (loading) return <Spinner/>
    if (!post)   return <div>Post not found</div>

    return (
        <div>
            <div className="flex flex-col space-y-3 w-120 pb-4 mt-1 border-gray-700 border-1 rounded-2xl "
            >
                <div className="flex items-center space-x-2 ml-1 mt-2 h-10">
                    <div className="w-12 h-12 bg-green-300 rounded-full shrink-0"></div>
                    <div className="min-w-0">
                        <span className="block wrap-break-word font-bold">{post.author.username}</span>
                    </div>
                </div>
                <div className="mx-6 mt-1 wrap-break-word">
                    {post.content}
                </div>
                <div className="flex justify-between gap-5 mx-6 text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Heart size={20} onClick={() => toggleLike(id)} className={` transition-colors duration-200 ${post.likedByMe ? "fill-red-500 text-red-600" : "fill-transparent"}`}/>
                        <span className="w-6 text-sm tabular-nums">{post.likesCount > 0 ? post.likesCount : ''}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <MessageCircle size={20}/>
                        <span>{post.replies?.length ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Repeat2 size={20}/>
                        <span>{post.reposts?.length ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <ChartNoAxesCombined size={20}/>
                        <span>1</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPage;