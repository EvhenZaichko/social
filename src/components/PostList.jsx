import React, {useCallback, useState} from 'react';
import Post from "./Post.jsx";
import {usePostStore} from "../store/usePostStore.js";


const PostList = () => {
    const posts = usePostStore((s) => s.posts)
    const [postMenuId, setPostMenuId] = useState(null)

    const onClose = useCallback(() => setPostMenuId(null), [])

    return (
        <div className="space-y-5">
            {posts.map(p => <Post key={p._id}
                                  author={p.author}
                                  content={p.content}
                                  likes={p.likesCount}
                                  reposts={p.reposts}
                                  replies={p.replies}
                                  likedByMe={p.likedByMe}
                                  date={p.date}
                                  postId={p._id}
                                  setPostMenuId={setPostMenuId}
                                  postMenuId={postMenuId}
                                  onClose={onClose}
            />)
            }

        </div>
    );
};

export default PostList;