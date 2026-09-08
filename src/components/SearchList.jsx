import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useUserStore} from "../store/useUserStore.js";
import {useNavigate} from "react-router-dom";
import Spinner from "../UI/Spinner.jsx";
import {useModalStore} from "../store/useModalStore.js";

const SearchList = () => {
    const navigate = useNavigate()
    const Close = useModalStore((s) => s.Close)

    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState([])
    const searchUsers = useUserStore((s) => s.searchUsers)

    const following = useUserStore((s) => s.user?.following ?? [])
    const toggleFollow = useUserStore((s) => s.toggleFollow)

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setLoading(false)
            return
        }

        setLoading(true)

        const controller = new AbortController()
        const timer = setTimeout(async () => {
            try {
                const users = await searchUsers(query, controller.signal)
                setResults(users)
            } catch (e) {
                if (axios.isCancel(e)) return
                setResults([])
            }
            setLoading(false)
        }, 300)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [query, searchUsers])



    const redirectToProfile = (id) => {
        navigate(`profile/${id}`)
        Close()
    }

    const hasQuery = query.trim().length > 0
    const showEmpty = hasQuery && !loading && results.length === 0

    const panelHeight = results.length > 0
        ? 'h-screen'
        : (loading || showEmpty) ? 'h-40' : 'h-20'

    return (
        <div className={`flex flex-col w-120 bg-night-950 rounded-t-2xl overflow-hidden transition-[height] duration-200 ${panelHeight}`}>
            <div className="w-full shrink-0 px-2">
                <input className="h-12 w-full bg-night-850 indent-2 rounded-2xl mt-4 outline-0 px-2"
                       type="text"
                       placeholder="Search"
                       value={query}
                       onChange={(e) => setQuery(e.target.value)}/>
            </div>
            <div className="flex flex-col mt-2 flex-1 min-h-0 overflow-y-auto">
                {results.length > 0 ? (
                    results.map(user => (
                        <div key={user._id}
                             className="flex items-center bg-black w-full h-20 gap-3  border-b border-night-500  hover:bg-night-850 pl-5 pr-5">
                            <span className="w-10 h-10 rounded-full bg-white shrink-0"></span>
                            <span className="min-w-0 truncate cursor-pointer" onClick={() => redirectToProfile(user._id)}>{user.username}</span>
                            <button
                                className={`ml-auto shrink-0 border-white border-2 rounded-xl w-25 h-10 ${following.some(id => id === user._id) ? 'bg-gray-600 border-none' : 'bg-transparent'} `}
                                onClick={() => toggleFollow(user._id)}
                            >
                                {following.some(id => id === user._id) ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    ))
                ) : loading ? (
                    <div className="flex justify-center mt-5"><Spinner/></div>
                ) : showEmpty ? (
                    <div className="flex justify-center mt-5 text-gray-500">Nothing found</div>
                ) : null}
            </div>
        </div>
    );
};

export default SearchList;