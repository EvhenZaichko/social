import React, {useEffect, useState} from 'react';
import {useUserStore} from "../store/useUserStore.jsx";
import {useModalStore} from "../store/useModalStore.js";

const UserUpdate = () => {
    const Close = useModalStore((s) => s.Close)

    const currentUsername = useUserStore((s) => s.user.username)
    const updateUsername = useUserStore((s) => s.updateUsername)
    const checkUsername = useUserStore((s) => s.checkUsername)

    const [username, setUsername] = useState(currentUsername)
    const [available, setAvailable] = useState(null)

    useEffect(() => {
        const trimmed = username.trim()

        if(currentUsername === trimmed) return setAvailable(null)
        if(trimmed.length < 3 || trimmed.length > 20) return setAvailable(false)

        const timer = setTimeout( async() => {
            setAvailable(await checkUsername(trimmed))
        }, 400)

        return () => clearTimeout(timer)

    }, [username, currentUsername, checkUsername])

    const handleSubmit = (e) => {
        e.preventDefault()
        updateUsername(username)
        Close()
    }



    return (
        <div className="flex justify-center  h-70 w-100 bg-night-700/50 rounded-2xl ">
            <form className="flex flex-col items-center mt-15" onSubmit={handleSubmit}>
                <h1 className="font-bold mt text-xl">Change Your Name</h1>
                <input type="text"
                       autoFocus
                       className={`w-50 py-2 mt-10 text-center bg-white text-black rounded-2xl border-2 outline-none ${
                           available === null ? 'border-transparent'
                               : available ? 'border-green-400'
                                   : 'border-red-500'
                       }`}
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={available === false || available === null}
                    className={`mt-10  w-30 py-3 text-black  rounded-2xl cursor-pointer transition-colors duration-300 ${available ? 'bg-white hover:scale-101 hover:bg-green-300' : 'bg-gray-600'}`}

                    >Apply
                </button>
            </form>
        </div>
    );
};

export default UserUpdate;