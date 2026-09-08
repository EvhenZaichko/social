import React from 'react';

const FeedToggle = ({setTab, tab}) => {
    return (
        <div className="relative flex w-120 h-9 p-1 rounded-full bg-night-800 font-mono select-none mt-1">
    <span
        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-lg shadow-gray-600/30 transition-transform duration-300 ease-out ${
            tab === 'following' ? 'translate-x-full' : 'translate-x-0'
        }`}
    />

            <button className={`relative flex-1 rounded-full text-sm font-bold transition-colors duration-200 ${
                tab === 'all' ? 'text-black' : 'text-gray-400 hover:text-gray-200'
            }`} onClick={() => setTab('all')}>
                All
            </button>

            <button className={`relative flex-1 rounded-full text-sm font-bold transition-colors duration-200 ${
                tab === 'following' ? 'text-black' : 'text-gray-400 hover:text-gray-200'
            }`} onClick={() => setTab('following')}>
                Following
            </button>
        </div>
    );
};

export default FeedToggle;