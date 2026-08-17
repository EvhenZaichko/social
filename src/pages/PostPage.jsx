import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { usePostStore } from "../store/usePostStore.js";
import { useUserStore } from "../store/useUserStore.jsx";
import Spinner from "../UI/Spinner.jsx";
import {ChartNoAxesCombined, Heart, MessageCircle, Repeat2, Trash} from "lucide-react";

const PostPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const getPost = usePostStore((s) => s.getPostById)
    const toggleLike = usePostStore((s) => s.toggleLike)
    const deletePost = usePostStore((s) => s.deletePost)
    const post = usePostStore((s) => s.currentPost)
    const currentUser = useUserStore((s) => s.user)
    const [loading, setLoading] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        let active = true

        const loadPost = async () => {
            setLoading(true)
            try {
                const data = await getPost(id)
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

    useEffect(() => {
        if (!menuOpen) return

        const onPointerDown = (e) => {
            if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
        }
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMenuOpen(false)
        }

        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [menuOpen])

    const handleDelete = async () => {
        const deleted = await deletePost(id)
        if (deleted) navigate('/')
    }

    if (loading) return <Spinner/>
    if (!post)   return <div>Post not found</div>

    return (
        <div>
            <div className="flex flex-col space-y-3 w-120 pb-4 mt-1 border-gray-700 border-1 rounded-2xl "
            >
                <div className="flex items-center space-x-2 ml-1 mt-2 h-10">
                    <div className="w-12 h-12 bg-green-300 rounded-full shrink-0"></div>
                    <div className="w-full flex items-center justify-between pr-4">
                        <span className="min-w-0 truncate wrap-break-word font-bold">{post.author.username}</span>
                        {post.author._id === currentUser?._id && (
                            <div ref={menuRef} className="text-gray-500 cursor-pointer relative">
                                <button type="button"
                                        aria-label="More options"
                                        aria-haspopup="menu"
                                        aria-expanded={menuOpen}
                                        className="text-2xl leading-none cursor-pointer"
                                        onClick={() => setMenuOpen(prev => !prev)}>...</button>
                                {menuOpen && (
                                    <div className="absolute right-0 top-8 z-10 w-40 p-2 rounded-xl bg-night-800 shadow-lg">
                                        <ul className="font-bold">
                                            <li className="flex gap-2 text-red-600" onClick={handleDelete}>
                                                <Trash />
                                                Delete
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="mx-6 mt-1 wrap-break-word">
                    {post.content}
                </div>
                <div className="flex justify-between gap-5 mx-6 text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Heart size={20} onClick={() => toggleLike(id)} className={` transition-colors duration-200 ${post.likedByMe ? "fill-white text-white" : "fill-transparent"}`}/>
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