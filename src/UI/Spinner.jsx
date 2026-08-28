import React from 'react';

const Spinner = () => {
    return (
        <div className="flex justify-center items-center w-full">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white"></div>
        </div>
    );
};

export default Spinner;