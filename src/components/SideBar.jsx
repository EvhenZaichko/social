import React, {useState} from 'react';
import { Home, User, Settings, Feather, Search } from 'lucide-react';
import {NavLink, useNavigate} from 'react-router-dom'
import {useUserStore} from "../store/useUserStore.js";
import {useModalStore} from "../store/useModalStore.js";
import SearchList from "./SearchList.jsx";
import PostForm from "./PostForm.jsx";
import {useMatch} from 'react-router-dom'




const SideBar = () => {
    const user = useUserStore((s) => s.user)
    const navigate = useNavigate()
    const Open = useModalStore((s) => s.Open)

    const onHome = useMatch('/')
    const profileMatch = useMatch('/profile/:id')
    const onMyProfile = profileMatch?.params.id === user?._id

    const navItems = [
        { icon: Home,     label: 'Home',     link: '/' },
        { icon: User,     label: 'Profile',  link: `/profile/${user?._id}` },
        { icon: Settings, label: 'Settings', link: '/settings' },
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
                {navItems.map(({ icon: Icon, label, link }) => (
                    <NavLink
                        to={link}
                        key={label}
                        href="#"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center gap-4 w-fit rounded-full px-4 py-3 text-xl  z-50 font-bold text-white bg-white/10"
                                : "flex items-center gap-4 w-fit rounded-full px-4 py-3 text-xl font-medium text-gray-100 hover:bg-white/10"
                        }
                    >
                        <Icon size={26} strokeWidth={2} />
                    </NavLink>
                ))}
                <div>
                    <Search className="ml-4 mt-2  text-white cursor-pointer"
                            onClick={() => Open(<SearchList/>, 'start')} />
                </div>
                <div>
                    <Feather className="ml-4 mt-4  text-green-300 hover:text-white cursor-pointer"
                             onClick={openPostForm}/>
                </div>
            </nav>
    );
};

export default SideBar;
