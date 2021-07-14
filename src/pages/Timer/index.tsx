import React from 'react';
import Clock from '../../components/Clock';
import { useTimer } from '../../hooks/timer';
import { Title } from './styles';

const Timer: React.FC = () => {
    const { name } = useTimer();

    return (
        <>
            <Title>{name}</Title>
            <Clock />
        </>
    );
}

export default Timer;