import { ipcRenderer } from 'electron';
import React, { useCallback, useMemo } from 'react';
import { FiPlay, FiEdit, FiTrash } from 'react-icons/fi';
import { useTheme } from 'styled-components';

import { Container } from './styles';

interface TimerItemProps {
    name: string;
    time: number;
}

const TimerItem: React.FC<TimerItemProps> = ({ name, time }) => {
    const { red, text } = useTheme();

    const minutes = useMemo(() => time ? Math.floor(time / 60) : null, [time]);
    const seconds = useMemo(() => time ? time % 60 : null, [time]);

    const splittedMinutes = useMemo(() => String(minutes).padStart(2, '0'), [minutes]);
    const splittedSeconds = useMemo(() => String(seconds).padStart(2, '0'), [seconds]);

    const openTimer = useCallback(() => {
        ipcRenderer.send('create-timer-window', {
            time,
            name
        });
    }, [time, name]);

    return (
        <Container>
            <h2>{splittedMinutes}<span>:</span>{splittedSeconds}</h2>
            <h3>{name}</h3>
            <footer>
                <FiPlay onClick={openTimer} size={20} color={text} />
                <FiEdit size={20} color={text} />
                <FiTrash size={20} color={red} />
            </footer>
        </Container>
    );
}

export default TimerItem;