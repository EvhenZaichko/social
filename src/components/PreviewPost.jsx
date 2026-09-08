import React from 'react';
import {formatPostDate} from "../utils/formatDate.js";

const PreviewPost = ({content, author, date}) => {
    return (
        <article className="grid grid-cols-[48px_1fr] gap-3 w-full px-4 pt-3 pb-2">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-300 rounded-full shrink-0"/>
                <div className="w-0.5 grow min-h-7 mt-2 bg-night-700 rounded-full"/>
            </div>

            <div className="min-w-0 pb-2">
                <div className="flex items-center justify-between gap-4">
                    <span className="min-w-0 truncate font-bold">{author?.displayName}</span>
                    <span className="text-gray-500 text-sm shrink-0">{formatPostDate(date)}</span>
                </div>

                <div className="mt-1 wrap-break-word whitespace-pre-wrap">
                    {content}
                </div>
            </div>
        </article>
    );
};

export default PreviewPost;
