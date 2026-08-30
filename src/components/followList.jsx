import React from 'react';
import {useUserStore} from "../store/useUserStore.jsx";
import {useNavigate} from "react-router-dom";
import {useModalStore} from "../store/useModalStore.js";

const FollowList = ({followers}) => {
    const Close = useModalStore((s) => s.Close)
    const myId = useUserStore((s) => s.user?._id)
    const following = useUserStore((s) => s.user?.following ?? [])
    const toggleFollow = useUserStore((s) => s.toggleFollow)

    const navigate = useNavigate()

    const redirectToProfile = (id) => {
        navigate(`profile/${id}`)
        Close()
    }


    return (
        <div className=" flex justify-center h-screen w-120 bg-night-950">
                {followers.length > 0 ? (
                    <div>
                        {followers.map(f => {
                            const isFollowing = following.some(id => String(id) === String(f._id))
                            return (
                            <div key={f._id} className="flex bg-black w-120 h-20 border-b hover:bg-night-850" >
                                <div className="flex items-center h-full ml-5 space-x-3 w-full" onClick={() => redirectToProfile(f._id)}>
                                    <span className="w-10 h-10 rounded-full bg-white cursor-pointer"></span>
                                    <span className="cursor-pointer">{f.username}</span>
                                </div>
                                <div className=" flex items-center pr-10 ">
                                    {f._id === myId ? (
                                        <div className="p-1 px-7">
                                            You
                                        </div>
                                    ) : (
                                        <button
                                            className={`ml-auto shrink-0 border-white  border-2 rounded-xl w-25 h-10 ${isFollowing ? 'bg-gray-600 border-none' : 'bg-transparent'} `}
                                            onClick={() => toggleFollow(f._id)}
                                        >
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            )
                        })}
                    </div>
                ) : (<div>
                    empty
                </div>)}
        </div>
    );
};

export default FollowList;