import React, {useState} from 'react';
import {usePostStore} from "../store/usePostStore.js";
import {useModalStore} from "../store/useModalStore.js";

const PostForm = ({parentId = null, placeholder = "What's new", label = 'Post'}) => {
    const [text, setText] = useState('')

    const canPost = text.trim().length > 0 && text.trim().length <= 160

    const createPost = usePostStore((s) => s.createPost)
    const createReply = usePostStore((s) => s.createReply)
    const Close = useModalStore((s) => s.Close)
    const isModalOpen = useModalStore((s) => s.isOpen)


    const submit = async () => {
        if (!canPost) return

        const ok = parentId
            ? await createReply(text, parentId)
            : await createPost(text)

        if (!ok) return
        setText('')
        if (isModalOpen) Close()
    }

    return (
        <div className="flex flex-col w-120 gap-2 my-2">
            <div className="flex flex-col bg-night-800 rounded-2xl outline-0 p-3">
                <textarea
                    rows={1}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                    }}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none resize-none field-sizing-content"
                />
                {text.length > 0 && (
                    <div className="flex justify-center ml-auto w-15 mt-2 p-1 text-[12px] font-bold rounded-full bg-gray-500/50">
                        <span>{text.length}</span>
                        <span className={`${text.length > 160 ? 'text-red-600' : 'text-white'}`}>/160</span>
                    </div>
                )}
            </div>


            <div className="flex items-center justify-end bg-night-800 rounded-2xl px-3 py-2">
                <button
                    disabled={!canPost}
                    onClick={submit}
                    className={` font-bold transition-colors duration-200 ${canPost ? "text-white" : 'text-gray-500'}
                        `}
                >
                    {label}
                </button>
            </div>
        </div>
    );
};

export default PostForm;
