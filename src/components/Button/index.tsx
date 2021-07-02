import React from 'react';

import { Container } from './styles';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  confirmButton?: boolean;
}

const Button: React.FC<IButtonProps> = ({ children, confirmButton, ...rest }) => {
  return (
    <Container confirmButton={Number(confirmButton)} {...rest}>
      {children}
    </Container>
  );
};

export default Button;