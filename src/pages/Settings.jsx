import React from 'react';
import {LogOut} from "lucide-react";
import {useUserStore} from "../store/useUserStore.jsx";

const Settings = () => {
    const logout = useUserStore((s) => s.logout)

    return (
        <div className="flex justify-center w-100 h-screen bg-night-850 sm:-ml-32 border-l-2 border-r-2 border-white ">
            <button
                className="mt-4 w-40 h-10 flex items-center justify-center gap-2 rounded-full text-lg font-bold text-white shadow-lg transition-colors hover:text-red-600 active:scale-[0.98]"
                onClick={logout}
            >
                <LogOut size={20} />
                Logout
            </button>
        </div>
    );
};

export default Settings;