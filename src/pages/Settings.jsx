import React from 'react';
import {LogOut, AtSign, Mail, ChevronRight} from "lucide-react";
import {useUserStore} from "../store/useUserStore.js";
import {useModalStore} from "../store/useModalStore.js";
import UserUpdate from "../components/userUpdate.jsx";

const Settings = () => {
    const logout = useUserStore((s) => s.logout)
    const Open = useModalStore((s) => s.Open)
    const username = useUserStore((s) => s.user?.username ?? '')
    const email = useUserStore((s) => s.user?.email ?? '')

    return (
        <div className="w-120 min-h-screen border-x border-night-700">

            <header className="px-4 py-5 border-b border-night-700">
                <h1 className="text-xl font-bold">Settings</h1>
                <p className="mt-1 text-sm text-night-500">@{username}</p>
            </header>

            <section>
                <h2 className="px-4 pt-6 pb-2 text-xs font-bold uppercase tracking-wider text-night-500">
                    Account
                </h2>

                <button
                    onClick={() => Open(<UserUpdate/>)}
                    className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-night-850"
                >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-night-800">
                        <AtSign size={18}/>
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-semibold">Username</span>
                        <span className="block truncate text-sm text-night-500">@{username}</span>
                    </span>
                    <ChevronRight size={18} className="shrink-0 text-night-500"/>
                </button>

                <div className="flex items-center gap-4 px-4 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-night-800">
                        <Mail size={18}/>
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-semibold">Email</span>
                        <span className="block truncate text-sm text-night-500">{email}</span>
                    </span>
                </div>
            </section>

            <section className="mt-2 border-t border-night-700">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-4 px-4 py-4 text-left text-red-400 transition-colors hover:bg-red-500/10"
                >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                        <LogOut size={18}/>
                    </span>
                    <span className="font-semibold">Log out</span>
                </button>
            </section>

        </div>
    );
};

export default Settings;
