import React, {useState} from 'react';
import {useUserStore} from "../store/useUserStore.jsx";
import api from "../api/axios.js";
import {useModalStore} from "../store/useModalStore.js";
import FollowList from "./followList.jsx";

const ProfileCard =({profile}) => {
    const {_id, username, followersCount, followingCount, postsCount, isFollowedByMe, isMe} = profile

    const Open = useModalStore((s) => s.Open)
    const following = useUserStore((s) => s.user?.following ?? [])
    const toggleFollow = useUserStore((s) => s.toggleFollow)
    const isFollowing = following.some(id => id === _id)

    const adjustedFollowers = followersCount + (Number(isFollowing) - Number(isFollowedByMe))

    const followersListHandler = async () => {
        try {
            const {data} = await api.get(`/authRouter/getFollowersList/${_id}`)
            Open(<FollowList followers={data.followers}/>)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="flex flex-col w-120 h-80 border-b-1 mb-10 border-b-blue-200 ">
            <div className="flex items-center w-full h-30 mt-5 gap-2">
                <div className="w-30 h-30 rounded-full bg-white shrink-0"></div>
                <span>{username}</span>
            </div>
            <div className="ml-2 mt-5">
                <div className="flex space-x-4">
                    <div className="space-x-1" onClick={followersListHandler}>
                        <span>{adjustedFollowers}</span>
                        <span>followers</span>
                    </div>
                    <div className="space-x-1">
                        <span>{followingCount}</span>
                        <span>following</span>
                    </div>
                    <div className="space-x-1">
                        <span>{postsCount}</span>
                        <span>post</span>
                    </div>
                </div>
                <div className="mt-5" onClick={() => toggleFollow(_id)}>
                    {!isMe && <div className={`px-7 py-3 rounded-2xl w-30 flex items-center justify-center cursor-pointer transition-colors duration-500 hover:bg-night-800 ${isFollowing ? 'bg-transparent border-white border-2' : 'bg-gray-600'}`}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default  ProfileCard