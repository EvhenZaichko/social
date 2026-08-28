import Post from "./components/Post.jsx"
import Modal from "./components/Modal.jsx";
import Feed from "./components/Feed.jsx";
import Settings from "./pages/Settings.jsx";
import SideBar from "./components/SideBar.jsx";
import {Routes, Route, useLocation, useNavigate, Navigate} from 'react-router-dom'
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import {useEffect, useState} from "react";
import Registration from "./pages/Registration.jsx";
import {useUserStore} from "./store/useUserStore.jsx";
import PostPage from "./pages/PostPage.jsx";
import Spinner from "./UI/Spinner.jsx";
import PostForm from "./components/PostForm.jsx";
import FollowList from "./components/followList.jsx";
import SearchList from "./components/SearchList.jsx"
import {Toaster} from 'react-hot-toast'
import {Search} from "lucide-react";
import UserUpdate from "./components/userUpdate.jsx";


function App() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalAlign, setModalAlign] = useState('center')
    const location = useLocation()
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

    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => setModalContent(null), 500)
    }

    const OpenPostForm = () => {
        setModalAlign('center')
        setModalContent(<div>
            <div className="flex justify-center items-center text-4xl mb-10">
                What's new?
            </div>
            <PostForm closeModal={() => setIsModalOpen(false)}/>
        </div>)
        setIsModalOpen(true)
    }


    const openFollowList = (data) => {
        setModalAlign('center')
        setModalContent(<FollowList followers={data} onclose={() => setIsModalOpen(false)} />)
        setIsModalOpen(true)
    }

    const openSearchList = () => {
        setModalAlign('start')
        setModalContent(<SearchList onclose={() => setIsModalOpen(false)}/>)
        setIsModalOpen(true)
    }

    const openUpdateUser = () => {
        setModalAlign('center')
        setModalContent(<UserUpdate onclose={closeModal}/>)
        setIsModalOpen(true)
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
                <Modal isModalOpen={isModalOpen} closeModal={closeModal} align={modalAlign}>
                    {modalContent}
                </Modal>

                <SideBar openModal={() => setIsModalOpen(true)} openForm={OpenPostForm} openSearch={openSearchList}/>

                <main className={`flex-1 flex justify-center ${hideAside ? '' : 'sm:mr-64'}`}>
                    <div>
                        <Routes>
                            <Route path="/" element={<Feed   />}/>
                            <Route path="profile/:id" element={<Profile openFollowList={openFollowList}/>}/>
                            <Route path="settings" element={<Settings openUpdateUser={openUpdateUser}/>}/>
                            <Route path="/post/:id" element={<PostPage/>} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default App