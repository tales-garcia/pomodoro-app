import { ipcRenderer } from 'electron';
import React, { useCallback, useMemo } from 'react';
import { FiPlay, FiEdit, FiTrash } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import { useWorkspace } from '../../hooks/workspace';

import { Container } from './styles';

interface TimerItemProps {
    data: Timer;
}

const TimerItem: React.FC<TimerItemProps> = ({ data: { name, time, id } }) => {
    const { red, text } = useTheme();
    const { deleteTimer } = useWorkspace();

    const minutes = useMemo(() => time ? Math.floor(time / 60) : null, [time]);
    const seconds = useMemo(() => time ? time % 60 : null, [time]);

    const stringMinutes = useMemo(() => String(minutes).padStart(2, '0'), [minutes]);
    const stringSeconds = useMemo(() => String(seconds).padStart(2, '0'), [seconds]);

    const openTimer = useCallback(() => {
        ipcRenderer.send('create-timer-window', {
            time,
            name
        });
    }, [time, name]);

    const handleDeleteTimer = useCallback(() => deleteTimer(id), [id]);

    return (
        <Container>
            <h2>{stringMinutes}<span>:</span>{stringSeconds}</h2>
            <h3>{name}</h3>
            <footer>
                <FiPlay onClick={openTimer} size={20} color={text} />
                <FiEdit size={20} color={text} />
                <FiTrash size={20} color={red} onClick={handleDeleteTimer} />
            </footer>
        </Container>
    );
}

export default TimerItem;