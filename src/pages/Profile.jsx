import React, {use, useEffect, useState} from 'react';
import ProfileCard from "../components/ProfileCard.jsx";
import PostList from "../components/PostList.jsx";
import {usePostStore} from "../store/usePostStore.js";
import Spinner from "../UI/Spinner.jsx";
import {data, useParams} from "react-router-dom";
import axios from 'axios'


const TABS = ['Posts','Likes', 'Replies', 'Reposts']

const EMPTY = {
    Posts : 'There are no posts here yet',
    Likes : 'You do not have liked posts yet'
}

const Profile = ({openFollowList}) => {

    const {id} = useParams()

    const [loading, setLoading] = useState(true)
    const [tabLoading, setTabLoading] = useState(true)
    const [error, setError] = useState(null)

    const posts = usePostStore((s) => s.posts)
    const getProfile = usePostStore((s) => s.getProfile)
    const getProfileFeed = usePostStore((s) => s.getProfileFeed)

    const [profile, setProfile] = useState(null)
    const [activeTab, setActiveTab] = useState('Posts')


    useEffect(() => {
        let active = true
        const controller = new AbortController()

        const loadProfile = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await getProfile(id, controller.signal)
                if (active) setProfile(data)

            } catch (e) {
                if (active && !axios.isCancel(e)) setError('failed to load profile')
            } finally {
                if (active) setLoading(false)
            }
        }

        loadProfile()
        return () => {
            active = false
            controller.abort()
        }
    }, [id])



    useEffect(() => {
        const controller = new AbortController()
        let active = true

        const loadPosts = async () => {
            setTabLoading(true)

            try {
                const feed = await getProfileFeed(id, activeTab, controller.signal)
                if(active) usePostStore.setState({posts: feed})
            } catch (e) {
                if (active && !axios.isCancel(e)) setError('failed to load profile feed')
            } finally {
                if(active) setTabLoading(false)
            }
        }
        loadPosts()
        return () => {
            active = false
            controller.abort()
        }
    }, [id, activeTab])

    if (loading) return <Spinner/>

    if (error || !profile) return (
        <div className="flex justify-center mt-10 text-white">
            <span>{error ?? 'Profile not found'}</span>
        </div>
    )



    return (
        <div className="text-white space-y-3 ">
            <ProfileCard username={profile.username}
                         followersCount={profile.followersCount}
                         followingCount={profile.followingCount}
                         profileId={id} postsCount={posts.length}
                         isMe={profile.isMe}
                         isFollowedByMe={profile.isFollowedByMe}
                         openFollowList={openFollowList}
                         userId={id}
            />
            <div className="flex justify-between mr-5 ml-5 mb-10 text-gray-500">
                {TABS.map(tab => (
                    <button key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-2 pb-3 -mb-px border-b-2 cursor-pointer transition-colors duration-500 ${
                                activeTab === tab
                                    ? 'text-white font-bold border-blue-400'
                                    : 'border-transparent hover:text-gray-300'
                            }`}>
                        {tab}
                    </button>
                ))}
            </div>

            {tabLoading ? (
                <div className="flex justify-center mt-5"><Spinner/></div>
            ) : posts.length ? (
                    <PostList/>
            ) : (
                <div className="flex justify-center items-center mt-5">
                    <span>{EMPTY[activeTab]}</span>
                </div>
            )}

        </div>
    );
};

export default Profile;