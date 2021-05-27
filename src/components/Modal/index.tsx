import React from 'react';

import { Overlay, Container } from './styles';

const Modal = React.forwardRef<HTMLDivElement>(({ children }, ref) => {
    return (
        <Overlay>
            <Container ref={ref}>
                {children}
            </Container>
        </Overlay>
    );
})

export default Modal;