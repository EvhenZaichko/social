import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore.jsx";

const Registration = () => {
    const navigate = useNavigate();
    const { registration } = useUserStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();                                       // без перезагрузки страницы
        const result = await registration(email, password, username); // передаём данные!
        if (result) navigate('/login');
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex items-center flex-col w-80 h-110 bg-night-800 rounded-2xl"
            >
                <span className="mt-5 font-bold text-xl">Registration</span>

                <div className="flex flex-col gap-10 mt-7">
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="bg-gray-600 p-2 px-7 rounded-2xl"
                    />
                    <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-gray-600 p-2 rounded-2xl indent-5"
                    />
                    <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        placeholder="Name"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="bg-gray-600 p-2 rounded-2xl indent-6"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-15 bg-gray-600 px-7 py-2 rounded-2xl cursor-pointer hover:bg-gray-500"
                >
                    Sign up
                </button>

                <span
                    onClick={() => navigate('/login')}
                    className="mt-4 cursor-pointer hover:text-gray-500"
                >
                    Already have an account ?
                </span>
            </form>
        </div>
    );
};

export default Registration;