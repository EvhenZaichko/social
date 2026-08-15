import React from 'react';
import {useUserStore} from "../store/useUserStore.jsx";

const FollowList = ({followers}) => {
    const myId = useUserStore((s) => s.user?._id)
    const following = useUserStore((s) => s.user?.following ?? [])
    const toggleFollow = useUserStore((s) => s.toggleFollow)

    console.log(followers.length)
    return (
        <div className=" flex justify-center h-screen w-120 bg-night-800">
            <div className="">
                {followers.length > 0 ? (
                    <div>
                        {followers.map(f => (
                            <div className="flex bg-black w-120 h-20 hover:bg-night-850">
                                <div className="flex items-center h-full ml-5 space-x-3 w-full">
                                    <span className="w-10 h-10 rounded-full bg-white"></span>
                                    <span>{f.username}</span>
                                </div>
                                <div className=" flex items-center pr-10 ">
                                    {f._id === myId ? (
                                        <div className="p-1 px-7">
                                            You
                                        </div>
                                    ) : (
                                        <button
                                            className="border-white border-2 rounded-xl p-1 px-7"
                                            onClick={() => toggleFollow(f._id)}
                                        >
                                            {following.some(id => id === f._id) ? 'Following' : 'Follow'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (<div>
                    empty
                </div>)}
            </div>
        </div>
    );
};

export default FollowList;