import React, {useState} from 'react';
import {useUserStore} from "../store/useUserStore.js";
import {useModalStore} from "../store/useModalStore.js";
import {X, } from 'lucide-react';

const ProfileUpdate = () => {

    const user = useUserStore((s) => s.user)
    const updateProfile = useUserStore((s) => s.updateProfile)

    const closeModal = useModalStore((s) => s.Close)

    const [displayName, setDisplayName] = useState(user?.displayName ?? '')
    const [bio, setBio] = useState(user?.bio ?? '')
    const [location, setLocation] = useState(user?.location ?? '')

    const [charValidation, setCharValidation] = useState(null)

    const updateProfileHandler = async () => {
        const ok  = await updateProfile(displayName, bio, location)
        if(ok) {
            closeModal()
        }
    }

    return (
        <div className="flex flex-col w-130 h-170 bg-night-800 rounded-xl ">
            <div className="flex items-center pl-2 w-full h-15 font-bold border-b border-b-gray-500  ">
                <div className="flex items-center space-x-4">
                    <div className="bg-transparent cursor-pointer rounded-full p-1 transition-colors duration-300 hover:bg-gray-600/50 ">
                        <X onClick={closeModal}/>
                    </div>
                    <h1>Edit Profile</h1>
                </div>
                    <button className="ml-auto mr-2 text-[16px] text-black font-bold bg-white py-0.5 px-2 rounded-2xl " onClick={updateProfileHandler}>Apply</button>
            </div>
            <div className="flex items-center font-bold space-x-5 ml-2 mt-2">
                <div className="w-20 h-20 rounded-full bg-blue-500">
                </div>
                <div>
                    Edit photo
                </div>
            </div>
            <div className="flex flex-col mx-5 space-y-5 mt-10">
                <label className="text-xs text-gray-400">Display name</label>
                <input type="text" placeholder={'Display name'} maxLength={50} value={displayName} onChange={e => setDisplayName(e.target.value)} className="border-1 border-gray-500 py-2 indent-2"/>
                <label className="text-xs text-gray-400">Bio</label>
                <input type="text" placeholder={'Bio'} value={bio} onChange={e => setBio(e.target.value)} className="border-1 py-2 border-gray-500 indent-2"/>
                <label className="text-xs text-gray-400">Location</label>
                <input type="text" placeholder={'Location'} value={location} onChange={e => setLocation(e.target.value)} className="border-1 py-2 border-gray-500 indent-2"/>
            </div>
            <div className="flex flex-col w-full  justify-center px-5 py-2 mt-5 transition-colors duration-300 hover:bg-night-700 ">
                <span>Birth date</span>
                <span className="text-[12px] text-gray-400">Add your date of birth</span>
            </div>

        </div>
    );
};

export default ProfileUpdate;