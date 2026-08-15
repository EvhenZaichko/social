import React, {useState} from 'react';
import {usePostStore} from "../store/usePostStore.js";

const PostForm = ({closeModal}) => {
    const [text, setText] = useState('')
    const canPost = text.trim().length > 0
    const createPost = usePostStore((s) => s.createPost)

    const addPost = () => {
        createPost(text)
        setText('')
        closeModal()
        }

    return (
        <div className="flex flex-col w-120 gap-2 my-2">
            <div className="bg-night-800 rounded-2xl border border-transparent focus-within:border-white p-3">
                <textarea
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's new"
                    className="w-full bg-transparent outline-none resize-none field-sizing-content"
                />
            </div>


            <div className="flex items-center justify-end bg-night-800 rounded-2xl px-3 py-2">
                <button
                    disabled={!canPost}
                    onClick={addPost}
                    className={` font-bold transition-colors duration-200 ${canPost ? "text-white" : 'text-gray-500'}
                        `}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default PostForm;
