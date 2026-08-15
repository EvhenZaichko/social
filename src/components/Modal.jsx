import React from 'react';

const Modal = ({isModalOpen, closeModal, children }) => {
    return (
        <div
            className={`fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50 transition-opacity duration-500 ${
                isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeModal}
        >
            <div
                className={`rounded-3xl relative transition-all duration-500 ${
                    isModalOpen ? 'scale-100' : 'scale-95'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;