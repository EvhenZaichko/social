import React, {useEffect, useRef} from 'react';
import {useNavigate} from "react-router-dom";

import {Heart, MessageCircle, ChartNoAxesCombined, Repeat2, Trash } from 'lucide-react';
import {usePostStore} from "../store/usePostStore.js";
import {formatPostDate} from "../utils/formatDate.js";
import {useUserStore} from "../store/useUserStore.jsx";


const Post = ({author, likes, reposts, content, replies, postId, likedByMe, date, postMenuId, setPostMenuId, onClose}) => {
    const navigate = useNavigate()

    const menuRef = useRef(null)

    const toggleLike = usePostStore((s) => s.toggleLike)
    const deletePost = usePostStore((s) => s.deletePost)
    const userId = useUserStore((s) => s.user._id)

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


    return (
        <div className="flex flex-col space-y-3 w-120 pb-4 mt-1 border-gray-700 border-1 rounded-2xl "
             onClick={() => navigate(`/post/${postId}`)}
        >
            <div className="flex items-center space-x-2 ml-1 mt-2 h-10">
                <div className="w-12 h-12 bg-yellow-300 rounded-full shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation();
                    navigate(`/profile/${authorId}`) }} ></div>
                <div className="w-full flex items-center justify-between pr-4">
                    <span className="min-w-0 truncate wrap-break-word font-bold cursor-pointer"  onClick={(e) => { e.stopPropagation();
                        navigate(`/profile/${authorId}`) }}>{author?.username}</span>
                    <div className="flex items-center space-x-6 ">
                        <span className="shrink-0 text-gray-500 text-sm">{formatPostDate(date)}</span>
                        <div ref={menuRef} className="text-gray-500 cursor-pointer relative" onClick={(e) => e.stopPropagation()}>
                            <button type="button"
                                    aria-label="More options"
                                    aria-haspopup="menu"
                                    aria-expanded={postMenuId === postId}
                                    className="text-2xl leading-none cursor-pointer"
                                    onClick={() => openPostMenu(postId)}>...</button>
                            {postMenuId === postId &&  (
                                <div className="flex absolute right-0 top-0 z-10 w-40 h-50 rounded-xl bg-night-800 text-black shadow-lg">
                                    <div className=" w-full ml-2 mt-2">
                                        <ul className="font-bold">
                                            {authorId === userId && (
                                                <li className="flex gap-2 text-red-600" onClick={() => deletePost(postId)}>
                                                    <Trash />
                                                    Delete
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-6 mt-1 wrap-break-word">
                {content}
            </div>
            <div className="flex justify-between gap-5 mx-6 text-gray-500" onClick={e => e.stopPropagation()}>
                <div className="flex items-center space-x-1">
                    <Heart size={20} onClick={() => toggleLike(postId)} className={` transition-colors cursor-pointer duration-200 ${likedByMe ? "fill-white text-white" : "fill-transparent"}`}/>
                    <span className="w-6 text-sm tabular-nums">{likes > 0 ? likes : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <MessageCircle size={20} className="cursor-pointer"/>
                    <span>{replies?.length ?? 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Repeat2 size={20} className="cursor-pointer"/>
                    <span>{reposts?.length ?? 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <ChartNoAxesCombined size={20} className="cursor-pointer"/>
                    <span>1</span>
                </div>
            </div>
        </div>
    );
};

export default Post;