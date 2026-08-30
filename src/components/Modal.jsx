import React from 'react';
import {useModalStore} from "../store/useModalStore.js";

const Modal = () => {
    const isOpen  = useModalStore((s) => s.isOpen)
    const content = useModalStore((s) => s.content)
    const align   = useModalStore((s) => s.align)
    const onClose = useModalStore((s) => s.Close)

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full flex justify-center z-20 bg-black/50 transition-opacity duration-500 ${
                align === 'start' ? 'items-start' : 'items-center'
            } ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={onClose}
        >
            <div
                className={`rounded-3xl relative transition-all duration-500 ${isOpen ? 'scale-100' : 'scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {content}
            </div>
        </div>
    );
};

export default Modal;