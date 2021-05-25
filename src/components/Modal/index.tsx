import React from 'react';

import { Overlay, Container } from './styles';

const Modal: React.FC = ({ children }) => {
    return (
        <Overlay>
            <Container>
                {children}
            </Container>
        </Overlay>
    );
}

export default Modal;