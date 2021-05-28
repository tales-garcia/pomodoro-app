import { AnimatePresence, motion } from 'framer-motion';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import Modal from '../components/Modal';

interface ModalContextContent {
    setContent(content: ReactNode): void;
    hide(): void;
    show(): void;
    isOpen: boolean;
}

const modalContext = createContext<ModalContextContent>({} as ModalContextContent);

export const useModal = () => {
    const context = useContext(modalContext);

    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }

    return context;
}

const AnimatedModal = motion(Modal) as typeof motion.div;

export const ModalProvider: React.FC = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [content, setContent] = useState<ReactNode>(false);

    const hide = useCallback(() => {
        setIsOpen(false);
    }, []);

    const show = useCallback(() => {
        setIsOpen(true);
    }, []);

    return (
        <modalContext.Provider
            value={{
                isOpen,
                setContent,
                hide,
                show
            }}
        >
            <AnimatePresence>
                {isOpen && (
                    <AnimatedModal
                        initial={{ opacity: 0, scale: 1.3 }}
                        transition={{ power: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.3 }}
                    >
                        {content}
                    </AnimatedModal>
                )}
            </AnimatePresence>
            {children}
        </modalContext.Provider>
    )
}