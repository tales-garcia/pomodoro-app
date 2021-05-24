import styled from 'styled-components';
import { Field } from 'formik';

export const Container = styled(Field)`
    width: 100%;
    background: ${({ theme }) => theme.blue};
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.blue};
    outline: 0;
    padding: 15px;

    font: 500 1rem Montserrat, sans-serif;
    color: ${({ theme }) => theme.text};

    &::placeholder {
        color: ${({ theme }) => theme.text}70;
        font: 400 1rem Montserrat, sans-serif;
    }

    &:focus {
        border: 2px solid ${({ theme }) => theme.red};
    }
`;