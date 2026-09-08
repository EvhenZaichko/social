import React, {useState} from 'react';
import {useUserStore} from "../store/useUserStore.js";
import api from "../api/axios.js";
import {useModalStore} from "../store/useModalStore.js";
import FollowList from "./FollowList.jsx";
import { UserRoundCog } from 'lucide-react';
import {useParams} from "react-router-dom";
import ProfileUpdate from "./ProfileUpdate.jsx";
import {BookText, MapPin} from 'lucide-react'

const ProfileCard =({profile}) => {
    const {_id, username, followersCount, followingCount, postsCount, isFollowedByMe, isMe, bio, location, displayName} = profile

    const userId = useUserStore((s) => s.user._id)
    const storeLocation = useUserStore((s) => s.user.location)

    const open = useModalStore((s) => s.Open)
    const following = useUserStore((s) => s.user?.following ?? [])
    const toggleFollow = useUserStore((s) => s.toggleFollow)
    const isFollowing = following.some(id => id === _id)

    console.log( ` user bio: ${useUserStore(s => s.user.bio)}`)

    const adjustedFollowers = followersCount + (Number(isFollowing) - Number(isFollowedByMe))

    const followersListHandler = async () => {
        try {
            const {data} = await api.get(`/authRouter/getFollowersList/${_id}`)
            open(<FollowList followers={data.followers}/>)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="flex flex-col w-120 min-h-80 border-b-1  mb-10 border-b-blue-200 ">
            <div className="flex items-center w-full h-30 mt-5 gap-2">
                <div className="w-30 h-30 rounded-full bg-white shrink-0"></div>
                <span className="font-bold text-xl">{displayName}</span>
                {userId === _id && (
                        <UserRoundCog size={30} className="ml-auto mr-5 transition hover:scale-105" onClick={ () => open(<ProfileUpdate/>)}/>
                )}
            </div>
            <div className="flex gap-2 ml-2 mt-5 text-gray-300">
                {bio && (
                    <div className="flex gap-2">
                        <BookText />
                        {bio}
                    </div>
                )}
            </div>
            <div className="flex gap-2 ml-2 mt-5 text-gray-300">
                {location && (
                    <div className="flex gap-2">
                        <MapPin />
                        {location}
                    </div>
                )}
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
                <div className="mt-5 mb-5" onClick={() => toggleFollow(_id)}>
                    {!isMe && <div className={`px-7 py-3 rounded-2xl w-30 flex items-center justify-center cursor-pointer transition-colors duration-500 hover:bg-night-800 ${isFollowing ? 'bg-transparent border-white border-2' : 'bg-gray-600'}`}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default  ProfileCard