import React, {useEffect} from 'react';
import { Home, User, Settings, Feather, Search, Bell } from 'lucide-react';
import {NavLink, useNavigate, useMatch} from 'react-router-dom'
import {useUserStore} from "../store/useUserStore.js";
import {useModalStore} from "../store/useModalStore.js";
import {useNotifyStore} from "../store/useNotifyStore.js";
import SearchList from "./SearchList.jsx";
import PostForm from "./PostForm.jsx";


const SideBar = () => {
    const user = useUserStore((s) => s.user)
    const navigate = useNavigate()
    const Open = useModalStore((s) => s.Open)

    const unreadCount = useNotifyStore((s) => s.unreadCount)
    const loadUnreadCount = useNotifyStore((s) => s.loadUnreadCount)

    const onHome = useMatch('/')
    const profileMatch = useMatch('/profile/:id')
    const onMyProfile = profileMatch?.params.id === user?._id


    useEffect(() => {
        const load = () => {
            if (!document.hidden) loadUnreadCount()
        }

        load()
        const id = setInterval(load, 30000)
        document.addEventListener('visibilitychange', load)

        return () => {
            clearInterval(id)
            document.removeEventListener('visibilitychange', load)
        }
    }, [loadUnreadCount])


    const navItems = [
        { icon: Home,     label: 'Home',          link: '/' },
        { icon: User,     label: 'Profile',       link: `/profile/${user?._id}` },
        { icon: Bell,     label: 'Notifications', link: '/notification', badge: unreadCount },
        { icon: Settings, label: 'Settings',      link: '/settings' },
    ];

    const openPostForm = () => {
        if (!onHome && !onMyProfile) navigate('/')

        Open(
            <div>
                <div className="flex justify-center items-center text-4xl mb-10">
                    What's new?
                </div>
                <PostForm/>
            </div>
        )
    }


    return (
        <nav className="sticky top-0 left-0 h-screen  w-64 hidden sm:flex flex-col justify-center gap-1 p-3">
            {navItems.map(({ icon: Icon, label, link, badge }) => (
                <NavLink
                    to={link}
                    key={label}
                    className={({ isActive }) =>
                        isActive
                            ? "relative flex items-center gap-4 w-fit rounded-full px-4 py-3 text-xl font-bold text-white bg-white/10"
                            : "relative flex items-center gap-4 w-fit rounded-full px-4 py-3 text-xl font-medium text-gray-100 hover:bg-white/10"
                    }
                >
                    <Icon size={26} strokeWidth={2} />

                    {badge > 0 && (
                        <span className="absolute top-1.5 left-8 flex items-center justify-center min-w-5 h-5 px-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                {badge > 9 ? '9+' : badge}
                            </span>
                    )}
                </NavLink>
            ))}
            <div>
                <Search className="ml-4 mt-2  text-white cursor-pointer"
                        onClick={() => Open(<SearchList/>, 'start')} />
            </div>
            <div>
                <Feather className=" ml-4 mt-4 cursor-pointer  text-green-300 hover:text-white"
                         onClick={openPostForm}
                />
            </div>
        </nav>
    );
};

export default SideBar;