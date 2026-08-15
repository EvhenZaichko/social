import React, {use, useState} from 'react';
import {useNavigate} from "react-router-dom";

import {Heart, MessageCircle, ChartNoAxesCombined, Repeat2 } from 'lucide-react';
import {usePostStore} from "../store/usePostStore.js";
import {useUserStore} from "../store/useUserStore.jsx";
import {formatPostDate} from "../utils/formatDate.js";


const Post = ({author, likes, reposts, content, replies, postId, likedByMe, date}) => {
    const navigate = useNavigate()
    const toggleLike = usePostStore((s) => s.toggleLike)
    const authorId = author._id




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
                    <span className="shrink-0 text-gray-500 text-sm">{formatPostDate(date)}</span>
                </div>
            </div>
            <div className="mx-6 mt-1 wrap-break-word">
                {content}
            </div>
            <div className="flex justify-between gap-5 mx-6 text-gray-500" onClick={e => e.stopPropagation()}>
                <div className="flex items-center space-x-1">
                    <Heart size={20} onClick={() => toggleLike(postId)} className={` transition-colors cursor-pointer duration-200 ${likedByMe ? "fill-red-500 text-red-600" : "fill-transparent"}`}/>
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