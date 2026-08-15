import React from 'react';
import Post from "./Post.jsx";
import {usePostStore} from "../store/usePostStore.js";


const PostList = () => {
    const posts = usePostStore((s) => s.posts)
    return (
        <div>
            {posts.map(p => <Post key={p._id}
                                  author={p.author}
                                  content={p.content}
                                  likes={p.likesCount}
                                  reposts={p.reposts}
                                  replies={p.replies}
                                  likedByMe={p.likedByMe}
                                  date={p.date}
                                  postId={p._id}/>)}
        </div>
    );
};

export default PostList;