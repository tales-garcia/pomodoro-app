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
        <div style={{ width: '100%' }}>
            <Container hasError={Number(!!error)} placeholder={placeholder} name={name} {...rest} />
            {error && <Error>{error}</Error>}
        </div>
    );
});

export default Input;