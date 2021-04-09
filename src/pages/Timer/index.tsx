import React from 'react';
import Clock from '../../components/Clock';
import { Title } from './styles';

const Timer: React.FC = () => {
    return (
        <>
            <Title>React</Title>
            <Clock />
        </>
    );
}

export default Timer;