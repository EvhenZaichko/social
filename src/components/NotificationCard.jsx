import React from 'react';
import {Heart} from "lucide-react";

const NotificationCard = () => {
    return (
        <div className="flex flex-col w-120 min-h-20 px-7 py-2 cursor-pointer border-gray-500 border-1 transition-colors duration-200 hover:bg-gray-800/50">
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    <div className="h-10 w-10 bg-blue-500 rounded-full"></div>
                    <div className="absolute -bottom-2 -right-3  rounded-full p-0.5">
                        <Heart size={25} className="text-pink-600 fill-pink-600" />
                    </div>
                </div>
                <span className="font-bold">Rem liked your post</span>
            </div>
            <div className="mt-3 wrap-break-word line-clamp-3 text-gray-400">
                Content
            </div>
        </div>
    );
};

export default NotificationCard;