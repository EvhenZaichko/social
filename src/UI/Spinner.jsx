import React from 'react';

const Spinner = () => {
    return (
        <div className=" flex justify-center items-center w-120">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black mt-25"></div>
        </div>
    );
};

export default Spinner;