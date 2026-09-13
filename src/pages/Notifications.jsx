import React from 'react';
import {Heart} from 'lucide-react'
import NotificationCard from "../components/NotificationCard.jsx";

const Notifications = () => {
    return (
        <div>
            <div className=" flex items-center justify-center font-bold w-120 h-10 border-gray-500 border-1">
                <h1>Notifications</h1>
            </div>
            <NotificationCard/>
            <NotificationCard/>
            <NotificationCard/>
        </div>
    );
};

export default Notifications;