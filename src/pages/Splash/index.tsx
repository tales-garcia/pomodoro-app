import React from 'react';
import splashLogo from '../../assets/splashLogo.png';

import { Container } from './styles';

const Splash: React.FC = () => {
    return (
        <Container>
            <img src={splashLogo} alt="Logo" />
        </Container>
    );
}

export default Splash;