import React, {use, useState} from 'react';
import {Navigate, useNavigate} from "react-router-dom";
import {useUserStore} from "../store/useUserStore.jsx";




const Login = () => {
    const {login} = useUserStore()
    let navigate = useNavigate()
    const [email, setEmail ] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password, );
        if(result) navigate('/')


    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex items-center flex-col w-80 h-90 bg-night-800 rounded-2xl"
            >
                <span className="mt-5 font-bold text-xl">Login</span>

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
                </div>

                <button
                    type="submit"
                    className="mt-15 bg-gray-600 px-7 py-2 rounded-2xl cursor-pointer hover:bg-gray-500"
                >
                    Sign in
                </button>

                <span
                    onClick={() => navigate('/register')}
                    className="mt-4 cursor-pointer hover:text-gray-500"
                >
                    Dont have an account yet
                </span>
            </form>
        </div>
    );
};

export default Login;