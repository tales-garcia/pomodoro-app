import { ipcRenderer } from 'electron';
import React, { useCallback, useMemo, useState } from 'react';
import { FiPlay, FiEdit, FiTrash } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import { useWorkspace } from '../../hooks/workspace';
import Button from '../Button';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';

import { Container, ButtonsContainer } from './styles';

interface TimerItemProps {
    data: Timer;
}

const TimerItem: React.FC<TimerItemProps> = ({ data: { name, time, id } }) => {
    const { red, text } = useTheme();
    const { deleteTimer } = useWorkspace();

    const [editMode, setEditMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const hours = useMemo(() => time ? Math.floor(time / 3600) : null, [time]);
    const minutes = useMemo(() => time ? Math.floor(time % 3600 / 60) : null, [time]);
    const seconds = useMemo(() => time ? Math.floor(time % 3600 % 60) : null, [time]);

    const stringHours = useMemo(() => String(hours).padStart(2, '0'), [hours]);
    const stringMinutes = useMemo(() => String(minutes).padStart(2, '0'), [minutes]);
    const stringSeconds = useMemo(() => String(seconds).padStart(2, '0'), [seconds]);

    const openTimer = useCallback(() => {
        ipcRenderer.send('create-timer-window', {
            time,
            name
        });
    }, [time, name]);

    const handleDeleteTimer = useCallback(() => deleteTimer(id), [id]);

    const toggleEditMode = useCallback(() => setEditMode(prev => !prev), []);

    return (
        <Container
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimateSharedLayout>
                <motion.h2 layoutId="time">{!!hours && <>{stringHours}<span>:</span></>}{stringMinutes}<span>:</span>{stringSeconds}</motion.h2>
                <motion.h3 layoutId="name">{name}</motion.h3>
                <AnimatePresence>
                    {!editMode && (
                        <motion.footer
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <FiPlay onClick={openTimer} size={20} color={text} />
                            <FiEdit size={20} color={text} onClick={toggleEditMode} />
                            <FiTrash size={20} color={red} onClick={handleDeleteTimer} />
                        </motion.footer>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {editMode && (
                        <ButtonsContainer
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                        >
                            <Button onClick={toggleEditMode}>Cancel</Button>
                            <Button confirmButton>Confirm</Button>
                        </ButtonsContainer>
                    )}
                </AnimatePresence>
            </AnimateSharedLayout>
        </Container>
    );
}

export default TimerItem;