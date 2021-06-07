import React from 'react';
import { Container, Error } from './styles';
import { useField } from 'formik';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    placeholder: string;
}

const Input: React.FC<IInputProps> = React.memo(({ name, placeholder, ...rest }) => {
    const [, { error }] = useField(name);

    return (
        <>
            <Container hasError={Number(!!error)} placeholder={placeholder} name={name} {...rest} />
            {error && <Error>{error}</Error>}
        </>
    );
});

export default Input;