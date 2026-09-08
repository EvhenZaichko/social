import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { usePostStore } from "../store/usePostStore.js";
import Spinner from "../UI/Spinner.jsx";
import Post from "../components/Post.jsx";
import PostForm from "../components/PostForm.jsx";

const PostPage = () => {
    const { id } = useParams()

    const getPost = usePostStore((s) => s.getPostById)
    const post = usePostStore((s) => s.currentPost)
    const parentPost = post?.parent

    const [loading, setLoading] = useState(true)
    const [postMenuId, setPostMenuId] = useState(null)

    const onClose = useCallback(() => setPostMenuId(null), [])

    useEffect(() => {
        let active = true

        const loadPost = async () => {
            setLoading(true)
            try {
                const data = await getPost(id)
                if (active) usePostStore.setState({currentPost: data})
            } catch (e) {
                if (active) usePostStore.setState({currentPost: null})
            } finally {
                if (active) setLoading(false)
            }
        }

        loadPost()
        return () => {
            active = false
            usePostStore.setState({ currentPost: null })
        }
    }, [id])

    if (loading) return <div className="w-120 mt-25"><Spinner/></div>
    if (!post)   return <div>Post not found</div>

    return (

        <div className="w-120 border-t border-night-700">
            <PostForm parentId={post._id} placeholder="Post your reply" label="Reply"/>

            {parentPost && (
                <Post
                    postId={parentPost._id}
                    author={parentPost.author}
                    content={parentPost.content}
                    date={parentPost.date}
                    likes={parentPost.likesCount}
                    likedByMe={parentPost.likedByMe}
                    replies={parentPost.replies}
                    reposts={parentPost.reposts}
                    postMenuId={postMenuId}
                    setPostMenuId={setPostMenuId}
                    onClose={onClose}
                    threadBelow
                    muted
                />
            )}

            <Post
                postId={post._id}
                author={post.author}
                content={post.content}
                date={post.date}
                likes={post.likesCount}
                likedByMe={post.likedByMe}
                replies={post.replies}
                reposts={post.reposts}
                postMenuId={postMenuId}
                setPostMenuId={setPostMenuId}
                onClose={onClose}
                threadAbove={Boolean(parentPost)}
            />


            {(post.replies ?? []).map(reply => (
                <Post
                    key={reply._id}
                    postId={reply._id}
                    author={reply.author}
                    content={reply.content}
                    date={reply.date}
                    likes={reply.likesCount}
                    likedByMe={reply.likedByMe}
                    replies={reply.replies}
                    reposts={reply.reposts}
                    postMenuId={postMenuId}
                    setPostMenuId={setPostMenuId}
                    onClose={onClose}
                    replyingTo={post.author?.username}
                />
            ))}
        </div>
    );
};

export default PostPage;