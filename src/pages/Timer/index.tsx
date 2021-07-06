import { ipcRenderer, remote } from 'electron';
import React, { useEffect } from 'react';
import Clock from '../../components/Clock';
import { Title } from './styles';

const {
        storedTime, storedMaxTime, name
    } = ipcRenderer.sendSync('get-timer-props');

const Timer: React.FC = () => {

    useEffect(() => remote.getCurrentWindow().setTitle(`${!!name ? `${name} - ` : 'Unkown - '}Timer`), []);

    return (
        <>
            <Title>{name}</Title>
            <Clock maxTime={storedMaxTime} time={storedTime} />
        </>
    );
}

export default Timer;