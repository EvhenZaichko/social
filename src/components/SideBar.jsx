import React from 'react';
import { Home, User, Settings, Feather, LogOut, Search } from 'lucide-react';
import {NavLink, useNavigate} from 'react-router-dom'
import {useUserStore} from "../store/useUserStore.jsx";



const SideBar = ({openForm, openSearch}) => {
    const user = useUserStore((s) => s.user)
    const navigate = useNavigate()

    const navItems = [
        { icon: Home,     label: 'Home',     link: '/' },
        { icon: User,     label: 'Profile',  link: `/profile/${user?._id}` },
        { icon: Settings, label: 'Settings', link: '/settings' },
    ];



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
                    <Search className="ml-4 mt-2  text-white cursor-pointer" onClick={openSearch} />
                </div>
                <div>
                    <Feather className="ml-4 mt-4  text-green-300 hover:text-white cursor-pointer" onClick={() => {
                        navigate('/')
                        openForm()
                    }}/>
                </div>
            </nav>
    );
};

export default SideBar;
