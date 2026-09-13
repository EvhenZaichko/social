import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";

import {Heart, MessageCircle, ChartNoAxesCombined, Repeat2, Trash } from 'lucide-react';
import {usePostStore} from "../store/usePostStore.js";
import {formatPostDate} from "../utils/formatDate.js";
import {useUserStore} from "../store/useUserStore.js";
import {useModalStore} from "../store/useModalStore.js";
import PostForm from "./PostForm.jsx";
import PreviewPost from "./PreviewPost.jsx";
import SearchList from "./SearchList.jsx";


const Post = ({author, likes, reposts, content, replies, postId, likedByMe, date, postMenuId = null, preview = null, setPostMenuId, onClose,
                  threadAbove = false, threadBelow = false, replyingTo = null, muted = false}) => {

    const navigate = useNavigate()

    const menuRef = useRef(null)

    const toggleLike = usePostStore((s) => s.toggleLike)
    const deletePost = usePostStore((s) => s.deletePost)
    const currentPostId = usePostStore((s) => s.currentPost?._id ?? null)
    const userId = useUserStore((s) => s.user?._id ?? null)
    const openModal = useModalStore((s) => s.Open)

    const authorId = author._id

    useEffect(() => {
        if (postMenuId !== postId) return

        const onPointerDown = (e) => {
            if (!menuRef.current?.contains(e.target)) onClose()
        }
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [postMenuId, postId, onClose])

    const openPostMenu = (id) => {
        setPostMenuId(prev => prev === id ? null : id)
    }

    const deleteHandler = async (postId) => {
        const deleted = await deletePost(postId)
        if (deleted && postId === currentPostId) {
            usePostStore.setState({currentPost: null})
            navigate('/')
        }
    }

    const openProfile = (e) => {
        e.stopPropagation()
        navigate(`/profile/${authorId}`)
    }

    const openModalPostForm = () => {
        openModal(
            <div className="bg-night-800 w-120 rounded-3xl overflow-hidden py-2">
                <PreviewPost author={author} content={content} date={date}/>
                <PostForm parentId={postId} placeholder={`Reply to ${author.username}`}/>
            </div>
        )
    }


    return (
        <article className={`grid grid-cols-[48px_1fr] gap-3 w-full  px-4 pt-3 pb-2 border-b border-night-700
                            cursor-pointer transition-colors duration-200 hover:bg-night-850
                            ${muted ? 'opacity-60 hover:opacity-100' : ''}`}
             onClick={() => navigate(`/post/${postId}`)}
        >
            <div className="flex flex-col items-center">
                {threadAbove && <div className="w-0.5 h-3 -mt-3 bg-night-700 rounded-full"/>}
                <div className="w-12 h-12 bg-yellow-300 rounded-full shrink-0 cursor-pointer" onClick={openProfile}></div>
                {threadBelow && <div className="w-0.5 grow min-h-3 mt-2 bg-night-700 rounded-full"/>}
            </div>

            <div className="min-w-0">
                <div className="flex items-center justify-between gap-4">
                    <span className="min-w-0 truncate font-bold cursor-pointer" onClick={openProfile}>{author?.displayName}</span>
                    <div className="flex items-center space-x-6 shrink-0">
                        <span className="text-gray-500 text-sm">{formatPostDate(date)}</span>
                        <div ref={menuRef} className="text-gray-500 cursor-pointer relative" onClick={(e) => e.stopPropagation()}>
                            <button type="button"
                                    aria-label="More options"
                                    aria-haspopup="menu"
                                    aria-expanded={postMenuId === postId}
                                    className="text-2xl leading-none cursor-pointer"
                                    onClick={() => openPostMenu(postId)}>...</button>
                            {postMenuId === postId &&  (
                                <div className="absolute right-0 top-8 z-10 w-40 py-2 px-3 rounded-xl bg-night-800 shadow-lg">
                                    <ul className="font-bold">
                                        {authorId === userId && (
                                            <li className="flex gap-2 text-red-600" onClick={() => deleteHandler(postId)} >
                                                <Trash />
                                                Delete
                                            </li>
                                        )}
                                        <li>Bookmark</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {replyingTo && (
                    <p className="text-sm text-gray-500 mt-0.5">
                        answer to <span className="text-blue-400">@{replyingTo}</span>
                    </p>
                )}

                <div className="mt-1 wrap-break-word">
                    {content}
                </div>

                <div className="flex justify-between max-w-75 mt-2 -ml-2 text-gray-500" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center space-x-1 px-2">
                        <Heart size={20} onClick={() => toggleLike(postId)}
                               className={`transition duration-200 cursor-pointer hover:scale-125 ${likedByMe ? "fill-white text-white" : "fill-transparent"}`}/>
                        <span className="w-6 text-sm tabular-nums">{likes > 0 ? likes : ''}</span>
                    </div>
                    <div className="flex items-center space-x-1 px-2" onClick={() => openModalPostForm(postId,author, likes, reposts, content, replies,likedByMe, date)}>
                        <MessageCircle size={20} className="cursor-pointer"/>
                        <span className="text-sm tabular-nums">{replies?.length ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 px-2">
                        <Repeat2 size={20} className="cursor-pointer"/>
                        <span className="text-sm tabular-nums">{reposts?.length ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 px-2">
                        <ChartNoAxesCombined size={20} className="cursor-pointer"/>
                        <span className="text-sm tabular-nums">1</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Post;
