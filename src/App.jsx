import Modal from "./components/Modal.jsx";
import Feed from "./pages/Feed.jsx";
import Settings from "./pages/Settings.jsx";
import SideBar from "./components/SideBar.jsx";
import {Routes, Route, Navigate} from 'react-router-dom'
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import {useEffect} from "react";
import Registration from "./pages/Registration.jsx";
import {useUserStore} from "./store/useUserStore.js";
import PostPage from "./pages/PostPage.jsx";
import Spinner from "./UI/Spinner.jsx";
import {Toaster} from 'react-hot-toast'


function App() {

    const hideAside = false

    const token = useUserStore(s => s.token)
    const isAuthChecking = useUserStore(s => s.isAuthChecking)
    const checkAuth = useUserStore(s => s.checkAuth)

    useEffect(() => {
        checkAuth()
    }, [checkAuth])


    if (isAuthChecking) {
        return (
            <div className="flex h-screen items-center justify-center bg-night-900">
                <Spinner/>
            </div>
        )
    }


    if (!token) {
        return (
            <Routes>
                <Route path="/login"    element={<Login/>}/>
                <Route path="/register" element={<Registration/>}/>
                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
        );
    }


    return (
        <div className="min-h-screen bg-night-900 text-white">
            <div className="flex items-start min-h-screen">
                <Toaster position="top-center" toastOptions={{
                    style: {background: '#1f2937', color: '#fff'}
                }}/>

                <Modal/>

                <SideBar/>

                <main className={`flex-1 flex justify-center ${hideAside ? '' : 'sm:mr-64'}`}>
                    <div>
                        <Routes>
                            <Route path="/" element={<Feed/>}/>
                            <Route path="profile/:id" element={<Profile/>}/>
                            <Route path="settings" element={<Settings/>}/>
                            <Route path="/post/:id" element={<PostPage/>} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default App
