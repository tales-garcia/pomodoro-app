import { ipcRenderer, remote } from 'electron';
import React, { useEffect } from 'react';
import Clock from '../../components/Clock';
import { Title } from './styles';
import { v4 } from 'uuid';

const {
    storedTime, storedMaxTime, name, id
} = ipcRenderer.sendSync('get-timer-props', remote.getCurrentWindow().id);

const Timer: React.FC = () => {

    useEffect(() => {
        remote.getCurrentWindow().setTitle(`${!!name ? `${name} - ` : 'Unkown - '}Timer`);

        if (!!id) {
            ipcRenderer.send('save-recent', id);
        } else if (!!storedMaxTime) {
            const finalTimer: Timer = {
                id: v4(),
                name: !!name ? name : 'Untitled',
                time: storedMaxTime
            };

            ipcRenderer.send('save-recent', finalTimer);
        }
    }, []);

    return (
        <>
            <Title>{name}</Title>
            <Clock maxTime={storedMaxTime} time={storedTime} />
        </>
    );
}

export default Timer;