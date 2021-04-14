import { ipcRenderer, remote } from 'electron';
import React from 'react';
import Clock from '../../components/Clock';
import { Title } from './styles';

const {
        storedTime, storedMaxTime, title
    } = ipcRenderer.sendSync('get-timer-props', remote.getCurrentWindow().id);

const Timer: React.FC = () => {
    return (
        <>
            <Title>{title}</Title>
            <Clock maxTime={storedMaxTime} time={storedTime} />
        </>
    );
}

export default Timer;