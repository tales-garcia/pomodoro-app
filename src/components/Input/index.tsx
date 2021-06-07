import React from 'react';
import { Container } from './styles';
import { useField } from 'formik';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    placeholder: string;
}

const Input: React.FC<IInputProps> = React.memo(({ name, placeholder, ...rest }) => {
    const [, { error }] = useField(name);

    return (
        <Container placeholder={placeholder} name={name} {...rest} />
    );
});

export default Input;