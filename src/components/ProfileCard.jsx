import React, {useState} from 'react';
import {useUserStore} from "../store/useUserStore.jsx";
import axios from 'axios'

const authHeader = () => ({
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const ProfileCard = ({username, followersCount, followingCount, profileId, postsCount, isFollowedByMe, isMe, openFollowList, userId}) => {
    const following = useUserStore((s) => s.user?.following ?? [])
    const toggleFollow = useUserStore((s) => s.toggleFollow)
    const isFollowing = following.some(id => id === profileId)

    const adjustedFollowers = followersCount + (Number(isFollowing) - Number(isFollowedByMe))

    const toggle = () => toggleFollow(profileId)

    const followersListHandler = async () => {
        try {
            const {data} = await axios.get(`http://localhost:5000/authRouter/getFollowersList/${userId}`, authHeader())
            openFollowList(data.followers)
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
                <div className="mt-5" onClick={toggle}>
                    {!isMe && <div className={`px-7 py-3 rounded-2xl w-30 flex items-center justify-center cursor-pointer transition-colors duration-500 hover:bg-night-800 ${isFollowing ? 'bg-transparent border-white border-2' : 'bg-gray-600'}`}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default  ProfileCard