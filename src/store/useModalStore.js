import {create} from 'zustand'

export const useModalStore = create((set, get) => ({
    content: null,
    isOpen: false,
    align: 'center',

    Open: (content, align = 'center') => set({content, align, isOpen: true}),
    Close: () => {
        set({isOpen: false})
        setTimeout(() => {
            if(!get().isOpen) set({content: null})
        }, 500)
    }
}))