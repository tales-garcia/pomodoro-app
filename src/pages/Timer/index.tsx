import { ipcRenderer } from 'electron';
import React from 'react';
import Clock from '../../components/Clock';
import { Title } from './styles';

const {
        storedTime, storedMaxTime, name
    } = ipcRenderer.sendSync('get-timer-props');

const Timer: React.FC = () => {
    return (
        <>
            <Title>{name}</Title>
            <Clock maxTime={storedMaxTime} time={storedTime} />
        </>
    );
}

export default Timer;