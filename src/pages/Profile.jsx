import React, {use, useEffect, useRef, useState} from 'react';
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

const Profile = () => {

    const {id} = useParams()

    const [loading, setLoading] = useState(true)
    const [tabLoading, setTabLoading] = useState(true)
    const [error, setError] = useState(null)

    const posts = usePostStore((s) => s.posts)
    const getProfile = usePostStore((s) => s.getProfile)
    const profileNextCursor = usePostStore((s) => s.profileNextCursor)
    const isLoadingMoreProfile = usePostStore((s) => s.isLoadingMoreProfile)
    const loadProfileFeed = usePostStore((s) => s.loadProfileFeed)
    const loadMoreProfileFeed = usePostStore((s) => s.loadMoreProfileFeed)
    const resetProfileFeed = usePostStore((s) => s.resetProfileFeed)

    const sentinelRef = useRef(null)


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
                await loadProfileFeed(id, activeTab, controller.signal)
            } catch (e) {
                if (active && !axios.isCancel(e)) setError('failed to load profile feed')
            } finally {
                if (active) setTabLoading(false)
            }
        }

        loadPosts()
        return () => {
            active = false
            controller.abort()
            resetProfileFeed()
        }
    }, [id, activeTab, loadProfileFeed, resetProfileFeed])


    useEffect(() => {
        const el = sentinelRef.current
        if (!el || !profileNextCursor) return

        const controller = new AbortController()

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) loadMoreProfileFeed(id, activeTab, controller.signal)
            },
            {rootMargin: '400px'}
        )

        observer.observe(el)
        return () => {
            observer.disconnect()
            controller.abort()
        }
    }, [profileNextCursor, id, activeTab, loadMoreProfileFeed])


    if (loading) return <div className="w-120 mt-25"><Spinner/></div>

    if (error || !profile) return (
        <div className="flex justify-center mt-10 text-white">
            <span>{error ?? 'Profile not found'}</span>
        </div>
    )


    return (
        <div className="text-white space-y-3 ">
            <ProfileCard profile={profile}/>
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
                    <>
                        <PostList/>
                        {isLoadingMoreProfile && (
                            <div className="flex justify-center mt-5"><Spinner/></div>
                        )}
                    </>

            ) : (
                <div className="flex justify-center items-center mt-5">
                    <span>{EMPTY[activeTab]}</span>
                </div>
            )}

            <div ref={sentinelRef} className="h-10"/>
        </div>
    );
};

export default Profile;